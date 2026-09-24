import AppError from "../errors/app.error.js";
import roomManagementRepository from "../repositories/room-management.repository.js";
import type {
  SetPeakSeasonRateInput,
  SetUnavailabilityInput,
} from "../types/room-management.type.js";

class RoomManagementService {
  private async verifyOwner(roomId: string, tenantId: string) {
    const ownerId = await roomManagementRepository.findRoomOwner(roomId);
    if (!ownerId) throw new AppError("Room not found.", 404);
    if (ownerId !== tenantId) throw new AppError("Access denied.", 403);
  }

  async setUnavailability(roomId: string, tenantId: string, data: SetUnavailabilityInput) {
    await this.verifyOwner(roomId, tenantId);
    
    const dates: Date[] = [];
    const current = new Date(data.startDate);
    const last = new Date(data.endDate);

    while (current <= last) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return roomManagementRepository.createUnavailabilities(roomId, dates, data.reason);
  }

  async getUnavailabilities(roomId: string, tenantId: string) {
    await this.verifyOwner(roomId, tenantId);
    return roomManagementRepository.findUnavailabilitiesByRoom(roomId);
  }

  async deleteUnavailability(id: string) {
    return roomManagementRepository.deleteUnavailability(id);
  }

  async setPeakSeasonRate(roomId: string, tenantId: string, data: SetPeakSeasonRateInput) {
    await this.verifyOwner(roomId, tenantId);
    return roomManagementRepository.createPeakSeasonRate(roomId, data);
  }

  async getPeakSeasonRates(roomId: string, tenantId: string) {
    await this.verifyOwner(roomId, tenantId);
    return roomManagementRepository.findPeakSeasonRatesByRoom(roomId);
  }

  async deletePeakSeasonRate(id: string) {
    return roomManagementRepository.deletePeakSeasonRate(id);
  }

  async fetchPublicHolidays(year?: string, month?: string) {
    let url = "https://upset.dev/tanggalmerah";
    const params = new URLSearchParams();
    if (year) params.append("year", year);
    if (month) params.append("month", month);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new AppError("Failed to fetch public holiday data.", 502);
    }
    return response.json();
  }
}

export default new RoomManagementService();