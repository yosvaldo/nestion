import propertyRepository from "../repositories/property.repository.js";
import type { PropertyFilterParams } from "../types/property.type.js";

class PropertyService {
  async getCities() {
    return propertyRepository.findDistinctCities();
  }

  async getFeatured() {
    return propertyRepository.findFeatured();
  }

  async getProperties(params: PropertyFilterParams) {
    const { properties, total } = await propertyRepository.findManyWithFilters(params);

    const formattedProperties = properties.map((prop) => {
      const startingPrice = prop.rooms.length > 0 ? prop.rooms[0].basePrice : 0;
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