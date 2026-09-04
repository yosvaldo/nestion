import "dotenv/config";

const APP_NAME = process.env.APP_NAME || "Nestion";
const APP_PORT = Number(process.env.APP_PORT) || 3000;
const APP_ENV = process.env.APP_ENV || "development";

const IS_PROD = APP_ENV === "production";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const DATABASE_URL = process.env.DATABASE_URL || "";
const DIRECT_URL = process.env.DIRECT_URL || "";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
const JWT_VERIFY_SECRET = process.env.JWT_VERIFY_SECRET || "verify_secret";
const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET || "reset_secret";

const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
const JWT_VERIFY_EXPIRES_IN = process.env.JWT_VERIFY_EXPIRES_IN || "1h";
const JWT_RESET_EXPIRES_IN = process.env.JWT_RESET_EXPIRES_IN || "1h";

const CLOUDINARY_URL = process.env.CLOUDINARY_URL || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const EMAIL_FROM = process.env.EMAIL_FROM || "Nestion Support <no-reply@nestion.com>";

export {
  APP_NAME,
  APP_PORT,
  APP_ENV,
  IS_PROD,
  CLIENT_URL,
  DATABASE_URL,
  DIRECT_URL,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_VERIFY_SECRET,
  JWT_RESET_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_VERIFY_EXPIRES_IN,
  JWT_RESET_EXPIRES_IN,
  CLOUDINARY_URL,
  RESEND_API_KEY,
  EMAIL_FROM,
};