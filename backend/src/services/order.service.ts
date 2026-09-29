import orderRepository from "../repositories/order.repository.js";
import { prisma } from "../libs/prisma.client.js";
import AppError from "../errors/app.error.js";
import { calculateDailyPrice } from "../utils/price-calculator.util.js";
import { uploadToCloudinary } from "../utils/cloudinary.util.js";
import { OrderStatus } from "../generated/prisma/client.js";
import type { CreateOrderInput, OrderFilterParams } from "../types/order.type.js";

class OrderService {
  private async calculateTotalPrice(roomId: string, checkIn: Date, checkOut: Date): Promise<number> {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { peakSeasonRates: { where: { deletedAt: null } } },
    });
    if (!room) throw new AppError("Room not found", 404);

    let total = 0;
    let curr = new Date(checkIn);
    while (curr < checkOut) {
      total += calculateDailyPrice(curr, room.basePrice, room.peakSeasonRates);
      curr.setDate(curr.getDate() + 1);
    }
    return total;
  }

  private async persistOrder(userId: string, roomId: string, checkIn: Date, checkOut: Date, totalPrice: number) {
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const paymentExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour limit as per PRD
    return orderRepository.create({
      orderNumber, userId, roomId, checkInDate: checkIn, checkOutDate: checkOut,
      totalPrice, status: OrderStatus.MENUNGGU_PEMBAYARAN, paymentExpiresAt,
    });
  }

  async createOrder(userId: string, input: CreateOrderInput) {
    const checkIn = new Date(input.checkInDate);
    const checkOut = new Date(input.checkOutDate);
    if (checkIn >= checkOut) throw new AppError("Check-out date must be after check-in date", 400);

    const totalPrice = await this.calculateTotalPrice(input.roomId, checkIn, checkOut);
    return this.persistOrder(userId, input.roomId, checkIn, checkOut, totalPrice);
  }

  async uploadPaymentProof(userId: string, orderId: string, file?: Express.Multer.File) {
    if (!file) throw new AppError("Payment proof image is required", 400);
    const order = await orderRepository.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);
    if (order.userId !== userId) throw new AppError("Unauthorized action", 403);
    if (order.status !== OrderStatus.MENUNGGU_PEMBAYARAN) throw new AppError("Invalid order status for upload", 400);

    const proofUrl = await uploadToCloudinary(file, "payment-proofs");
    return orderRepository.updateStatusAndProof(orderId, OrderStatus.MENUNGGU_KONFIRMASI_PEMBAYARAN, proofUrl);
  }

  async cancelOrder(userId: string, orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);
    if (order.userId !== userId) throw new AppError("Unauthorized action", 403);
    if (order.status !== OrderStatus.MENUNGGU_PEMBAYARAN || order.paymentProofUrl) {
      throw new AppError("Order cannot be canceled after payment proof is uploaded", 400);
    }
    return orderRepository.cancelOrder(orderId);
  }

  async getUserOrders(userId: string, params: OrderFilterParams) {
    const { orders, total } = await orderRepository.findManyByUser(userId, params);
    const page = params.page || 1;
    const limit = params.limit || 10;
    return {
      orders,
      meta: { currentPage: page, limit, totalPages: Math.ceil(total / limit), totalItems: total },
    };
  }
}

export default new OrderService();