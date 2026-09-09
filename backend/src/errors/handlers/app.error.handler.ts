import type { NextFunction } from "express";
import AppError from "../app.error.js";
import { Prisma } from "../../generated/prisma/client.js";
import { z } from "zod";
import jwt from "jsonwebtoken";

const { TokenExpiredError, JsonWebTokenError } = jwt;

export const appErrorHandler = (
  error: any,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return next(error);
  }

  if (error instanceof TokenExpiredError) {
    return next(new AppError("Token expired", 401));
  }

  if (error instanceof JsonWebTokenError) {
    return next(new AppError("Invalid token", 401));
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return next(new AppError("Record already exists", 409));
      case "P2025":
        return next(new AppError("Record not found", 404));
      default:
        return next(new AppError("Database request error", 400));
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return next(new AppError("Invalid database payload or parameters", 400));
  }

  if (error instanceof z.ZodError) {
    const formattedMessages = error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");

    return next(new AppError(formattedMessages, 400, error.issues));
  }

  return next(
    new AppError(
      error?.message || "Internal Server Error",
      error?.status ?? 500
    )
  );
};