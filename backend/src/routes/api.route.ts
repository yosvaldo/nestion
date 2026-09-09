import express, { Router } from "express";
import { APP_NAME } from "../configs/env.config.js";
import propertyRoute from "./property.route.js";

const apiRouter: Router = express.Router();

apiRouter.get("/", (_, res) => res.send(`Welcome to the ${APP_NAME} API`));
apiRouter.use("/health", (_, res) => res.send("OK"));

apiRouter.use("/properties", propertyRoute);

export default apiRouter;