import type { NextFunction, Request, Response } from "express";
import propertyService from "../services/property.service.js";
import { responseBuilder } from "../utils/response-builder.util.js";
import { getCalendarQuerySchema, getPropertiesQuerySchema } from "../validators/property.validator.js";

class PropertyController {
  getAllIndonesiaCities = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const cities = await propertyService.getAllIndonesiaCities();
      return res.send(responseBuilder(200, "All cities fetched successfully.", cities));
    } catch (error) {
      next(error);
    }
  };

  getCities = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const cities = await propertyService.getCities();
      return res.send(responseBuilder(200, "Cities fetched successfully.", cities));
    } catch (error) {
      next(error);
    }
  };

  getFeatured = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const featured = await propertyService.getFeatured();
      return res.send(responseBuilder(200, "Featured properties fetched successfully.", featured));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { year, month } = await getCalendarQuerySchema.parseAsync(req.query);
      const property = await propertyService.getPropertyById(id, year, month);
      return res.send(responseBuilder(200, "Property detail fetched successfully.", property));
    } catch (error) {
      next(error);
    }
  };

  getCalendar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { year, month } = await getCalendarQuerySchema.parseAsync(req.query);
      const calendar = await propertyService.getPropertyCalendar(id, year, month);
      return res.send(responseBuilder(200, "Property price calendar fetched successfully.", calendar));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryParams = await getPropertiesQuerySchema.parseAsync(req.query);
      const { properties, meta } = await propertyService.getProperties(queryParams);
      return res.send(responseBuilder(200, "Properties fetched successfully.", properties, meta));
    } catch (error) {
      next(error);
    }
  };
}

export default new PropertyController();