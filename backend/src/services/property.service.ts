import propertyRepository from "../repositories/property.repository.js";
import type { PropertyFilterParams } from "../types/property.type.js";
import { calculateDailyPrice } from "../utils/price-calculator.util.js";
import AppError from "../errors/app.error.js";

class PropertyService {
  async getCities() {
    return propertyRepository.findDistinctCities();
  }

  async getFeatured() {
    return propertyRepository.findFeatured();
  }

  async getPropertyById(id: string, targetMonth?: Date) {
    const property = await propertyRepository.findById(id);
    if (!property) {
      throw new AppError("Property not found", 404);
    }

    const referenceDate = targetMonth || new Date();
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const roomsWithCalendar = property.rooms.map((room) => {
      const calendar = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const dailyPrice = calculateDailyPrice(currentDate, room.basePrice, room.peakSeasonRates);
        
        const isUnavailable = room.unavailabilities.some((u) => {
          const uDate = new Date(u.unavailabilityDate);
          return (
            uDate.getFullYear() === year &&
            uDate.getMonth() === month &&
            uDate.getDate() === day
          );
        });

        calendar.push({
          date: dateStr,
          price: dailyPrice,
          isAvailable: !isUnavailable,
        });
      }

      return {
        ...room,
        priceCalendar: calendar,
      };
    });

    return {
      ...property,
      rooms: roomsWithCalendar,
    };
  }

  async getProperties(params: PropertyFilterParams) {
    const { properties, total } = await propertyRepository.findManyWithFilters(params);

    const formattedProperties = properties.map((prop) => {
      const checkDate = params.checkInDate || new Date();
      let lowestPrice = Infinity;

      prop.rooms.forEach((room) => {
        const priceForDate = calculateDailyPrice(checkDate, room.basePrice, room.peakSeasonRates);
        if (priceForDate < lowestPrice) {
          lowestPrice = priceForDate;
        }
    });

    const startingPrice = lowestPrice === Infinity ? 0 : lowestPrice;

      return {
        ...prop,
        startingPrice,
      };
    });

    if (params.sortBy === "price") {
      formattedProperties.sort((a, b) =>
        params.sortOrder === "asc"
          ? a.startingPrice - b.startingPrice
          : b.startingPrice - a.startingPrice
      );
    } else if (params.sortBy === "name") {
      formattedProperties.sort((a, b) =>
        params.sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    }

    const page = params.page || 1;
    const limit = params.limit || 10;

    return {
      properties: formattedProperties,
      meta: {
        currentPages: page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    };
  }
}

export default new PropertyService();