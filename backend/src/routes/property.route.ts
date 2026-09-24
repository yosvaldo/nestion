import { Router } from "express";
import propertyController from "../controllers/property.controller.js";
import tenantPropertyController from "../controllers/tenant-property.controller.js";
import { roleGuard, verifyToken } from "../middlewares/auth.middleware.js";
import { verifyPropertyOwnership, verifyRoomOwnership } from "../middlewares/tenant-ownership.middleware.js";

const propertyRoute = Router();

propertyRoute.get("/", propertyController.getAll);
propertyRoute.post("/", verifyToken("access"), roleGuard("TENANT"), tenantPropertyController.createProperty);

propertyRoute.get("/cities", propertyController.getCities);
propertyRoute.get("/featured", propertyController.getFeatured);
propertyRoute.get("/my-properties", verifyToken("access"), roleGuard("TENANT"), tenantPropertyController.getMyProperties);

propertyRoute.get("/:propertyId/rooms", verifyToken("access"), roleGuard("TENANT"), verifyPropertyOwnership, tenantPropertyController.getMyRooms);
propertyRoute.post("/:propertyId/rooms", verifyToken("access"), roleGuard("TENANT"), verifyPropertyOwnership, tenantPropertyController.createRoom);
propertyRoute.patch("/:propertyId/rooms/:roomId", verifyToken("access"), roleGuard("TENANT"), verifyRoomOwnership, tenantPropertyController.updateRoom);
propertyRoute.delete("/:propertyId/rooms/:roomId", verifyToken("access"), roleGuard("TENANT"), verifyRoomOwnership, tenantPropertyController.deleteRoom);

propertyRoute.get("/:id", propertyController.getById);
propertyRoute.patch("/:id", verifyToken("access"), roleGuard("TENANT"), verifyPropertyOwnership, tenantPropertyController.updateProperty);
propertyRoute.delete("/:id", verifyToken("access"), roleGuard("TENANT"), verifyPropertyOwnership, tenantPropertyController.deleteProperty);

export default propertyRoute;