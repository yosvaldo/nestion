import type { Property, Room, Prisma } from "../generated/prisma/client.js";
import { prisma } from "../libs/prisma.client.js";
import type {
  CreatePropertyInput,
  CreateRoomInput,
  UpdatePropertyInput,
  UpdateRoomInput,
} from "../types/property.type.js";

class TenantPropertyRepository {
  async findTenantProperties(tenantId: string, page: number = 1, limit: number = 10, name?: string) {
    const where: Prisma.PropertyWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (name) {
      where.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
          pictures: true,
          rooms: { where: { deletedAt: null } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.property.count({ where })
    ]);

    return {
      properties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findTenantPropertyById(
    id: string,
    tenantId: string
  ): Promise<Property | null> {
    return prisma.property.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        category: true,
        pictures: true,
        rooms: { where: { deletedAt: null } },
      },
    });
  }

  async createProperty(
    tenantId: string,
    data: CreatePropertyInput
  ): Promise<Property> {
    const { pictureUrls, rooms, ...propertyData } = data;

    return prisma.property.create({
      data: {
        ...propertyData,
        tenantId,
        ...(pictureUrls && pictureUrls.length > 0
          ? {
              pictures: {
                createMany: {
                  data: pictureUrls.map((url) => ({ pictureUrl: url })),
                },
              },
            }
          : {}),
        rooms: {
          create: rooms.map((room) => ({
            name: room.name,
            basePrice: room.basePrice,
            guestCapacity: room.guestCapacity,
            description: room.description,
          }))
        }
      },
      include: { category: true, pictures: true, rooms: true },
    });
  }

  async updateProperty(
    id: string,
    data: UpdatePropertyInput
  ): Promise<Property> {
    const { pictureUrls, ...propertyData } = data;
    return prisma.property.update({
      where: { id },
      data: {
        ...propertyData,
        ...(pictureUrls && pictureUrls.length > 0
          ? {
            pictures: {
              deleteMany: {},
              createMany: {
                data: pictureUrls.map((url) => ({ pictureUrl: url })),
              },
            },
          }
        : {}),
      },
      include: { category: true, pictures: true, rooms: true },
    });
  }

  async deleteProperty(id: string): Promise<Property> {
    return prisma.property.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findRoomsByPropertyId(propertyId: string): Promise<Room[]> {
  return prisma.room.findMany({
    where: {
      propertyId,
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });
}

  async createRoom(propertyId: string, data: CreateRoomInput): Promise<Room> {
    return prisma.room.create({
      data: {
        ...data,
        propertyId,
      },
    });
  }

  async findRoomById(id: string): Promise<Room | null> {
    return prisma.room.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async updateRoom(id: string, data: UpdateRoomInput): Promise<Room> {
    return prisma.room.update({
      where: { id },
      data,
    });
  }

  async deleteRoom(id: string): Promise<Room> {
    return prisma.room.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export default new TenantPropertyRepository();