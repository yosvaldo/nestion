import { z } from "zod";

export const getPropertiesQuerySchema = z.object({
  city: z.string().optional(),
  categoryId: z.string().optional(),
  name: z.string().optional(),
  checkInDate: z.coerce.date().optional(),
  checkOutDate: z.coerce.date().optional(),
  guestCapacity: z.coerce.number().int().min(1).optional(),
  sortBy: z.enum(["price", "name"]).optional().default("price"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export const getCalendarQuerySchema = z.object({
  year: z.coerce.number().int().min(2020).max(2100).optional().default(() => new Date().getFullYear()),
  month: z.coerce.number().int().min(1).max(12).optional().default(() => new Date().getMonth() + 1),
});

export const createPropertySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  categoryId: z.uuid("Invalid category ID").optional(),
  description: z.string().optional(),
  city: z.string().min(2, "City is required"),
  address: z.string().optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

export const createRoomSchema = z.object({
  name: z.string().min(2, "Room name is required"),
  description: z.string().optional(),
  basePrice: z.number().int().positive("Price must be a positive integer"),
  guestCapacity: z.number().int().min(1).default(2),
});

export const updateRoomSchema = createRoomSchema.partial();

export const createPeakSeasonRateSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  rateType: z.enum(["NOMINAL", "PERCENTAGE"]),
  rateValue: z.number().int().positive("Rate value must be positive."),
});

export type GetPropertiesQueryInput = z.infer<typeof getPropertiesQuerySchema>;
export type GetCalendarQueryInput = z.infer<typeof getCalendarQuerySchema>;