import type { NextFunction, Request, Response } from "express";
import AppError from "../errors/app.error.js";
import userRepo from "../repositories/auth.repository.js";
import TokenService from "../services/token.service.js";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../libs/jwt.js";

export const uniqueUserGuard = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) throw new AppError("Email dibutuhkan", 400);

    const user = await userRepo.findByEmail(email);
    if (user) throw new AppError("Email sudah didaftarkan", 400);
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyToken = (type: "access" | "refresh") => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
        const isAccess = type === "access";
        const token = isAccess
            ? req.headers.authorization?.split(" ")[1]
            : req.cookies["refresh-token"];
        const secret = isAccess ? JWT_ACCESS_SECRET : JWT_REFRESH_SECRET;

        if (!token) throw new AppError("Authentication token dibutuhkan", 401);
        if (!secret) throw new AppError("Konfigurasi JWT secret error", 500);

        const decoded = TokenService.verify(token, secret);
        if (!decoded) throw new AppError("Session token invalid atau expired", 401);

        req.user = decoded as any;
        next();
    } catch (error) {
        next(error);
    }
  };
};

export const roleGuard = (...allowedRoles: ("USER" | "TENANT")[]) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("User tidak terautentikasi", 401);
      
      if (!allowedRoles.includes(req.user.role)) {
        throw new AppError(`Access denied untuk role: ${req.user.role}`, 403);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireVerifiedGuard = async (req: Request, _: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError("User tidak terautentikasi", 401);
    
    if (!req.user.isVerified) {
      throw new AppError("Account tidak terverifikasi. Mohon verifikasi email Anda.", 403);
    }
    next();
  } catch (error) {
    next(error);
  }
};