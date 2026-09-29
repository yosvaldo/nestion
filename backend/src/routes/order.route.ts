import { Router } from "express";
import orderController from "../controllers/order.controller.js";
import { roleGuard, verifyToken } from "../middlewares/auth.middleware.js";

const orderRoute = Router();

orderRoute.use(verifyToken("access"), roleGuard("USER"));

orderRoute.post("/", orderController.create);
orderRoute.get("/", orderController.getAll);
orderRoute.patch("/:id/payment-proof", orderController.uploadProof);
orderRoute.patch("/:id/cancel", orderController.cancel);

export default orderRoute;