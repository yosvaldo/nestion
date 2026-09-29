import { Router } from "express";
import tenantOrderController from "../controllers/tenant-order.controller.js";
import { roleGuard, verifyToken } from "../middlewares/auth.middleware.js";

const tenantOrderRoute = Router();

tenantOrderRoute.use(verifyToken("access"), roleGuard("TENANT"));

tenantOrderRoute.get("/", tenantOrderController.getOrders);
tenantOrderRoute.patch("/:id/confirm", tenantOrderController.confirmPayment);
tenantOrderRoute.patch("/:id/cancel", tenantOrderController.cancelOrder);

export default tenantOrderRoute;