import type { NextFunction, Request, Response } from "express";
import propertyService from "../services/property.service.js";
import { responseBuilder } from "../utils/response-builder.util.js";
import { getPropertiesQuerySchema } from "../validators/property.validator.js";

class PropertyController {
  getCities = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const cities = await propertyService.getCities();
      return res.send(
        responseBuilder(200, "Cities fetched successfully.", cities)
      );
    } catch (error) {
      next(error);
    }
  };

  getFeatured = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const featured = await propertyService.getFeatured();
      return res.send(
        responseBuilder(
          200,
          "Featured properties fetched successfully.",
          featured
        )
      );
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const monthQuery = req.query.month ? new Date(req.query.month as string) : undefined;
      const property = await propertyService.getPropertyById(id, monthQuery);

      return res.send(
        responseBuilder(200, "Property detail fetched successfully.", property)
      );
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryParams = await getPropertiesQuerySchema.parseAsync(req.query);
      const { properties, meta } = await propertyService.getProperties(
        queryParams
      );

      return res.send(
        responseBuilder(
          200,
          "Properties fetched successfully.",
          properties,
          meta
        )
      );
    } catch (error) {
      next(error);
    }
  };
}

export default new PropertyController();