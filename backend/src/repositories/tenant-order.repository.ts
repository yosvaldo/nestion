import { prisma } from "../libs/prisma.client.js";
import { OrderStatus, Prisma } from "../generated/prisma/client.js";

class TenantOrderRepository {
  async findMany(tenantId: string, status?: OrderStatus, page = 1, limit = 10) {
    const where: Prisma.OrderWhereInput = { room: { property: { tenantId } } };
    if (status) where.status = status;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" },
        include: { room: { include: { property: true } }, user: true }
      }),
      prisma.order.count({ where })
    ]);
    return { orders, total };
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { room: { include: { property: true } }, user: true }
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({ where: { id }, data: { status } });
  }
}
export default new TenantOrderRepository();