import { Router } from "express";
import tenantPropertyController from "../controllers/tenant-property.controller.js";
import { roleGuard, verifyToken } from "../middlewares/auth.middleware.js";

const tenantPropertyRoute = Router();

tenantPropertyRoute.use(verifyToken("access"), roleGuard("TENANT"));

tenantPropertyRoute.get("/", tenantPropertyController.getMyProperties);
tenantPropertyRoute.get("/:id", tenantPropertyController.getMyPropertyById);
tenantPropertyRoute.post("/", tenantPropertyController.createProperty);
tenantPropertyRoute.patch("/:id", tenantPropertyController.updateProperty);
tenantPropertyRoute.delete("/:id", tenantPropertyController.deleteProperty);

tenantPropertyRoute.post(
  "/:propertyId/rooms",
  tenantPropertyController.createRoom
);
tenantPropertyRoute.patch(
  "/rooms/:roomId",
  tenantPropertyController.updateRoom
);
tenantPropertyRoute.delete(
  "/rooms/:roomId",
  tenantPropertyController.deleteRoom
);

export default tenantPropertyRoute;