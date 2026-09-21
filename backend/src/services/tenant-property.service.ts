import AppError from "../errors/app.error.js";
import tenantPropertyRepository from "../repositories/tenant-property.repository.js";
import type {
  CreatePropertyInput,
  CreateRoomInput,
  UpdatePropertyInput,
  UpdateRoomInput,
} from "../types/tenant-property.type.js";

class TenantPropertyService {
  async getMyProperties(tenantId: string) {
    return tenantPropertyRepository.findTenantProperties(tenantId);
  }

  async getMyPropertyById(id: string, tenantId: string) {
    const property = await tenantPropertyRepository.findTenantPropertyById(
      id,
      tenantId
    );
    if (!property) {
      throw new AppError("Property not found or access denied.", 404);
    }
    return property;
  }

  async createProperty(tenantId: string, data: CreatePropertyInput) {
    return tenantPropertyRepository.createProperty(tenantId, data);
  }

  async updateProperty(
    id: string,
    tenantId: string,
    data: UpdatePropertyInput
  ) {
    await this.getMyPropertyById(id, tenantId);
    return tenantPropertyRepository.updateProperty(id, data);
  }

  async deleteProperty(id: string, tenantId: string) {
    await this.getMyPropertyById(id, tenantId);
    return tenantPropertyRepository.deleteProperty(id);
  }

  async createRoom(
    propertyId: string,
    tenantId: string,
    data: CreateRoomInput
  ) {
    await this.getMyPropertyById(propertyId, tenantId);
    return tenantPropertyRepository.createRoom(propertyId, data);
  }

  async updateRoom(
    roomId: string,
    tenantId: string,
    data: UpdateRoomInput
  ) {
    const room = await tenantPropertyRepository.findRoomById(roomId);
    if (!room) throw new AppError("Room not found.", 404);

    await this.getMyPropertyById(room.propertyId, tenantId);
    return tenantPropertyRepository.updateRoom(roomId, data);
  }

  async deleteRoom(roomId: string, tenantId: string) {
    const room = await tenantPropertyRepository.findRoomById(roomId);
    if (!room) throw new AppError("Room not found.", 404);

    await this.getMyPropertyById(room.propertyId, tenantId);
    return tenantPropertyRepository.deleteRoom(roomId);
  }
}

export default new TenantPropertyService();