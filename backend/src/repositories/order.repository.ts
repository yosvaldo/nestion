import { prisma } from "../libs/prisma.client.js";
import { OrderStatus, Prisma } from "../generated/prisma/client.js";
import type { OrderFilterParams } from "../types/order.type.js";

class OrderRepository {
  async create(data: Prisma.OrderUncheckedCreateInput) {
    return prisma.order.create({
      data,
      include: { room: { include: { property: true } } },
    });
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { room: { include: { property: true } }, user: true },
    });
  }

  async updateStatusAndProof(id: string, status: OrderStatus, proofUrl?: string) {
    return prisma.order.update({
      where: { id },
      data: {
        status,
        paymentProofUrl: proofUrl,
        paymentProofUploadedAt: proofUrl ? new Date() : undefined,
      },
    });
  }

  async cancelOrder(id: string) {
    return prisma.order.update({
      where: { id },
      data: { status: OrderStatus.DIBATALKAN },
    });
  }

  async findManyByUser(userId: string, params: OrderFilterParams) {
    const { status, startDate, search, page = 1, limit = 10 } = params;
    const where: Prisma.OrderWhereInput = { userId };

    if (status) where.status = status;
    if (startDate) {
      const d = new Date(startDate);
      where.checkInDate = { gte: d };
    }
    if (search) {
      where.orderNumber = { contains: search, mode: "insensitive" };
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { room: { include: { property: { include: { pictures: true } } } } },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total };
  }
}

export default new OrderRepository();