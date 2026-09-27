import type { NextFunction, Request, Response } from "express";
import categoryService from "../services/category.service.js";
import { responseBuilder } from "../utils/response-builder.util.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator.js";

class CategoryController {
  getAll = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await categoryService.getAll();
      return res.send(
        responseBuilder(200, "Categories fetched successfully.", categories)
      );
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const category = await categoryService.getById(id);
      return res.send(
        responseBuilder(200, "Category fetched successfully.", category)
      );
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = await createCategorySchema.parseAsync(req.body);
      const category = await categoryService.create(body);
      return res
        .status(201)
        .send(
          responseBuilder(201, "Category created successfully.", category)
        );
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const body = await updateCategorySchema.parseAsync(req.body);
      const category = await categoryService.update(id, body);
      return res.send(
        responseBuilder(200, "Category updated successfully.", category)
      );
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      await categoryService.delete(id);
      return res.send(
        responseBuilder(200, "Category deleted successfully.", null)
      );
    } catch (error) {
      next(error);
    }
  };
}

export default new CategoryController();