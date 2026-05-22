// src/lib/env.ts
// Задача 1.6 — Zod-валидация ENV при старте
// MASTER_CONTEXT v1.3

import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),

  // Auth
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 chars"),
  AUTH_URL: z.string().url().optional(),

  // Google OAuth (optional in dev)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Facebook OAuth (optional in dev)
  FACEBOOK_CLIENT_ID: z.string().optional(),
  FACEBOOK_CLIENT_SECRET: z.string().optional(),

  // App
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Email
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z
    .string()
    .email()
    .optional()
    .default("noreply@elektronom.com.ua"),

  // Payment
  PAYMENT_SECRET_KEY: z.string().optional(),
  PAYMENT_WEBHOOK_SECRET: z.string().optional(),

  // Algolia (admin key never in NEXT_PUBLIC)
  ALGOLIA_APP_ID: z.string().optional(),
  ALGOLIA_ADMIN_KEY: z.string().optional(),
  NEXT_PUBLIC_ALGOLIA_APP_ID: z.string().optional(),
  NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(_env.error.flatten().fieldErrors, null, 2));
  if (process.env.NODE_ENV === "production") {
    throw new Error("Invalid environment variables. Check server logs.");
  }
}

export const env = _env.success ? _env.data : (process.env as never);
