import express, { Router } from "express";
import { APP_NAME } from "../configs/env.config.js";
import propertyRoute from "./property.route.js";
import authRouter from "./auth.route.js";
import categoryRoute from "./category.route.js";
import roomManagementRoute from "./room-management.route.js";

const apiRouter: Router = express.Router();

apiRouter.get("/", (_, res) => res.send(`Welcome to the ${APP_NAME} API`));
apiRouter.use("/health", (_, res) => res.send("OK"));

apiRouter.use("/properties", propertyRoute);
apiRouter.use("/auth", authRouter);
apiRouter.use("/categories", categoryRoute);
apiRouter.use("/room-management", roomManagementRoute);

export default apiRouter;