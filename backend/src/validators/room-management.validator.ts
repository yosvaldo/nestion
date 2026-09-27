import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const unavailabilitySchema = z.object({
  startDate: z.string().regex(dateRegex, "Invalid date format (YYYY-MM-DD)."),
  endDate: z.string().regex(dateRegex, "Invalid date format (YYYY-MM-DD)."),
  reason: z.string().optional(),
}).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
  message: "startDate must be before or equal to endDate.",
  path: ["endDate"],
});

export const peakSeasonRateSchema = z.object({
  startDate: z.string().regex(dateRegex, "Invalid date format (YYYY-MM-DD)."),
  endDate: z.string().regex(dateRegex, "Invalid date format (YYYY-MM-DD)."),
  priceType: z.enum(["NOMINAL", "PERCENTAGE"]),
  value: z.number().positive("Value must be a positive number."),
}).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
  message: "startDate must be before or equal to endDate.",
  path: ["endDate"],
});