import { z } from "zod";

export const createOrderSchema = z.object({
  roomId: z.uuid("Invalid room ID format"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
});

export const orderQuerySchema = z.object({
  status: z.enum(["MENUNGGU_PEMBAYARAN", "MENUNGGU_KONFIRMASI_PEMBAYARAN", "DIPROSES", "DIBATALKAN"]).optional(),
  startDate: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional().transform(val => (val ? Number(val) : 1)),
  limit: z.string().optional().transform(val => (val ? Number(val) : 10)),
});