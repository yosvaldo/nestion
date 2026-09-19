import type { User as PrismaUser } from "../generated/prisma/client.js";
import type { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<PrismaUser, "password">;
      file?: Multer.File;
      files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
    }
  }
}

export {};