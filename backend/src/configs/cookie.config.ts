import type { CookieOptions } from "express";
import { IS_PROD } from "./env.config.js";

export const accessCookieConfig: CookieOptions = {
  httpOnly: true,
  sameSite: IS_PROD ? "none" : "lax",
  secure: IS_PROD,
  maxAge: 15 * 60 * 1000,
};

export const refreshCookieConfig: CookieOptions = {
  httpOnly: true,
  sameSite: IS_PROD ? "none" : "lax",
  secure: IS_PROD,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};