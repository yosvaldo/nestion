import { Router } from "express";
import roomManagementController from "../controllers/room-management.controller.js";
import { roleGuard, verifyToken } from "../middlewares/auth.middleware.js";

const roomManagementRoute = Router();

roomManagementRoute.use(verifyToken("access"), roleGuard("TENANT"));

roomManagementRoute.get("/holidays", roomManagementController.getPublicHolidays);

roomManagementRoute.post(
  "/:roomId/unavailability",
  roomManagementController.setUnavailability
);
roomManagementRoute.get(
  "/:roomId/unavailability",
  roomManagementController.getUnavailabilities
);
roomManagementRoute.delete(
  "/unavailability/:id",
  roomManagementController.deleteUnavailability
);

roomManagementRoute.post(
  "/:roomId/peak-season",
  roomManagementController.setPeakSeasonRate
);
roomManagementRoute.get(
  "/:roomId/peak-season",
  roomManagementController.getPeakSeasonRates
);
roomManagementRoute.delete(
  "/peak-season/:id",
  roomManagementController.deletePeakSeasonRate
);

export default roomManagementRoute;