import { z } from "zod";

export const createPropertySchema = z.object({
  name: z.string().min(3, "Property name must be at least 3 characters."),
  categoryId: z.string().uuid("Invalid category ID."),
  description: z.string().optional(),
  city: z.string().min(2, "City is required."),
  address: z.string().optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

export const createRoomSchema = z.object({
  name: z.string().min(2, "Room name is required."),
  description: z.string().optional(),
  basePrice: z.number().int().positive("Base price must be positive."),
  guestCapacity: z.number().int().min(1).default(2),
});

export const updateRoomSchema = createRoomSchema.partial();