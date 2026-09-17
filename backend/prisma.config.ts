import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// declare const process: {
//   env: Record<string, string | undefined>;
// };

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx ./prisma/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});