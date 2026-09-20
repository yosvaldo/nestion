import { prisma } from "../libs/prisma.client.js";
import type { PropertyFilterParams } from "../types/property.type.js";

class PropertyRepository {
  async findDistinctCities(): Promise<string[]> {
    const properties = await prisma.property.findMany({
      where: { deletedAt: null },
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    });
    return properties.map((p) => p.city);
  }

  async findFeatured() {
    return prisma.property.findMany({
      where: { deletedAt: null },
      take: 5,
      include: {
        category: true,
        pictures: true,
        rooms: {
          where: { deletedAt: null },
          include: { peakSeasonRates: { where: { deletedAt: null } } },
          orderBy: { basePrice: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.property.findFirst({
      where: { id, deletedAt: null },
      include: {
        category: true,
        pictures: true,
        rooms: {
          where: { deletedAt: null },
          include: {
            peakSeasonRates: { where: { deletedAt: null } },
            unavailabilities: true,
          },
        },
      },
    });
  }

  async findManyWithFilters(params: PropertyFilterParams) {
    const {
      city,
      categoryId,
      name,
      guestCapacity,
      checkInDate,
      checkOutDate,
      page = 1,
      limit = 10,
    } = params;

    const whereClause: any = { deletedAt: null };

    if (city) {
      whereClause.city = { contains: city, mode: "insensitive" };
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (name) {
      whereClause.name = { contains: name, mode: "insensitive" };
    }

    const roomWhere: any = { deletedAt: null };

    if (guestCapacity) {
      roomWhere.guestCapacity = { gte: guestCapacity };
    }

    if (checkInDate && checkOutDate) {
      roomWhere.unavailabilities = {
        none: {
          unavailabilityDate: {
            gte: checkInDate,
            lte: checkOutDate,
          },
        },
      };
      roomWhere.orders = {
        none: {
          status: { in: ["MENUNGGU_PEMBAYARAN", "MENUNGGU_KONFIRMASI_PEMBAYARAN", "DIPROSES"] },
          OR: [
            {
              checkInDate: { lte: checkOutDate },
              checkOutDate: { gte: checkInDate },
            },
          ],
        },
      };
    }

    whereClause.rooms = { some: roomWhere };

    const total = await prisma.property.count({ where: whereClause });

    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        category: true,
        pictures: true,
        rooms: {
          where: roomWhere,
          include: {
            peakSeasonRates: { where: { deletedAt: null } },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { properties, total };
  }
}

export default new PropertyRepository();