import type { NextFunction, Request, Response } from "express";
import { responseBuilder } from "../utils/response-builder.util.js";
import AppError from "../errors/app.error.js";
import cookieConfig from "../configs/cookie.config.js";
import AuthService from "../services/auth.service.js";
import PasswordService from "../services/password.service.js";
import ProfileService from "../services/profile.service.js";
import { signUpSchema, signInSchema, verifyEmailSchema, resendVerificationSchema, requestResetPasswordSchema, resetPasswordSchema, changePasswordSchema, updateProfileSchema, updateEmailSchema } from "../validators/auth.validator.js";

class AuthController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = await signUpSchema.parseAsync(req.body);
      await AuthService.registerUser(parsedData.email, parsedData.role, parsedData.bankDetails);

      return res
        .status(201)
        .send(responseBuilder(201, "Link registrasi sudah terkirim ke email Anda", null));
    } catch (error) {
      next(error);
    }
  };

  verifyEmailAndSetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = await verifyEmailSchema.parseAsync(req.body);
      await AuthService.verifyAndSetPassword(parsedData.token, parsedData.password);

      return res.send(responseBuilder(200, "Account berhasil diverifikasi. Mohon login.", null));
    } catch (error) {
      next(error);
    }
  };

  resendVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = await resendVerificationSchema.parseAsync(req.body);
      await AuthService.resendVerificationEmail(email);

      return res.send(responseBuilder(200, "Email verifikasi berhasil dikirim ulang", null));
    } catch (error) {
      next(error);
    }
  };

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = await signInSchema.parseAsync(req.body);
      const { user, accessToken, refreshToken } = await AuthService.signIn(email, password);

      return res
        .cookie("refresh-token", refreshToken, cookieConfig)
        .send(responseBuilder(200, "Login berhasil", { user, accessToken }));
    } catch (error) {
      next(error);
    }
  };

  signOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("User tidak terautentikasi", 401);
      
      res.clearCookie("refresh-token", cookieConfig);
      return res.send(responseBuilder(200, "Logout berhasil", null));
    } catch (error) {
      next(error);
    }
  };

  requestResetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = await requestResetPasswordSchema.parseAsync(req.body);
      await PasswordService.sendResetPasswordEmail(email);

      return res.send(responseBuilder(200, "Link password reset terkirim ke email", null));
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = await resetPasswordSchema.parseAsync(req.body);
      await PasswordService.resetPassword(token, newPassword);

      return res.send(responseBuilder(200, "Password berhasil direset. Mohon login", null));
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("User tidak terautentikasi", 401);

      const { currentPassword, newPassword } = await changePasswordSchema.parseAsync(req.body);
      await PasswordService.changePassword(req.user.id, currentPassword, newPassword);

      return res.send(responseBuilder(200, "Password berhasil diubah", null));
    } catch (error) {
      next(error);
    }
  };

  getAuthUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("User tidak terautentikasi", 401);
      
      const user = await ProfileService.getUserProfile(req.user.id);
      return res.send(responseBuilder(200, "Success", user));
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("User tidak terautentikasi", 401);

      const parsedData = await updateProfileSchema.parseAsync(req.body);
      const updatedUser = await ProfileService.updateUserProfile(req.user.id, parsedData, req.file);

      return res.send(responseBuilder(200, "Profil berhasil diupdate", updatedUser));
    } catch (error) {
      next(error);
    }
  };

  updateEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("User tidak terautentikasi", 401);

      const { email } = await updateEmailSchema.parseAsync(req.body);
      const updatedUser = await ProfileService.requestEmailUpdate(req.user.id, email);

      return res.send(
        responseBuilder(
          200,
          "Link verifikasi terkirim ke email baru Anda. Mohon verifikasi untuk melengkapi update.",
          null
        )
      );
    } catch (error) {
      next(error);
    }
  };

}

export default new AuthController();