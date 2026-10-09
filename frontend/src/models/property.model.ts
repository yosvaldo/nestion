import * as z from "zod";

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
  isAvailable?: boolean;
}

export interface PropertyDetailResponse {
  id: string;
  name: string;
  city: string;
  address: string;
  description: string;
  category: { id: string; name: string };
  pictureUrls: string[];
  rooms: RoomResponse[];
}

export const propertySchema = z.object({
  name: z.string().min(5, "Nama properti minimal 5 karakter").max(250, "Maksimal 250 karakter"),
  city: z.string().min(3, "Kota minimal 3 karakter").max(50, "Maksimal 50 karakter"),
  category: z.string().min(1, "Kategori wajib diisi"),
  description: z.string().min(20, "Deskripsi minimal 20 karakter").max(500, "Maksimal 500 karakter"),
});

export const createPropertySchema = propertySchema.extend({
  rooms: z.array(z.object({
    name: z.string().min(2, "Tipe kamar minimal 2 karakter"),
    basePrice: z.number("Harga wajib diisi").min(1, "Harga harus lebih dari 0"),
    guestCapacity: z.number("Kapasitas wajib diisi").min(1, "Kapasitas minimal 1"),
    description: z.string().optional(),
  })).min(1, "Minimal harus ada 1 tipe kamar"),
});

export type CreatePropertyFormValues = z.infer<typeof createPropertySchema>;

export const editPropertySchema = propertySchema.extend({
  rooms: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(2, "Tipe kamar minimal 2 karakter"),
    basePrice: z.number("Harga wajib diisi").min(1, "Harga harus lebih dari 0"),
    guestCapacity: z.number("Kapasitas wajib diisi").min(1, "Kapasitas minimal 1"),
    description: z.string().optional(),
  })).min(1, "Minimal harus ada 1 tipe kamar"),
});

export type EditPropertyFormValues = z.infer<typeof editPropertySchema>;