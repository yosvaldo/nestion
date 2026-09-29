import type { OrderStatus } from "../generated/prisma/client.js";

export interface CreateOrderInput {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface OrderFilterParams {
  status?: OrderStatus;
  startDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}