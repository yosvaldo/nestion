import type { NextFunction, Request, Response } from "express";
import AppError from "../errors/app.error.js";
import tenantPropertyService from "../services/tenant-property.service.js";
import { responseBuilder } from "../utils/response-builder.util.js";
import {
  createPropertySchema,
  createRoomSchema,
  updatePropertySchema,
  updateRoomSchema,
} from "../validators/property.validator.js";

class TenantPropertyController {
  private getTenantId(req: Request): string {
    const tenantId = req.user?.id || (req.user as any)?.userId;
    if (!tenantId) throw new AppError("Unauthorized: Missing user ID.", 401);
    return tenantId;
  }

  getMyProperties = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const properties = await tenantPropertyService.getMyProperties(tenantId);
      return res.send(
        responseBuilder(200, "Tenant properties fetched successfully.", properties)
      );
    } catch (error) {
      next(error);
    }
  };

  createProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const body = await createPropertySchema.parseAsync(req.body);
      const property = await tenantPropertyService.createProperty(tenantId, body);
      return res
        .status(201)
        .send(responseBuilder(201, "Property created successfully.", property));
    } catch (error) {
      next(error);
    }
  };

  updateProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const id = req.params.id as string;
      const body = await updatePropertySchema.parseAsync(req.body);
      const property = await tenantPropertyService.updateProperty(id, tenantId, body);
      return res.send(
        responseBuilder(200, "Property updated successfully.", property)
      );
    } catch (error) {
      next(error);
    }
  };

  deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const id = req.params.id as string;
      await tenantPropertyService.deleteProperty(id, tenantId);
      return res.send(
        responseBuilder(200, "Property deleted successfully.", null)
      );
    } catch (error) {
      next(error);
    }
  };

  getMyRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const propertyId = req.params.propertyId as string;
      const rooms = await tenantPropertyService.getRoomsByPropertyId(propertyId, tenantId);
      return res.send(
        responseBuilder(200, "Property rooms fetched successfully.", rooms)
      );
    } catch (error) {
      next(error);
    }
  };

  createRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const propertyId = req.params.propertyId as string;

      if (!req.body) throw new AppError("Request body is missing", 400)
      const {basePrice} = req.body
      const body = await createRoomSchema.parseAsync({...req.body, basePrice: Number(basePrice)})

      const room = await tenantPropertyService.createRoom(propertyId, tenantId, body);
      return res
        .status(201)
        .send(responseBuilder(201, "Room created successfully.", room));
    } catch (error) {
      next(error);
    }
  };

  updateRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const roomId = req.params.roomId as string;
      const body = await updateRoomSchema.parseAsync(req.body);
      const room = await tenantPropertyService.updateRoom(roomId, tenantId, body);
      return res.send(
        responseBuilder(200, "Room updated successfully.", room)
      );
    } catch (error) {
      next(error);
    }
  };

  deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const roomId = req.params.roomId as string;
      await tenantPropertyService.deleteRoom(roomId, tenantId);
      return res.send(
        responseBuilder(200, "Room deleted successfully.", null)
      );
    } catch (error) {
      next(error);
    }
  };
}

export default new TenantPropertyController();