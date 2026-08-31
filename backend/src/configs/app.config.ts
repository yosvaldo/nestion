import express from "express";
import type { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CLIENT_URL } from "./env.config.js";

const app: Application = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173", CLIENT_URL].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

export default app;