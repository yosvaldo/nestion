import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client.js";
import { DATABASE_URL } from "../configs/env.config.js";

const adapter = new PrismaNeon({
  connectionString: DATABASE_URL,
});

export const prisma = new PrismaClient({
  adapter,
});