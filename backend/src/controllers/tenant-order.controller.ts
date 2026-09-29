import type { Request, Response, NextFunction } from "express";
import tenantOrderService from "../services/tenant-order.service.js";
import { responseBuilder } from "../utils/response-builder.util.js";
import type { OrderStatus } from "../generated/prisma/client.js";

class TenantOrderController {
  getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.id;
      const { status, page, limit } = req.query;
      const result = await tenantOrderService.getOrders(
        tenantId, status as OrderStatus, Number(page) || 1, Number(limit) || 10
      );
      return res.send(responseBuilder(200, "Orders fetched", result.orders, result.meta));
    } catch (e) { next(e); }
  };

  confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.id;
      const { action } = req.body; // "ACCEPT" | "REJECT"
      const updated = await tenantOrderService.confirmPayment(tenantId, req.params.id, action);
      return res.send(responseBuilder(200, `Payment ${action.toLowerCase()}ed`, updated));
    } catch (e) { next(e); }
  };

  cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.id;
      const canceled = await tenantOrderService.cancelOrder(tenantId, req.params.id);
      return res.send(responseBuilder(200, "Order canceled successfully", canceled));
    } catch (e) { next(e); }
  };
}

export default new TenantOrderController();