import type { PeakSeasonRate, RoomUnavailability } from "../generated/prisma/client.js";
import { prisma } from "../libs/prisma.client.js";
import type { SetPeakSeasonRateInput } from "../types/room-management.type.js";

class RoomManagementRepository {
  async findRoomOwner(roomId: string): Promise<string | null> {
    const room = await prisma.room.findFirst({
      where: { id: roomId, deletedAt: null },
      select: { property: { select: { tenantId: true } } },
    });
    return room?.property?.tenantId || null;
  }

  async findUnavailabilityById(id: string): Promise<RoomUnavailability | null> {
    return prisma.roomUnavailability.findUnique({ where: { id } });
  }

  async findPeakSeasonRateById(id: string): Promise<PeakSeasonRate | null> {
    return prisma.peakSeasonRate.findFirst({ where: { id, deletedAt: null } });
  }

  async createUnavailabilities(
    roomId: string,
    dates: Date[],
    reason?: string
  ): Promise<{ count: number }> {
    return prisma.roomUnavailability.createMany({
      data: dates.map((d) => ({
        roomId,
        unavailabilityDate: d,
        reason,
      })),
      skipDuplicates: true,
    });
  }

  async findUnavailabilitiesByRoom(roomId: string): Promise<RoomUnavailability[]> {
    return prisma.roomUnavailability.findMany({
      where: { roomId },
      orderBy: { unavailabilityDate: "asc" },
    });
  }

  async deleteUnavailability(id: string): Promise<RoomUnavailability> {
    return prisma.roomUnavailability.delete({ where: { id } });
  }

  async createPeakSeasonRate(
    roomId: string,
    data: SetPeakSeasonRateInput
  ): Promise<PeakSeasonRate> {
    return prisma.peakSeasonRate.create({
      data: {
        roomId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        rateType: data.priceType,
        rateValue: data.value,
      },
    });
  }

  async findPeakSeasonRatesByRoom(roomId: string): Promise<PeakSeasonRate[]> {
    return prisma.peakSeasonRate.findMany({
      where: { roomId, deletedAt: null },
      orderBy: { startDate: "asc" },
    });
  }

  async deletePeakSeasonRate(id: string): Promise<PeakSeasonRate> {
    return prisma.peakSeasonRate.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export default new RoomManagementRepository();