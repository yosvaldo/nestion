import { prisma } from "../libs/prisma.client.js";
import type { PropertyFilterParams } from "../types/property.type.js";

class PropertyRepository {
  async findDistinctCities(): Promise<string[]> {
    const properties = await prisma.property.findMany({
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    });
    return properties.map((p) => p.city);
  }

  async findFeatured() {
    return prisma.property.findMany({
      take: 5,
      include: {
        category: true,
        pictures: true,
        rooms: {
          orderBy: { basePrice: "asc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
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

    const whereClause: any = {};

    if (city) {
      whereClause.city = { contains: city, mode: "insensitive" };
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (name) {
      whereClause.name = { contains: name, mode: "insensitive" };
    }

    if (guestCapacity || (checkInDate && checkOutDate)) {
      whereClause.rooms = {
        some: {
          ...(guestCapacity ? { guestCapacity: { gte: guestCapacity } } : {}),
          ...(checkInDate && checkOutDate
            ? {
                unavailabilities: {
                  none: {
                    unavailabilityDate: {
                      gte: checkInDate,
                      lte: checkOutDate,
                    },
                  },
                },
              }
            : {}),
        },
      };
    }

    const total = await prisma.property.count({ where: whereClause });

    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        category: true,
        pictures: true,
        rooms: {
          orderBy: { basePrice: "asc" },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { properties, total };
  }
}

export default new PropertyRepository();