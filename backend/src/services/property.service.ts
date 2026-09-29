import propertyRepository, { type PropertyWithDetails } from "../repositories/property.repository.js";
import type { PropertyFilterParams } from "../types/property.type.js";
import { calculateDailyPrice } from "../utils/price-calculator.util.js";
import AppError from "../errors/app.error.js";

type RoomWithDetails = PropertyWithDetails["rooms"][number];

class PropertyService {
  async getCities() {
    return propertyRepository.findDistinctCities();
  }

  async getFeatured() {
    return propertyRepository.findFeatured();
  }

  private isRoomUnavailableOnDate(date: Date, unavailabilities: any[], orders: any[]): boolean {
    const targetTime = date.getTime();
    const isExplicitlyUnavailable = unavailabilities.some((u) => {
      const uDate = new Date(u.unavailabilityDate);
      return uDate.getFullYear() === date.getFullYear() &&
             uDate.getMonth() === date.getMonth() &&
             uDate.getDate() === date.getDate();
    });

    if (isExplicitlyUnavailable) return true;

    return orders.some((o) => {
      const checkIn = new Date(o.checkInDate).getTime();
      const checkOut = new Date(o.checkOutDate).getTime();
      return targetTime >= checkIn && targetTime < checkOut;
    });
  }

  private generateRoomCalendar(room: RoomWithDetails, year: number, month: number) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const calendar = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dailyPrice = calculateDailyPrice(currentDate, room.basePrice, room.peakSeasonRates);
      const isUnavailable = this.isRoomUnavailableOnDate(currentDate, room.unavailabilities || [], room.orders || []);

      calendar.push({ date: dateStr, price: dailyPrice, isAvailable: !isUnavailable });
    }

    return calendar;
  }

  async getPropertyById(id: string, year?: number, month?: number) {
    const property = await propertyRepository.findById(id);
    if (!property) throw new AppError("Property not found", 404);

    const targetYear = year || new Date().getFullYear();
    const targetMonth = month || new Date().getMonth() + 1;

    const roomsWithCalendar = property.rooms.map((room) => ({
      ...room,
      priceCalendar: this.generateRoomCalendar(room, targetYear, targetMonth),
    }));

    return { ...property, rooms: roomsWithCalendar };
  }

  async getPropertyCalendar(id: string, year: number, month: number) {
    const property = await propertyRepository.findById(id);
    if (!property) throw new AppError("Property not found", 404);

    const roomCalendars = property.rooms.map((room) => ({
      roomId: room.id,
      roomName: room.name,
      basePrice: room.basePrice,
      calendar: this.generateRoomCalendar(room, year, month),
    }));

    return { propertyId: property.id, propertyName: property.name, year, month, rooms: roomCalendars };
  }

  async getProperties(params: PropertyFilterParams) {
    const { properties, total } = await propertyRepository.findManyWithFilters(params);
    const checkDate = params.checkInDate || new Date();

    const formatted = properties.map((prop) => {
      let lowestPrice = Infinity;
      prop.rooms.forEach((room) => {
        console.log(room);
        const price = calculateDailyPrice(checkDate, room.basePrice, room.peakSeasonRates);
        if (price < lowestPrice) lowestPrice = price;
    });
      return { ...prop, startingPrice: lowestPrice === Infinity ? 0 : lowestPrice };
    });

    this.sortProperties(formatted, params.sortBy, params.sortOrder);
    const page = params.page || 1;
    const limit = params.limit || 10;

    return {
      properties: formatted,
      meta: { currentPages: page, limit, totalPages: Math.ceil(total / limit), totalItems: total },
    };
  }

  private sortProperties(properties: any[], sortBy?: string, sortOrder?: string) {
    const multiplier = sortOrder === "desc" ? -1 : 1;
    if (sortBy === "price") {
      properties.sort((a, b) => (a.startingPrice - b.startingPrice) * multiplier);
    } else if (sortBy === "name") {
      properties.sort((a, b) => a.name.localeCompare(b.name) * multiplier);
    }
  }
}

export default new PropertyService();