export interface PropertyFilterParams {
  city?: string;
  categoryId?: string;
  name?: string;
  checkInDate?: Date;
  checkOutDate?: Date;
  guestCapacity?: number;
  sortBy?: "price" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CreatePropertyInput {
  name: string;
  categoryId?: string;
  description?: string;
  city: string;
  address?: string;
  pictureUrls?: string[];
}

export interface UpdatePropertyInput {
  name?: string;
  categoryId?: string;
  description?: string;
  city?: string;
  address?: string;
}

export interface CreateRoomInput {
  name: string;
  description?: string;
  basePrice: number;
  guestCapacity?: number;
}

export interface UpdateRoomInput {
  propertyId?: string;
  name?: string;
  description?: string;
  basePrice?: number;
  guestCapacity?: number;
}

export interface PeakSeasonRateInput {
  roomId: string;
  startDate: Date;
  endDate: Date;
  rateType: "NOMINAL" | "PERCENTAGE";
  rateValue: number;
}