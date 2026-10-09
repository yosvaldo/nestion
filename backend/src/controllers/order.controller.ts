import type { NextFunction, Request, Response } from "express";
import orderService from "../services/order.service.js";
import { responseBuilder } from "../utils/response-builder.util.js";
import { createOrderSchema, orderQuerySchema } from "../validators/order.validator.js";
import buildUploader from "../factories/build-uploader.factory.js";

class OrderController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const body = await createOrderSchema.parseAsync(req.body);
      const order = await orderService.createOrder(userId, body);
      return res.send(responseBuilder(201, "Order created successfully.", order));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const query = await orderQuerySchema.parseAsync(req.query);
      const result = await orderService.getUserOrders(userId, query);
      return res.send(responseBuilder(200, "Orders fetched successfully.", result.orders, result.meta));
    } catch (error) {
      next(error);
    }
  };

  uploadProof = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const orderId = req.params.id as string;
      const uploader = buildUploader(["image/jpeg", "image/png"], 1);

      uploader.single("paymentProof")(req, res, async (err: any) => {
        if (err) return next(err);
        const updated = await orderService.uploadPaymentProof(userId, orderId, req.file);
        return res.send(responseBuilder(200, "Payment proof uploaded successfully.", updated));
      });
    } catch (error) {
      next(error);
    }
  };

  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const orderId = req.params.id as string;
      const canceled = await orderService.cancelOrder(userId, orderId);
      return res.send(responseBuilder(200, "Order canceled successfully.", canceled));
    } catch (error) {
      next(error);
    }
  };
}

export default new OrderController();