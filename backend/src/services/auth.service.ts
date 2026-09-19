import authRepository from "../repositories/auth.repository.js";
import { hashPassword, comparePassword } from "../libs/bcrypt.js";
import TokenService from "./token.service.js";
import { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } from "../libs/jwt.js";
import AppError from "../errors/app.error.js";
import EmailService from "./email.service.js";
import renderTemplate from "../libs/handlebars.js";
import type { BankDetails } from "../types/auth.type.js";
import { Role } from "../generated/prisma/enums.js";

type SessionUser = { id: string; role: string; isVerified: boolean };

export class AuthService {
  static async registerUser(email: string, role: Role, bankDetails?: BankDetails) {
    const user = await authRepository.createUser(email, role, bankDetails);
    await this.sendVerificationEmail(user.id, user.email, user.role);
    return user;
  }

  static async sendVerificationEmail(userId: string, email: string, role: string) {
    const token = TokenService.generate({ id: userId, email }, JWT_ACCESS_SECRET!, "1h");
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const html = renderTemplate("verify-email.hbs", { verifyUrl, role });

    await EmailService.sendEmail(email, "Verifikasi account Anda", html);
  }

  static async verifyAndSetPassword(token: string, password: string) {
    const decoded = TokenService.verify(token, JWT_ACCESS_SECRET!) as { id: string } || null;
    if (!decoded) throw new AppError("Link verifikasi expired atau invalid", 400);

    const user = await authRepository.findCredentialsById(decoded.id);
    if (!user) throw new AppError("User tidak ditemukan", 404);
    if (user.isVerified) throw new AppError("Account sudah terverifikasi", 400);

    const hashedPassword = await hashPassword(password);
    return authRepository.verifyAndSetPassword(user.id, hashedPassword);
  }

  static async resendVerificationEmail(email: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new AppError("User tidak ditemukan", 404);
    if (user.isVerified) throw new AppError("Account sudah terverifikasi", 400);

    await this.sendVerificationEmail(user.id, user.email, user.role);
  }

  static async signIn(email: string, plainPassword: string) {
    const user = await authRepository.findByEmail(email);
    if (!user?.password) throw new AppError("Email atau password invalid", 401);

    const isMatch = await comparePassword(plainPassword, user.password);
    if (!isMatch) throw new AppError("Email atau password tidak valid", 401);
    if (!user.isVerified) throw new AppError("Account belum terverifikasi. Mohon cek email Anda.", 403);

    const { password: _, ...safeUser } = user;
    return this.buildSession(safeUser);
  }

  static async refreshAccessToken(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw new AppError("User tidak ditemukan", 404);
    return this.buildSession(user);
  }

  private static buildSession(user: SessionUser) {
    const payload = { id: user.id, role: user.role, isVerified: user.isVerified };
    const accessToken = TokenService.generate(payload, JWT_ACCESS_SECRET!, JWT_ACCESS_EXPIRES_IN || "15m");
    const refreshToken = TokenService.generate(payload, JWT_REFRESH_SECRET!, JWT_REFRESH_EXPIRES_IN || "7d");
    return { user, accessToken, refreshToken };
  }
}

export default AuthService;