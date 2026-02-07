import { config as loadEnv } from "dotenv";
import path from "node:path";

import { defineConfig } from "prisma/config";

loadEnv({ path: path.resolve(process.cwd(), "../../.env"), quiet: true });
loadEnv({ quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Prefer DATABASE_URL from environment/.env; keep a fallback for image build-time
    // commands (e.g. prisma generate) where env injection may not be available.
    url:
      process.env.DATABASE_URL ??
      "postgresql://school:schoolpass@pgbouncer:6432/school_analytics?pgbouncer=true",
  },
  migrations: {
    seed: "node ./prisma/seed.js",
  },
});
