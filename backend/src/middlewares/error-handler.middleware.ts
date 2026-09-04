import type { Request, Response, NextFunction } from "express";
import AppError from "../errors/app.error.js";
import { appErrorHandler } from "../errors/handlers/app.error.handler.js";

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  appErrorHandler(err, (mappedError: any) => {
    const error =
      mappedError instanceof AppError
        ? mappedError
        : err instanceof AppError
        ? err
        : new AppError("Internal Server Error", 500);

    return res.status(error.status).json({
      status: error.status,
      message: error.message,
      ...(error.object ? { errors: error.object } : {}),
    });
  });
};

export default errorHandler;