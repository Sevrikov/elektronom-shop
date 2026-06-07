// src/lib/prisma.ts
// Задача 1.3 — Singleton PrismaClient
// Prisma 7.x с Query Compiler требует адаптер (@prisma/adapter-pg)
// MASTER_CONTEXT v1.3: runtime uses this singleton instead of ad-hoc PrismaClient instances

// Suppress pg/node-postgres SSL mode warning from console.error to prevent Next.js dev overlay blocks
if (typeof console !== 'undefined' && console.error) {
  const originalConsoleError = console.error;
  console.error = function (...args: unknown[]) {
    const message = args.map((arg) => {
      if (typeof arg === 'string') return arg;
      if (arg instanceof Error) return arg.message;
      return String(arg);
    }).join(' ');
    if (message.includes('SECURITY WARNING: The SSL modes')) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
