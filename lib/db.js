// import { PrismaClient } from "@prisma/client";

// const db = globalThis.prisma || new PrismaClient();
// if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

// export default db;

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const db =
  globalForPrisma.db ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.db = db;
}
