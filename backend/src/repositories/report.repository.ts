import { prisma } from "../libs/prisma.client.js";
import { OrderStatus } from "../generated/prisma/client.js";

class ReportRepository {
  async getSales(tenantId: string, startDate?: string, endDate?: string, sortBy: "date" | "total" = "date") {
    const where: any = { room: { property: { tenantId } }, status: OrderStatus.DIPROSES };
    
    if (startDate && endDate) {
      where.createdAt = { gte: new Date(startDate), lte: new Date(endDate) };
    }
    
    return prisma.order.findMany({
      where,
      orderBy: sortBy === "total" ? { totalPrice: "desc" } : { createdAt: "desc" },
      include: { room: { include: { property: true } }, user: { select: { fullName: true, email: true } } }
    });
  }

  async getPropertyCalendar(tenantId: string) {
    return prisma.room.findMany({
      where: { property: { tenantId } },
      include: {
        property: { select: { name: true, city: true } },
        orders: {
          where: { status: { not: OrderStatus.DIBATALKAN } },
          select: { checkInDate: true, checkOutDate: true, status: true }
        }
      }
    });
  }
}
export default new ReportRepository();