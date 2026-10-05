import { Router } from "express";
import ctrl from "../controllers/report.controller.js";
import { roleGuard, verifyToken } from "../middlewares/auth.middleware.js";

const reportRoute = Router();

reportRoute.use(verifyToken("access"), roleGuard("TENANT"));

reportRoute.get("/sales", ctrl.getSales);
reportRoute.get("/calendar", ctrl.getCalendar);

export default reportRoute;