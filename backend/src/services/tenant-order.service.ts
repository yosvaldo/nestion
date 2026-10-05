import repo from "../repositories/tenant-order.repository.js";
import AppError from "../errors/app.error.js";
import { OrderStatus } from "../generated/prisma/client.js";
import EmailService from "./email.service.js";
import renderTemplate from "../libs/handlebars.js";

class TenantOrderService {
  async getOrders(tenantId: string, status?: OrderStatus, page = 1, limit = 10) {
    const { orders, total } = await repo.findMany(tenantId, status, page, limit);
    return { orders, meta: { page, limit, totalPages: Math.ceil(total / limit), totalItems: total } };
  }

  private async notifyUser(order: any) {
    const html = renderTemplate("transaction-success.hbs", {
      fullName: order.user.fullName,
      orderNumber: order.orderNumber,
      propertyName: order.room.property.name,
      roomName: order.room.name,
      checkInDate: new Date(order.checkInDate).toLocaleDateString("id-ID")
    });
    await EmailService.sendEmail(order.user.email, "Pembayaran Anda Diterima", html);
  }

  async confirmPayment(tenantId: string, orderId: string, action: "ACCEPT" | "REJECT") {
    const order = await repo.findById(orderId);
    if (!order || order.room.property.tenantId !== tenantId) throw new AppError("Order not found", 404);
    if (order.status !== OrderStatus.MENUNGGU_KONFIRMASI_PEMBAYARAN) throw new AppError("Invalid status", 400);

    const newStatus = action === "ACCEPT" ? OrderStatus.DIPROSES : OrderStatus.MENUNGGU_PEMBAYARAN;
    const updated = await repo.updateStatus(orderId, newStatus);
    if (action === "ACCEPT") await this.notifyUser(order);
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