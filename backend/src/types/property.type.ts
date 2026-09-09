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