import repo from "../repositories/tenant-order.repository.js";
import AppError from "../errors/app.error.js";
import { OrderStatus } from "../generated/prisma/client.js";

class TenantOrderService {
  async getOrders(tenantId: string, status?: OrderStatus, page = 1, limit = 10) {
    const { orders, total } = await repo.findMany(tenantId, status, page, limit);
    return { orders, meta: { page, limit, totalPages: Math.ceil(total / limit), totalItems: total } };
  }

  async confirmPayment(tenantId: string, orderId: string, action: "ACCEPT" | "REJECT") {
    const order = await repo.findById(orderId);
    if (!order || order.room.property.tenantId !== tenantId) throw new AppError("Order not found", 404);
    if (order.status !== OrderStatus.MENUNGGU_KONFIRMASI_PEMBAYARAN) throw new AppError("Invalid status", 400);

    const newStatus = action === "ACCEPT" ? OrderStatus.DIPROSES : OrderStatus.MENUNGGU_PEMBAYARAN;
    const updated = await repo.updateStatus(orderId, newStatus);
    
    return updated;
  }

  async cancelOrder(tenantId: string, orderId: string) {
    const order = await repo.findById(orderId);
    if (!order || order.room.property.tenantId !== tenantId) throw new AppError("Order not found", 404);
    if (order.status !== OrderStatus.MENUNGGU_PEMBAYARAN || order.paymentProofUrl) {
      throw new AppError("Cannot cancel after payment proof uploaded", 400);
    }
    return repo.updateStatus(orderId, OrderStatus.DIBATALKAN);
  }
}
export default new TenantOrderService();