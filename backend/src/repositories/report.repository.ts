import { prisma } from "../libs/prisma.client.js";
import { OrderStatus } from "../generated/prisma/client.js";

class ReportRepository {
  async getSales(tenantId: string, startDate?: string, endDate?: string, sortBy: "date" | "total" = "date") {
    const where: any = { 
      room: { property: { tenantId } }, 
      status: OrderStatus.DIPROSES 
    };
    
    if (startDate || endDate) {
      where.createdAt = {};

      if (startDate) {
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
        where.createdAt.gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      } else if (startDate) {
        const end = new Date(startDate);
        end.setUTCHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }
    
    return prisma.order.findMany({
      where,
      orderBy: sortBy === "total" ? { totalPrice: "desc" } : { createdAt: "desc" },
      include: { 
        room: { include: { property: true } }, 
        user: { select: { fullName: true, email: true } } 
      }
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