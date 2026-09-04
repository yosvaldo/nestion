import { Router } from "express";
import propertyController from "../controllers/property.controller.js";

const propertyRoute = Router();

propertyRoute.get("/cities", propertyController.getCities);
propertyRoute.get("/featured", propertyController.getFeatured);
propertyRoute.get("/", propertyController.getAll);

export default propertyRoute;