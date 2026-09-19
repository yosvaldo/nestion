import Cloudinary from "../libs/cloudinary.js";
import AppError from "../errors/app.error.js";
import { Readable } from "stream";

export const uploadToCloudinary = (
  file: Express.Multer.File,
  folder: string
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const stream = Cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err || !result) {
          return reject(new AppError("Upload file gagal", 500, err));
        }
        resolve(result.secure_url);
      }
    );
    Readable.from(file.buffer).pipe(stream);
  });
};