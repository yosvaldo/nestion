import { prisma } from "../libs/prisma.client.js";
import type { Role } from "../generated/prisma/client.js";

class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isVerified: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createUser(email: string, role: "USER" | "TENANT") {
    return prisma.user.create({
      data: {
        email,
        role,
        isVerified: false,
      },
    });
  }

  async verifyAndSetPassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        password: passwordHash,
        isVerified: true,
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
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isVerified: true,
        avatarUrl: true,
      },
    });
  }
}

const authRepo = new AuthRepository();
export default authRepo;