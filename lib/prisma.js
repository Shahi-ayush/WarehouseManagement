// lib/prisma.js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// Avoid multiple instances in development (Next.js hot reload)
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;