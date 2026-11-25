import { PrismaClient } from "@prisma/client";

// ---------------------------------------------------------------------------
// Prisma Client Singleton
// ---------------------------------------------------------------------------
// In development Next.js hot-reloads modules frequently; without this pattern
// every reload would open a new DB connection and quickly exhaust the pool.
// We stash one PrismaClient on the global object so it survives HMR cycles.
// In production the module is imported once and `globalThis` is never written.
// ---------------------------------------------------------------------------

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
