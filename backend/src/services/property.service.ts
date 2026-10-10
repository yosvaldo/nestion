import propertyRepository, { type PropertyWithDetails } from "../repositories/property.repository.js";
import type { PropertyFilterParams } from "../types/property.type.js";
import { calculateDailyPrice } from "../utils/price-calculator.util.js";
import AppError from "../errors/app.error.js";

type RoomWithDetails = PropertyWithDetails["rooms"][number];

class PropertyService {
  private cachedAllCities: string[] = [];

  async getAllIndonesiaCities() {
    if (this.cachedAllCities.length > 0) return this.cachedAllCities;
    try {
      const provRes = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
      if (!provRes.ok) throw new Error("Gagal mengambil provinsi");
      const provinces = await provRes.json();
      
      const cityPromises = provinces.map((p: any) =>
        fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${p.id}.json`).then(res => res.json())
      );
      
      const citiesArrays = await Promise.all(cityPromises);
      const allCities = citiesArrays.flat().map((c: any) => c.name);
      
      this.cachedAllCities = allCities.sort();
      return this.cachedAllCities;
    } catch (error) {
      return ["KOTA JAKARTA PUSAT", "KOTA SURABAYA", "KOTA BANDUNG", "KOTA YOGYAKARTA", "KOTA DENPASAR"];
    }
  }

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
      return uDate.getUTCFullYear() === date.getFullYear() &&
             uDate.getUTCMonth() === date.getMonth() &&
             uDate.getUTCDate() === date.getDate();
    });
    if (isExplicitlyUnavailable) return true;
    return orders.some((o) => {
      const checkIn = new Date(o.checkInDate);
      const checkOut = new Date(o.checkOutDate);
      const normalizedCheckIn = new Date(
        checkIn.getUTCFullYear(), 
        checkIn.getUTCMonth(), 
        checkIn.getUTCDate()
      ).getTime();      
      const normalizedCheckOut = new Date(
        checkOut.getUTCFullYear(), 
        checkOut.getUTCMonth(), 
        checkOut.getUTCDate()
      ).getTime();
      return targetTime >= normalizedCheckIn && targetTime < normalizedCheckOut;
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
      roomId: room.id, roomName: room.name, basePrice: room.basePrice,
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
    if (sortBy === "price") properties.sort((a, b) => (a.startingPrice - b.startingPrice) * multiplier);
    else if (sortBy === "name") properties.sort((a, b) => a.name.localeCompare(b.name) * multiplier);
  }
}

export default new PropertyService();