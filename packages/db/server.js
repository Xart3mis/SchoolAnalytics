const { PrismaClient } = require("./src/generated/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");

function createPrismaClient(options = {}) {
  const { connectionString = process.env.DATABASE_URL, log = ["error"] } = options;
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter, log });
  return { prisma, pool };
}

module.exports = { createPrismaClient };
