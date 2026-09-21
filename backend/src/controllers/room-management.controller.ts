import type { NextFunction, Request, Response } from "express";
import AppError from "../errors/app.error.js";
import roomManagementService from "../services/room-management.service.js";
import { responseBuilder } from "../utils/response-builder.util.js";
import {
  peakSeasonRateSchema,
  unavailabilitySchema,
} from "../validators/room-management.validator.js";

class RoomManagementController {
  private getTenantId(req: Request): string {
    const tenantId = req.user?.id || (req.user as any)?.userId;
    if (!tenantId) throw new AppError("Unauthorized.", 401);
    return tenantId;
  }

  setUnavailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const roomId = req.params.roomId as string;
      const body = await unavailabilitySchema.parseAsync(req.body);
      const result = await roomManagementService.setUnavailability(
        roomId,
        tenantId,
        body
      );
      return res
        .status(201)
        .send(responseBuilder(201, "Unavailability set successfully.", result));
    } catch (error) {
      next(error);
    }
  };

  getUnavailabilities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const roomId = req.params.roomId as string;
      const result = await roomManagementService.getUnavailabilities(roomId, tenantId);
      return res.send(
        responseBuilder(200, "Unavailabilities fetched successfully.", result)
      );
    } catch (error) {
      next(error);
    }
  };

  deleteUnavailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      await roomManagementService.deleteUnavailability(id);
      return res.send(
        responseBuilder(200, "Unavailability deleted successfully.", null)
      );
    } catch (error) {
      next(error);
    }
  };

  setPeakSeasonRate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const roomId = req.params.roomId as string;
      const body = await peakSeasonRateSchema.parseAsync(req.body);
      const result = await roomManagementService.setPeakSeasonRate(
        roomId,
        tenantId,
        body
      );
      return res
        .status(201)
        .send(responseBuilder(201, "Peak season rate set successfully.", result));
    } catch (error) {
      next(error);
    }
  };

  getPeakSeasonRates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const roomId = req.params.roomId as string;
      const result = await roomManagementService.getPeakSeasonRates(roomId, tenantId);
      return res.send(
        responseBuilder(200, "Peak season rates fetched successfully.", result)
      );
    } catch (error) {
      next(error);
    }
  };

  deletePeakSeasonRate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      await roomManagementService.deletePeakSeasonRate(id);
      return res.send(
        responseBuilder(200, "Peak season rate deleted successfully.", null)
      );
    } catch (error) {
      next(error);
    }
  };

  getPublicHolidays = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { year, month } = req.query;
      const holidays = await roomManagementService.fetchPublicHolidays(
        year as string,
        month as string
      );
      return res.send(
        responseBuilder(200, "Public holidays fetched successfully.", holidays)
      );
    } catch (error) {
      next(error);
    }
  };
}

export default new RoomManagementController();