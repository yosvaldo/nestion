import { prisma } from "../libs/prisma.client.js";

class AuthRepository {
  async createUser(email: string, role: "USER" | "TENANT") {
    return prisma.user.create({
      data: {
        email,
        role,
        isVerified: false,
      },
    });
  }

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
}

export default new AuthRepository();