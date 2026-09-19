import type { Request } from "express";
import multer, { type FileFilterCallback, type Multer } from "multer";
import AppError from "../errors/app.error.js";

const buildUploader = (
  allowedMimeTypes: string[],
  maxFileSizeInMB: number = 1
) => {
  const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new AppError(
          `Format file tidak valid. Format yang diperbolehkan: ${allowedMimeTypes.join(", ")}`,
          400
        )
      );
    }
    cb(null, true);
  };

  const ONE_MB = 1024 ** 2;
  const limits = { fileSize: maxFileSizeInMB * ONE_MB };
  
  return multer({ storage: multer.memoryStorage(), fileFilter, limits }) as Multer;
};

export default buildUploader;