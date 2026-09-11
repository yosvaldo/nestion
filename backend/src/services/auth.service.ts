import authRepository from "../repositories/auth.repository.js";
import { hashPassword, comparePassword } from "../libs/bcrypt.js";
import TokenService from "./token.service.js";
import { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } from "../libs/jwt.js";
import AppError from "../errors/app.error.js";
import EmailService from "./email.service.js";
import renderTemplate from "../libs/handlebars.js";

export class AuthService {
  static async registerUser(email: string, role: "USER" | "TENANT") {
    const existing = await authRepository.findByEmail(email);
    if (existing) throw new AppError("Email already registered", 400);

    const user = await authRepository.createUser(email, role);
    const verificationToken = TokenService.generate(
      { id: user.id, email: user.email },
      JWT_ACCESS_SECRET!,
      "1h"
    );

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const html = renderTemplate("verify-email.hbs", { verifyUrl, role });
    
    EmailService.sendEmail(user.email, "Verify Your Property Renting Account", html)

    return user;
  }

  static async verifyAndSetPassword(token: string, password: string) {
    const decoded = TokenService.verify(token, JWT_ACCESS_SECRET!) as { id: string };
    if (!decoded) throw new AppError("Verification link expired or invalid", 400);

    const user = await authRepository.findById(decoded.id);
    if (!user) throw new AppError("User not found", 404);
    if (user.isVerified) throw new AppError("Account is already verified", 400);

    const hashedPassword = await hashPassword(password);
    return authRepository.verifyAndSetPassword(user.id, hashedPassword);
  }

  static async signIn(email: string, plainPassword: string) {
    const user = await authRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await comparePassword(plainPassword, user.password);
    if (!isMatch) throw new AppError("Invalid email or password", 401);

    if (!user.isVerified) {
      throw new AppError("Account not verified. Please verify via email link.", 403);
    }

    const payload = { id: user.id, role: user.role, isVerified: user.isVerified };
    const accessToken = TokenService.generate(payload, JWT_ACCESS_SECRET!, JWT_ACCESS_EXPIRES_IN || "15m");
    const refreshToken = TokenService.generate(payload, JWT_REFRESH_SECRET!, JWT_REFRESH_EXPIRES_IN || "7d");

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  static async resendVerificationEmail(email: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new AppError("User not found", 404);
    if (user.isVerified) throw new AppError("Account is already verified", 400);

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
    if (!user) throw new AppError("User not found", 404);
    if (!user.password) throw new AppError("Cannot reset password for social login accounts", 400);

    const resetToken = TokenService.generate({ id: user.id }, JWT_ACCESS_SECRET!, "1h");
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = renderTemplate("reset-password.hbs", { resetUrl });

    await EmailService.sendEmail(user.email, "Reset Your Password", html);
  }

  static async resetPassword(token: string, newPassword: string) {
    const decoded = TokenService.verify(token, JWT_ACCESS_SECRET!) as { id: string };
    if (!decoded) throw new AppError("Reset link expired or invalid", 400);

    const hashedPassword = await hashPassword(newPassword);
    return authRepository.updatePassword(decoded.id, hashedPassword);
  }

  static async getUserProfile(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    return user;
  }
}

export default AuthService;