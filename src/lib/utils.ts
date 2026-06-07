// src/lib/utils.ts
// Задача 1.8 — Расширенные утилиты
// MASTER_CONTEXT v1.2

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ActiveFilters } from "@/types";

// ─── Стили ──────────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Форматирование цен ──────────────────────────────────────────────────────

export function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  const formatted = new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
  return `${formatted} грн`;
}

export function getDiscountPercent(
  price: number | string,
  comparePrice: number | string | null | undefined
): number {
  if (!comparePrice) return 0;
  const p = typeof price === "string" ? parseFloat(price) : price;
  const cp =
    typeof comparePrice === "string" ? parseFloat(comparePrice) : comparePrice;
  if (cp <= p) return 0;
  return Math.round(((cp - p) / cp) * 100);
}

// ─── Номер заказа ────────────────────────────────────────────────────────────

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${year}-${random}`;
}

// ─── URL / фильтры ───────────────────────────────────────────────────────────

export function parseSearchParams(
  sp: Record<string, string | string[] | undefined>
): ActiveFilters {
  const filters: ActiveFilters = {};

  if (sp.brand) {
    filters.brand = Array.isArray(sp.brand) ? sp.brand : [sp.brand];
  }

  if (sp.priceMin) filters.priceMin = Number(sp.priceMin);
  if (sp.priceMax) filters.priceMax = Number(sp.priceMax);
  if (sp.page) filters.page = Number(sp.page);
  if (sp.inStock === "true") filters.inStock = true;

  const validSorts = ["popular", "price-asc", "price-desc", "new", "rating"] as const;
  type SortValue = (typeof validSorts)[number];

  if (sp.sort && validSorts.includes(sp.sort as SortValue)) {
    filters.sort = sp.sort as SortValue;
  }

  // Динамические атрибуты (всё остальное из URL)
  const knownKeys = new Set(["brand", "priceMin", "priceMax", "page", "inStock", "sort"]);
  for (const [key, value] of Object.entries(sp)) {
    if (!knownKeys.has(key) && value !== undefined) {
      filters[key] = Array.isArray(value) ? value : [value];
    }
  }

  return filters;
}

export interface ProductWhereFilters {
  categorySlug?: string;
  brand?: string[];
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  attributes?: Record<string, string[]>;
}

export function buildProductWhereClause(filters: ProductWhereFilters) {
  const where: Record<string, unknown> = {
    isActive: true,
  };

  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug };
  }

  if (filters.brand?.length) {
    where.brand = { slug: { in: filters.brand } };
  }

  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    where.price = {
      ...(filters.priceMin !== undefined && { gte: filters.priceMin }),
      ...(filters.priceMax !== undefined && { lte: filters.priceMax }),
    };
  }

  if (filters.inStock) {
    where.stock = { gt: 0 };
  }

  // JSONB атрибуты — для GIN индекса
  if (filters.attributes && Object.keys(filters.attributes).length > 0) {
    const attrConditions = Object.entries(filters.attributes).map(
      ([key, values]) => ({
        attributes: {
          path: [key],
          array_contains: values,
        },
      })
    );
    if (attrConditions.length > 0) {
      where.AND = attrConditions;
    }
  }

  return where;
}

// ─── Slug ─────────────────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[а-яёіїєґ]/g, (char) => {
      const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye",
        ж: "zh", з: "z", и: "y", і: "i", ї: "yi", й: "y", к: "k", л: "l",
        м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
        ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "",
        ю: "yu", я: "ya", ё: "yo",
      };
      return map[char] ?? char;
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Site URL and Localization Helpers ────────────────────────────────────────

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const isLocal = !envUrl || envUrl.includes("localhost") || envUrl.includes("127.0.0.1");

  if (isLocal && (process.env.NODE_ENV === "production" || process.env.VERCEL === "1")) {
    const vercelUrl =
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.VERCEL_URL ||
      process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.NEXT_PUBLIC_VERCEL_URL;
    if (vercelUrl) {
      return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
    }
    return "https://elektronom.com.ua";
  }

  return envUrl || "https://elektronom.com.ua";
}

export function localizedPath(locale: string, path: string): string {
  if (!path) return '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const normalizedPath = cleanPath.replace(/\/+/g, '/');

  if (normalizedPath === `/${locale}` || normalizedPath.startsWith(`/${locale}/`)) {
    return normalizedPath;
  }

  const localeRegex = /^\/(uk|ru)(\/|$)/;
  if (localeRegex.test(normalizedPath)) {
    const pathWithoutLocale = normalizedPath.replace(localeRegex, '/');
    const finalPath = pathWithoutLocale === '/' ? '' : pathWithoutLocale;
    return `/${locale}${finalPath}`;
  }

  const finalPath = normalizedPath === '/' ? '' : normalizedPath;
  return `/${locale}${finalPath}`;
}

