import authRepository from "../repositories/auth.repository.js";
import AppError from "../errors/app.error.js";
import AuthService from "./auth.service.js";
import { uploadToCloudinary } from "../utils/cloudinary.util.js";

export class ProfileService {
  static async getUserProfile(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw new AppError("User tidak ditemukan", 404);
    return user;
  }

  static async updateUserProfile(
    userId: string,
    data: { fullName?: string },
    file?: Express.Multer.File
  ) {
    const avatarUrl = file
      ? await uploadToCloudinary(file, "nestion/avatars")
      : undefined;

    return authRepository.updateProfile(userId, {
      ...data,
      ...(avatarUrl && { avatarUrl }),
    });
  }

  static async requestEmailUpdate(userId: string, newEmail: string) {
    const existing = await authRepository.findByEmail(newEmail);
    if (existing) throw new AppError("Email sudah terdaftar oleh user lain", 400);

    const user = await authRepository.findById(userId);
    if (!user) throw new AppError("User tidak ditemukan", 404);

    const updatedUser = await authRepository.updateProfile(userId, {
      email: newEmail,
      isVerified: false,
    });

    await AuthService.sendVerificationEmail(userId, newEmail, user.role);
    return updatedUser;
  }
}

export default ProfileService;