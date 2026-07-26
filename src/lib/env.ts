// src/lib/env.ts
// Задача 1.6 — Zod-валидация ENV при старте
// MASTER_CONTEXT v1.3

import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().optional().default(process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/elektronom"),

  // Auth
  AUTH_SECRET: z.string().optional().default(process.env.AUTH_SECRET || "default_auth_secret_for_next_build_process_placeholder_32chars"),
  AUTH_URL: z.string().url().optional(),

  // Google OAuth (optional in dev)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Facebook OAuth (optional in dev)
  FACEBOOK_CLIENT_ID: z.string().optional(),
  FACEBOOK_CLIENT_SECRET: z.string().optional(),

  // App
  NEXT_PUBLIC_SITE_URL: z.string().optional().default(process.env.NEXT_PUBLIC_SITE_URL || "https://elektronom.vercel.app"),
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

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // AI assistant (optional — degrades gracefully when absent)
  ANTHROPIC_API_KEY: z.string().optional(),

  // Content Factory bridge (optional — local dev tool)
  CONTENT_FACTORY_API_URL: z.string().url().optional(),
  CONTENT_FACTORY_TOKEN: z.string().optional(),

  // Payment provider identifier (required once payment is enabled)
  PAYMENT_PROVIDER: z.enum(['liqpay', 'fondy', 'wayforpay', 'monobank', 'portmone']).optional(),
  PAYMENT_PUBLIC_KEY: z.string().optional(),

  // Feature Flags (Alpha 1.2) - optional and default to false
  alpha12_content_guides_enabled: z.preprocess((val) => val === "true" || val === "1" || val === true, z.boolean()).optional().default(false),
  alpha12_guide_rag_citations_enabled: z.preprocess((val) => val === "true" || val === "1" || val === true, z.boolean()).optional().default(false),
  alpha12_seo_answer_blocks_enabled: z.preprocess((val) => val === "true" || val === "1" || val === true, z.boolean()).optional().default(false),
  alpha12_article_schema_enabled: z.preprocess((val) => val === "true" || val === "1" || val === true, z.boolean()).optional().default(false),
  alpha12_faq_howto_schema_enabled: z.preprocess((val) => val === "true" || val === "1" || val === true, z.boolean()).optional().default(false),
  alpha12_trust_entity_enabled: z.preprocess((val) => val === "true" || val === "1" || val === true, z.boolean()).optional().default(false),
  alpha12_recently_viewed_enabled: z.preprocess((val) => val === "true" || val === "1" || val === true, z.boolean()).optional().default(false),
  alpha12_co_purchase_recommendations_enabled: z.preprocess((val) => val === "true" || val === "1" || val === true, z.boolean()).optional().default(false),
  alpha12_ai_recommendations_enabled: z.preprocess((val) => val === "true" || val === "1" || val === true, z.boolean()).optional().default(false),
  alpha12_bi_dashboard_enabled: z.preprocess((val) => val === "true" || val === "1" || val === true, z.boolean()).optional().default(false),
  alpha12_ab_experiments_enabled: z.preprocess((val) => val === "true" || val === "1" || val === true, z.boolean()).optional().default(false),
}).refine(
  (data) => {
    const hasAny = !!(data.CLOUDINARY_CLOUD_NAME || data.CLOUDINARY_API_KEY || data.CLOUDINARY_API_SECRET);
    if (hasAny) {
      return !!(data.CLOUDINARY_CLOUD_NAME && data.CLOUDINARY_API_KEY && data.CLOUDINARY_API_SECRET);
    }
    return true;
  },
  {
    message: "If Cloudinary is configured, all credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) must be set",
    path: ["CLOUDINARY_CLOUD_NAME"],
  }
);

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(_env.error.flatten().fieldErrors, null, 2));
}

export const env = _env.success ? _env.data : (process.env as never);
