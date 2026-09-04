import type { NextFunction, Request, Response } from "express";
import propertyService from "../services/property.service.js";
import { responseBuilder } from "../utils/response-builder.utils.js";
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