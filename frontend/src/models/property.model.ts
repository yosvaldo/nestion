export interface PropertyFilterParams {
  city?: string;
  categoryId?: string;
  name?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestCapacity?: number;
  sortBy?: "price" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface RoomResponse {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  guestCapacity: number;
}

export interface PriceCalendarEntry {
  date: string; 
  price: number;
  isPeakSeason: boolean;
}

export interface PropertyDetailResponse {
  id: string;
  name: string;
  city: string;
  address: string;
  description: string;
  category: { name: string };
  pictureUrls: string[];
  rooms: RoomResponse[];
}