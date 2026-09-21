import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(3, "Category name must be at least 3 characters.")
    .max(50, "Category name is too long."),
});

export const updateCategorySchema = createCategorySchema.partial();