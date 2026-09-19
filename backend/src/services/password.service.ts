import { createHash, randomBytes } from "crypto";
import authRepository from "../repositories/auth.repository.js";
import { hashPassword, comparePassword } from "../libs/bcrypt.js";
import AppError from "../errors/app.error.js";
import EmailService from "./email.service.js";
import renderTemplate from "../libs/handlebars.js";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export class PasswordService {
  static async sendResetPasswordEmail(email: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new AppError("User tidak ditemukan", 404);
    if (!user.password) {
      throw new AppError("Tidak dapat reset password untuk social login accounts", 400);
    }

    const rawToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await authRepository.setResetPasswordToken(user.id, hashToken(rawToken), expiresAt);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
    const html = renderTemplate("reset-password.hbs", { resetUrl, fullName: user.fullName });
    await EmailService.sendEmail(user.email, "Reset password Nestion Anda", html);
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await authRepository.findByResetToken(hashToken(token));
    if (!user) throw new AppError("Reset link invalid atau sudah expired", 400);

    const hashedPassword = await hashPassword(newPassword);
    await authRepository.resetPasswordWithToken(user.id, hashedPassword);
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await authRepository.findCredentialsById(userId);
    if (!user?.password) throw new AppError("User tidak ditemukan", 404);

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) throw new AppError("Password saat ini tidak sesuai", 400);

    const hashedPassword = await hashPassword(newPassword);
    return authRepository.updatePassword(userId, hashedPassword);
  }
}

export default PasswordService;