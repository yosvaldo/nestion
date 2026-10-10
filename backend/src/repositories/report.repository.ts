import { prisma } from "../libs/prisma.client.js";
import { OrderStatus, Prisma } from "../generated/prisma/client.js";

class ReportRepository {
  async getSales(tenantId: string, startDate?: string, endDate?: string, sortBy: "date" | "total" = "date") {
    const where: Prisma.OrderWhereInput = { 
      room: { property: { tenantId } }, 
      status: OrderStatus.DIPROSES 
    };
    
    if (startDate || endDate) {
      const dateFilter: Prisma.DateTimeFilter = {};

      if (startDate) {
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
        dateFilter.gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        dateFilter.lte = end;
      } else if (startDate) {
        const end = new Date(startDate);
        end.setUTCHours(23, 59, 59, 999);
        dateFilter.lte = end;
      }
      where.checkInDate = dateFilter;
    }
    
    return prisma.order.findMany({
      where,
      orderBy: sortBy === "total" ? { totalPrice: "desc" } : { checkInDate: "desc" },
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