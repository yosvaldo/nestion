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

export type GetPropertiesQueryInput = z.infer<typeof getPropertiesQuerySchema>;