import { Router } from "express";
import categoryController from "../controllers/category.controller.js";
import { roleGuard, verifyToken } from "../middlewares/auth.middleware.js";

const categoryRoute = Router();

categoryRoute.get("/", categoryController.getAll);
categoryRoute.post("/", verifyToken("access"), roleGuard("TENANT"), categoryController.create);

categoryRoute.get("/:id", categoryController.getById);
categoryRoute.patch("/:id", verifyToken("access"), roleGuard("TENANT"), categoryController.update);
categoryRoute.delete("/:id", verifyToken("access"), roleGuard("TENANT"), categoryController.delete);

export default categoryRoute;