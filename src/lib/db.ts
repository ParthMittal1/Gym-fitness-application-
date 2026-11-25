import { PrismaClient } from "@prisma/client";

// ---------------------------------------------------------------------------
// Prisma Client Singleton  (src/lib/db.ts)
// ---------------------------------------------------------------------------
// Next.js hot-reloads modules in development, so without this guard every
// HMR cycle would open a new DB connection and quickly exhaust the pool.
// We stash one PrismaClient on globalThis so it survives across reloads.
// In production the module is imported once and globalThis is never written.
// ---------------------------------------------------------------------------

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

export const db =
  globalThis._prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis._prisma = db;
}
