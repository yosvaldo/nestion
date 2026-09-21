import type { Property, Room } from "../generated/prisma/client.js";
import { prisma } from "../libs/prisma.client.js";
import type {
  CreatePropertyInput,
  CreateRoomInput,
  UpdatePropertyInput,
  UpdateRoomInput,
} from "../types/tenant-property.type.js";

class TenantPropertyRepository {
  async findTenantProperties(tenantId: string): Promise<Property[]> {
    return prisma.property.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        category: true,
        pictures: true,
        rooms: { where: { deletedAt: null } },
      },
      orderBy: { createdAt: "desc" },
    });
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
    const { pictureUrls, ...propertyData } = data;
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
      },
      include: { category: true, pictures: true, rooms: true },
    });
  }

  async updateProperty(
    id: string,
    data: UpdatePropertyInput
  ): Promise<Property> {
    return prisma.property.update({
      where: { id },
      data,
      include: { category: true, pictures: true, rooms: true },
    });
  }

  async deleteProperty(id: string): Promise<Property> {
    return prisma.property.update({
      where: { id },
      data: { deletedAt: new Date() },
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