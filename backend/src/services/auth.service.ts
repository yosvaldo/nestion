import authRepository from "../repositories/auth.repository.js";
import { hashPassword, comparePassword } from "../libs/bcrypt.js";
import TokenService from "./token.service.js";
import { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } from "../libs/jwt.js";
import AppError from "../errors/app.error.js";
import EmailService from "./email.service.js";
import renderTemplate from "../libs/handlebars.js";
import Cloudinary from "../libs/cloudinary.js";
import { Readable } from "stream";
import { uploadToCloudinary } from "../utils/cloudinary.util.js";

export class AuthService {
  static async registerUser(email: string, role: "USER" | "TENANT") {
    const existing = await authRepository.findByEmail(email);
    if (existing) throw new AppError("Email sudah terdaftar", 400);

    const user = await authRepository.createUser(email, role);
    const verificationToken = TokenService.generate(
      { id: user.id, email: user.email },
      JWT_ACCESS_SECRET!,
      "1h"
    );

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const html = renderTemplate("verify-email.hbs", { verifyUrl, role });
    
    EmailService.sendEmail(user.email, "Verifikasi account Anda", html)

    return user;
  }

  static async verifyAndSetPassword(token: string, password: string) {
    const decoded = TokenService.verify(token, JWT_ACCESS_SECRET!) as { id: string };
    if (!decoded) throw new AppError("Link verifikasi expired atau invalid", 400);

    const user = await authRepository.findById(decoded.id);
    if (!user) throw new AppError("User tidak ditemukan", 404);
    if (user.isVerified) throw new AppError("Account sudah terverifikasi", 400);

    const hashedPassword = await hashPassword(password);
    return authRepository.verifyAndSetPassword(user.id, hashedPassword);
  }

  static async signIn(email: string, plainPassword: string) {
    const user = await authRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new AppError("Email atau password invalid", 401);
    }

    const isMatch = await comparePassword(plainPassword, user.password);
    if (!isMatch) throw new AppError("Email atau password tidak valid", 401);

    if (!user.isVerified) {
      throw new AppError("Account belum terverifikasi. Mohon verifikasi melalui link di email.", 403);
    }

    const payload = { id: user.id, role: user.role, isVerified: user.isVerified };
    const accessToken = TokenService.generate(payload, JWT_ACCESS_SECRET!, JWT_ACCESS_EXPIRES_IN || "15m");
    const refreshToken = TokenService.generate(payload, JWT_REFRESH_SECRET!, JWT_REFRESH_EXPIRES_IN || "7d");

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  static async refreshAccessToken(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw new AppError("User tidak ditemukan", 404);

    const payload = { id: user.id, role: user.role, isVerified: user.isVerified };
    const accessToken = TokenService.generate(payload, JWT_ACCESS_SECRET!, JWT_ACCESS_EXPIRES_IN || "15m");
    const refreshToken = TokenService.generate(payload, JWT_REFRESH_SECRET!, JWT_REFRESH_EXPIRES_IN || "7d");

    return { user, accessToken, refreshToken };
  }

  static async resendVerificationEmail(email: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new AppError("User tidak ditemukan", 404);
    if (user.isVerified) throw new AppError("Account sudah terverifikasi", 400);

    const verificationToken = TokenService.generate(
      { id: user.id, email: user.email },
      JWT_ACCESS_SECRET!,
      "1h"
    );

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const html = renderTemplate("verify-email.hbs", { verifyUrl, role: user.role });
    await EmailService.sendEmail(user.email, "Verify Your Property Renting Account", html);
  }

  static async sendResetPasswordEmail(email: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new AppError("User tidak ditemukan", 404);
    if (!user.password) throw new AppError("Tidak dapat reset password untuk social login accounts", 400);

    const resetToken = TokenService.generate({ id: user.id }, JWT_ACCESS_SECRET!, "1h");
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = renderTemplate("reset-password.hbs", { resetUrl });

    await EmailService.sendEmail(user.email, "Reset password Anda", html);
  }

  static async resetPassword(token: string, newPassword: string) {
    const decoded = TokenService.verify(token, JWT_ACCESS_SECRET!) as { id: string };
    if (!decoded) throw new AppError("Reset link expired atau invalid", 400);

    const hashedPassword = await hashPassword(newPassword);
    return authRepository.updatePassword(decoded.id, hashedPassword);
  }

  static async getUserProfile(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw new AppError("User tidak ditemukan", 404);
    return user;
  }

  static async updateUserProfile(userId: string, data: { fullName?: string; }, file?: Express.Multer.File) {
    const user = await authRepository.findById(userId);
    if (!user) throw new AppError("User tidak ditemukan", 404);

    const avatarUrl = file
      ? await uploadToCloudinary(file, "nestion/avatars")
      : undefined;

    return authRepository.updateProfile(userId, {
      ...data,
      ...(avatarUrl && { avatarUrl }),
    });
  }

  static async requestEmailUpdate(userId: string, newEmail: string) {
    const existing = await authRepository.findByEmail(newEmail);
    if (existing) throw new AppError("Email sudah terdaftar oleh user lain", 400);

    const user = await authRepository.findById(userId);
    if (!user) throw new AppError("User tidak ditemukan", 404);

    const updatedUser = await authRepository.updateProfile(userId, {
        email: newEmail,
        isVerified: false,
    });

    await this.resendVerificationEmail(newEmail);
    return updatedUser;
  }
}

export default AuthService;