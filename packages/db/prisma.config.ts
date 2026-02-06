import { config as loadEnv } from "dotenv";
import path from "node:path";

import { defineConfig } from "prisma/config";

loadEnv({ path: path.resolve(process.cwd(), "../../.env"), quiet: true });
loadEnv({ quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node ./prisma/seed.js",
  },
});
