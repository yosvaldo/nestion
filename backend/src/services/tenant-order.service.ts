import repo from "../repositories/tenant-order.repository.js";
import { prisma } from "../libs/prisma.client.js";
import AppError from "../errors/app.error.js";
import { OrderStatus } from "../generated/prisma/client.js";
import EmailService from "./email.service.js";
import renderTemplate from "../libs/handlebars.js";

class TenantOrderService {
  async getOrders(tenantId: string, status?: OrderStatus, page = 1, limit = 10) {
    const { orders, total } = await repo.findMany(tenantId, status, page, limit);
    return { orders, meta: { page, limit, totalPages: Math.ceil(total / limit), totalItems: total } };
  }

  private async notifyUser(order: any, action: "ACCEPT" | "REJECT") {
    const templateName = action === "ACCEPT" ? "transaction-success.hbs" : "transaction-rejected.hbs";
    const subject = action === "ACCEPT" ? "Pembayaran Anda Diterima" : "Pembayaran Anda Ditolak";
    
    const html = renderTemplate(templateName, {
      fullName: order.user.fullName,
      orderNumber: order.orderNumber,
      propertyName: order.room.property.name,
      roomName: order.room.name,
      checkInDate: new Date(order.checkInDate).toLocaleDateString("id-ID")
    });
    
    await EmailService.sendEmail(order.user.email, subject, html);
  }

  async confirmPayment(tenantId: string, orderId: string, action: "ACCEPT" | "REJECT") {
    const order = await repo.findById(orderId);
    if (!order || order.room.property.tenantId !== tenantId) throw new AppError("Order not found", 404);
    if (order.status !== OrderStatus.MENUNGGU_KONFIRMASI_PEMBAYARAN) throw new AppError("Invalid status", 400);

    if (action === "ACCEPT") {
      const updated = await repo.updateStatus(orderId, OrderStatus.DIPROSES);
      await this.notifyUser(order, "ACCEPT");
      return updated;
    } else {
      const updated = await prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.MENUNGGU_PEMBAYARAN, paymentProofUrl: null }
      });
      await this.notifyUser(order, "REJECT");
      return updated;
    }
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