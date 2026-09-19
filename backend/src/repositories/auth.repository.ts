import { User } from "../generated/prisma/client.js";
import { prisma } from "../libs/prisma.client.js";
import type { BankDetails } from "../types/auth.type.js";

const publicSelect = {
  id: true,
  email: true,
  fullName: true,
  role: true,
  isVerified: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: publicSelect });
  }

  async findCredentialsById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async createUser(email: string, role: "USER" | "TENANT", bankDetails?: BankDetails) {
    return prisma.user.create({
      data: { email, role, isVerified: false, ...(bankDetails ?? {}) },
    });
  }

  async verifyAndSetPassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash, isVerified: true },
    });
  }

  async setResetPasswordToken(userId: string, tokenHash: string, expiresAt: Date) {
    return prisma.user.update({
      where: { id: userId },
      data: { resetPasswordToken: tokenHash, resetPasswordExpiresAt: expiresAt },
    });
  }

  async findByResetToken(tokenHash: string) {
    return prisma.user.findFirst({
      where: {
        resetPasswordToken: tokenHash,
        resetPasswordExpiresAt: { gt: new Date() },
      },
    });
  }

  async resetPasswordWithToken(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        password: passwordHash,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
      },
    });
  }

  async updatePassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash },
    });
  }

  async updateProfile(
    userId: string,
    data: { fullName?: string; avatarUrl?: string; email?: string; isVerified?: boolean }
  ) {
    return prisma.user.update({ where: { id: userId }, data, select: publicSelect });
  }
}

const authRepo = new AuthRepository();
export default authRepo;