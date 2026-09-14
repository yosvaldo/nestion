import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import RefreshTokenController from "../controllers/refresh-token.controller.js";
import { verifyToken, uniqueUserGuard } from "../middlewares/auth.middleware.js";
import { avatarUploader } from "../middlewares/upload.middleware.js";

export const authRouter = Router();

authRouter.post("/sign-up", uniqueUserGuard, AuthController.signUp);
authRouter.post("/verify-email", AuthController.verifyEmailAndSetPassword);
authRouter.post("/resend-verification", AuthController.resendVerification);
authRouter.post("/sign-in", AuthController.signIn);
authRouter.post("/request-reset-password", AuthController.requestResetPassword);
authRouter.post("/reset-password", AuthController.resetPassword);

authRouter.post(
  "/refresh-token",
  verifyToken("refresh"),
  RefreshTokenController.refreshToken
);

authRouter.use(verifyToken("access"));
authRouter.post("/sign-out", AuthController.signOut);
authRouter.get("/me", AuthController.getAuthUser);

authRouter.patch(
  "/profile",
  avatarUploader().single("avatar"),
  AuthController.updateProfile
);
authRouter.patch("/email", AuthController.updateEmail);

export default authRouter;