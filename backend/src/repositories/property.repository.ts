import { prisma } from "../libs/prisma.client.js";
import type { PropertyFilterParams } from "../types/property.type.js";
import { OrderStatus, Prisma } from "../generated/prisma/client.js";

export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.MENUNGGU_PEMBAYARAN,
  OrderStatus.MENUNGGU_KONFIRMASI_PEMBAYARAN,
  OrderStatus.DIPROSES,
];

export type PropertyWithDetails = Prisma.PropertyGetPayload<{
  include: {
    category: true;
    pictures: true;
    rooms: {
      include: {
        peakSeasonRates: true;
        unavailabilities: true;
        orders: true;
      };
    };
  };
}>;

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

  async findById(id: string): Promise<PropertyWithDetails | null> {
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
            orders: { where: { status: { in: ACTIVE_ORDER_STATUSES } } },
          },
        },
      },
    });
  }

  private buildWhereClause(params: PropertyFilterParams): Prisma.PropertyWhereInput {
    const { city, categoryId, name } = params;
    const where: Prisma.PropertyWhereInput = { deletedAt: null };
    if (city) where.city = { contains: city, mode: "insensitive" };
    if (categoryId) where.categoryId = categoryId;
    if (name) where.name = { contains: name, mode: "insensitive" };
    return where;
  }

  private buildRoomWhere(params: PropertyFilterParams): Prisma.RoomWhereInput {
    const { guestCapacity, checkInDate, checkOutDate } = params;
    const roomWhere: Prisma.RoomWhereInput = { deletedAt: null };
    if (guestCapacity) roomWhere.guestCapacity = { gte: guestCapacity };
    if (checkInDate && checkOutDate) {
      roomWhere.unavailabilities = {
        none: { unavailabilityDate: { gte: checkInDate, lte: checkOutDate } },
      };
      roomWhere.orders = {
        none: {
          status: { in: ACTIVE_ORDER_STATUSES },
          OR: [{ checkInDate: { lte: checkOutDate }, checkOutDate: { gte: checkInDate } }],
        },
      };
    }
    return roomWhere;
  }

  private async getByPriceOrder(
    where: Prisma.PropertyWhereInput,
    roomWhere: Prisma.RoomWhereInput,
    params: PropertyFilterParams
  ) {
    const { sortOrder = "asc", page = 1, limit = 10 } = params;
    const fullRoomWhere: Prisma.RoomWhereInput = { ...roomWhere, property: where };
    const grouped = await prisma.room.groupBy({
      by: ["propertyId"],
      where: fullRoomWhere,
      _min: { basePrice: true },
      orderBy: { _min: { basePrice: sortOrder } },
    });
    const total = grouped.length;
    const pagedIds = grouped.slice((page - 1) * limit, page * limit).map((g) => g.propertyId);
    const raw = await prisma.property.findMany({
      where: { id: { in: pagedIds } },
      include: {
        category: true,
        pictures: true,
        rooms: { where: roomWhere, orderBy: { basePrice: "asc" } },
      },
    });
    const map = new Map(raw.map((p) => [p.id, p]));
    const properties = pagedIds.map((id) => map.get(id)!).filter(Boolean);
    return { properties, total };
  }

  private async getByNameOrder(
    where: Prisma.PropertyWhereInput,
    roomWhere: Prisma.RoomWhereInput,
    params: PropertyFilterParams
  ) {
    const { sortOrder = "asc", page = 1, limit = 10 } = params;
    where.rooms = { some: roomWhere };
    const total = await prisma.property.count({ where });
    const raw = await prisma.property.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: sortOrder },
      include: {
        category: true,
        pictures: true,
        rooms: { where: roomWhere, orderBy: { basePrice: "asc" } },
      },
    });
    return { properties: raw, total };
  }

  async findManyWithFilters(params: PropertyFilterParams) {
    const where = this.buildWhereClause(params);
    const roomWhere = this.buildRoomWhere(params);
    const { sortBy = "name", page = 1, limit = 10 } = params;
    const res = sortBy === "price"
      ? await this.getByPriceOrder(where, roomWhere, params)
      : await this.getByNameOrder(where, roomWhere, params);
    const properties = res.properties.map((p) => ({
      ...p,
      lowestPrice: p.rooms.length > 0 ? p.rooms[0].basePrice : 0,
    }));
    return { properties, total: res.total, page, limit, totalPages: Math.ceil(res.total / limit) };
  }
}

export default new PropertyRepository();