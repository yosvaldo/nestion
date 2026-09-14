import type { NextFunction, Request, Response } from "express";
import { responseBuilder } from "../utils/response-builder.util.js";
import AppError from "../errors/app.error.js";
import cookieConfig from "../configs/cookie.config.js";
import authService from "../services/auth.service.js";
import { signUpSchema, verifyEmailSchema, resetPasswordSchema, requestResetPasswordSchema, updateProfileSchema, updateEmailSchema } from "../validators/auth.validator.js";

class AuthController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = await signUpSchema.parseAsync(req.body);
      await authService.registerUser(parsedData.email, parsedData.role);

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
      await authService.verifyAndSetPassword(parsedData.token, parsedData.password);

      return res.send(responseBuilder(200, "Account berhasil diverifikasi. Mohon login.", null));
    } catch (error) {
      next(error);
    }
  };

  resendVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email) throw new AppError("Email dibutuhkan", 400);
      await authService.resendVerificationEmail(email);

      return res.send(responseBuilder(200, "Email verifikasi berhasil dikirim ulang", null));
    } catch (error) {
      next(error);
    }
  };

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await authService.signIn(email, password);

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
      await authService.sendResetPasswordEmail(email);

      return res.send(responseBuilder(200, "Link password reset terkirim ke email", null));
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = await resetPasswordSchema.parseAsync(req.body);
      await authService.resetPassword(token, newPassword);

      return res.send(responseBuilder(200, "Password berhasil direset", null));
    } catch (error) {
      next(error);
    }
  };

  getAuthUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("User tidak terautentikasi", 401);
      
      const user = await authService.getUserProfile(req.user.id);
      return res.send(responseBuilder(200, "Success", user));
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("User tidak terautentikasi", 401);

      const parsedData = await updateProfileSchema.parseAsync(req.body);
      const updatedUser = await authService.updateUserProfile(
        req.user.id,
        parsedData,
        req.file
      );

      return res.send(responseBuilder(200, "Profil berhasil diupdate", updatedUser));
    } catch (error) {
      next(error);
    }
  };

  updateEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("User tidak terautentikasi", 401);

      const { email } = await updateEmailSchema.parseAsync(req.body);
      await authService.requestEmailUpdate(req.user.id, email);

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