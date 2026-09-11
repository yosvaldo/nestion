import type { NextFunction, Request, Response } from "express";
import AppError from "../errors/app.error.js";
import userRepo from "../repositories/auth.repository.js";
import TokenService from "../services/token.service.js";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../libs/jwt.js";

export const uniqueUserGuard = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await userRepo.findByEmail({ email });
    if (user) throw new AppError("Email is already registered", 400);
    next();
  } catch (error) {
    next(error);
  }
};

export const roleGuard = (...allowedRoles: ("USER" | "TENANT")[]) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("User not authenticated", 401);
      if (!allowedRoles.includes(req.user.role)) {
        throw new AppError(`Access denied for role: ${req.user.role}`, 403);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireVerifiedGuard = async (req: Request, _: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError("User not authenticated", 401);
    if (!req.user.isVerified) {
      throw new AppError("Account is not verified. Please check your email.", 403);
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyToken = (type: "access" | "refresh") => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      let token: string | undefined;
      let secret: string | undefined;

      if (type === "access") {
        token = req.headers.authorization?.split(" ")[1];
        secret = JWT_ACCESS_SECRET;
      } else {
        token = req.cookies["refresh-token"];
        secret = JWT_REFRESH_SECRET;
      }

      if (!token) return next(new AppError("Token not provided", 401));
      if (!secret) return next(new AppError("Secret key configured improperly", 500));

      const decoded = TokenService.verify(token, secret);
      if (!decoded) return next(new AppError("Invalid or expired token", 403));

      req.user = decoded as any;
      next();
    } catch (error) {
      next(error);
    }
  };
};