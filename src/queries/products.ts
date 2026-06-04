// src/queries/products.ts
// Задача 1.9 — Реальные Prisma-запросы с 'use cache'
// MASTER_CONTEXT v1.3

import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { ActiveFilters } from "@/types";
import { getCategorySubtreeIds } from "./categories";
// Legacy re-export kept for backward compatibility
export { parseSearchParams } from "@/lib/utils";
export { parseCatalogSearchParams } from "@/lib/catalog-filter-url";

// ─── Общий SELECT для карточки в списке ─────────────────────────────────────

export const productCardSelect = {
  id: true,
  slug: true,
  sku: true,
  price: true,
  comparePrice: true,
  stock: true,
  isActive: true,
  isFeatured: true,
  createdAt: true,
  translations: {
    select: { locale: true, name: true },
  },
  images: {
    select: { url: true, processedUrl: true, alt: true, sortOrder: true, provider: true, publicId: true },
    orderBy: { sortOrder: "asc" as const },
    take: 2,
  },
  brand: {
    select: { slug: true, name: true },
  },
  category: {
    select: { slug: true },
  },
} satisfies Prisma.ProductSelect;

// Helper to convert Decimal values to normal numbers for safe serialization with 'use cache' and Client Components
export function mapProductDecimals<T extends { price: unknown; comparePrice?: unknown; costPrice?: unknown; salePrice?: unknown }>(product: T) {
  return {
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    ...('costPrice' in product ? { costPrice: product.costPrice ? Number(product.costPrice) : null } : {}),
  };
}

// ─── Товар по slug ────────────────────────────────────────────────────────────

export async function getProductBySlug(slug: string, locale: string) {
  "use cache";
  cacheLife("seconds");
  cacheTag(`product-${slug}`);

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    select: {
      id: true,
      slug: true,
      sku: true,
      price: true,
      comparePrice: true,
      costPrice: true,
      stock: true,
      isActive: true,
      isFeatured: true,
      brandId: true,
      attributes: true,
      sortOrder: true,
      createdAt: true,
      updatedAt: true,
      gtin: true,
      mpn: true,
      condition: true,
      googleProductCategory: true,
      itemGroupId: true,
      salePrice: true,
      saleStartsAt: true,
      saleEndsAt: true,
      translations: {
        where: { locale },
        select: {
          name: true,
          description: true,
          metaTitle: true,
          metaDesc: true,
        },
        take: 1,
      },
      images: {
        select: { id: true, url: true, processedUrl: true, alt: true, sortOrder: true, provider: true, publicId: true },
        orderBy: { sortOrder: "asc" },
      },
      brand: {
        select: { slug: true, name: true, logo: true },
      },
      category: {
        select: {
          id: true,
          slug: true,
          translations: {
            where: { locale },
            select: { locale: true, name: true },
            take: 1,
          },
        },
      },
      reviews: {
        where: { isVisible: true },
        select: {
          id: true,
          rating: true,
          comment: true,
          advantages: true,
          disadvantages: true,
          verifiedPurchase: true,
          createdAt: true,
          user: { select: { name: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!product) return null;
  return mapProductDecimals(product);
}

// ─── Фильтрованный список товаров ─────────────────────────────────────────────

interface FilteredProductsInput {
  categorySlug?: string;
  /** Multi-brand support: pass array of brand slugs */
  brandSlugs?: string[] | undefined;
  /** @deprecated Use brandSlugs instead */
  brandSlug?: string | undefined;
  priceMin?: number | undefined;
  priceMax?: number | undefined;
  inStock?: boolean | undefined;
  sort?: "popular" | "price-asc" | "price-desc" | "new" | "rating" | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
  /**
   * JSONB attribute filters.
   * Logic: AND between different keys, OR within the same key.
   * Example: { poles: ['1P','2P'], curve: ['C'] } →
   *   (poles = '1P' OR poles = '2P') AND (curve = 'C')
   */
  attributes?: Record<string, string[]> | undefined;
  locale: string;
}

function buildOrderBy(sort: FilteredProductsInput["sort"]) {
  switch (sort) {
    case "price-asc":
      return { price: "asc" as const };
    case "price-desc":
      return { price: "desc" as const };
    case "new":
      return { createdAt: "desc" as const };
    default:
      return { sortOrder: "asc" as const };
  }
}

/**
 * Build JSONB attribute filters as Prisma AND conditions.
 * Each key produces an OR across its values (using Prisma path/equals).
 * Multiple keys are ANDed together.
 *
 * Falls back to raw SQL via $queryRaw only when Prisma's JSON path doesn't
 * support OR natively for the current schema.
 */
function buildAttributeWhere(
  attributes: Record<string, string[]>
): Prisma.ProductWhereInput[] {
  const entries = Object.entries(attributes).filter(([, v]) => v.length > 0);
  if (entries.length === 0) return [];

  // One AND-condition per attribute key; within each key: OR across values
  return entries.map(([key, values]) => ({
    OR: values.flatMap((val) => {
      const conditions: Prisma.ProductWhereInput[] = [
        {
          attributes: {
            path: [key],
            equals: val,
          },
        },
        {
          attributes: {
            path: [key],
            array_contains: val,
          },
        },
      ];

      const numVal = Number(val);
      if (!isNaN(numVal) && val.trim() !== '') {
        conditions.push(
          {
            attributes: {
              path: [key],
              equals: numVal,
            },
          },
          {
            attributes: {
              path: [key],
              array_contains: numVal,
            },
          }
        );
      }

      if (val === 'true' || val === 'false') {
        const boolVal = val === 'true';
        conditions.push(
          {
            attributes: {
              path: [key],
              equals: boolVal,
            },
          },
          {
            attributes: {
              path: [key],
              array_contains: boolVal,
            },
          }
        );
      }

      return conditions;
    }),
  }));
}

/**
 * Reusable helper to build Prisma product filters.
 * Supports excluding a specific filter key (for facet counts).
 */
export function buildProductWhere(params: {
  categorySlug?: string | undefined;
  categoryIds?: string[] | undefined;
  activeFilters: ActiveFilters;
  excludeFacetKey?: string | undefined;
}): Prisma.ProductWhereInput {
  const brandSlugs = params.activeFilters.brand ?? [];
  const inStock = params.activeFilters.inStock;
  const priceMin = params.activeFilters.priceMin;
  const priceMax = params.activeFilters.priceMax;

  // Extract dynamic attributes, excluding the target facet group if requested
  const attrs: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(params.activeFilters)) {
    if (["brand", "priceMin", "priceMax", "inStock", "sort", "page"].includes(key)) {
      continue;
    }
    if (params.excludeFacetKey === key) {
      continue;
    }
    if (Array.isArray(value) && value.length > 0) {
      attrs[key] = value as string[];
    }
  }

  const attrConditions = buildAttributeWhere(attrs);

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(params.categoryIds && params.categoryIds.length > 0
      ? { categoryId: { in: params.categoryIds } }
      : params.categorySlug
      ? { category: { slug: params.categorySlug } }
      : {}),
    ...(params.excludeFacetKey !== "brand" && brandSlugs.length > 0 && {
      brand: { slug: { in: brandSlugs } },
    }),
    ...(params.excludeFacetKey !== "price" && (priceMin !== undefined || priceMax !== undefined)
      ? {
          price: {
            ...(priceMin !== undefined && { gte: priceMin }),
            ...(priceMax !== undefined && { lte: priceMax }),
          },
        }
      : {}),
    ...(params.excludeFacetKey !== "inStock" && inStock && { stock: { gt: 0 } }),
    ...(attrConditions.length > 0 && { AND: attrConditions }),
  };

  return where;
}

export async function getFilteredProducts(input: FilteredProductsInput) {
  // Динамический запрос — не кэшируем, т.к. зависит от URL параметров (фильтры, сортировка, страница)
  // По MASTER_CONTEXT §7: страница категории — динамическая

  const { page = 1, pageSize = 24, locale } = input;
  const skip = (page - 1) * pageSize;

  // Merge brandSlug (legacy) and brandSlugs (new multi-select)
  const brandSlugs = [
    ...(input.brandSlugs ?? []),
    ...(input.brandSlug ? [input.brandSlug] : []),
  ];

  // Map input parameters to the generic ActiveFilters structure
  const activeFilters: ActiveFilters = {
    brand: brandSlugs,
    priceMin: input.priceMin,
    priceMax: input.priceMax,
    inStock: input.inStock,
    ...(input.attributes ?? {}),
  };

  let categoryIds: string[] | undefined = undefined;
  if (input.categorySlug) {
    categoryIds = await getCategorySubtreeIds(input.categorySlug);
  }

  const where = buildProductWhere({
    categorySlug: input.categorySlug,
    categoryIds,
    activeFilters,
  });

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        ...productCardSelect,
        attributes: true,
        translations: {
          where: { locale },
          select: { locale: true, name: true },
          take: 1,
        },
      },
      orderBy: buildOrderBy(input.sort),
      take: pageSize,
      skip,
    }),
    prisma.product.count({ where }),
  ]);

  return { products: products.map(mapProductDecimals), total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getProductsCount(where: Prisma.ProductWhereInput) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  return prisma.product.count({ where });
}

// ─── Избранные товары ─────────────────────────────────────────────────────────

export async function getFeaturedProducts(locale: string, take = 8) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  cacheTag("featured");

  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    select: {
      ...productCardSelect,
      translations: {
        where: { locale },
        select: { locale: true, name: true },
        take: 1,
      },
    },
    orderBy: { sortOrder: "asc" },
    take,
  });

  return products.map(mapProductDecimals);
}

// ─── Новинки ──────────────────────────────────────────────────────────────────

export async function getNewArrivals(locale: string, take = 8) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  cacheTag("new-arrivals");

  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      ...productCardSelect,
      translations: {
        where: { locale },
        select: { locale: true, name: true },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
    take,
  });

  return products.map(mapProductDecimals);
}

// ─── Похожие товары ───────────────────────────────────────────────────────────

export async function getSimilarProducts(
  categoryId: string,
  excludeId: string,
  locale: string,
  take = 4
) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  const products = await prisma.product.findMany({
    where: {
      categoryId,
      isActive: true,
      id: { not: excludeId },
    },
    select: {
      ...productCardSelect,
      translations: {
        where: { locale },
        select: { locale: true, name: true },
        take: 1,
      },
    },
    orderBy: { sortOrder: "asc" },
    take,
  });

  return products.map(mapProductDecimals);
}

export async function getSameSeriesProducts(
  productId: string,
  categoryId: string,
  brandId: string | null,
  attributes: Record<string, unknown>,
  locale: string,
  take = 5
) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  // If brand is present, find other products in the same category of the same brand
  if (brandId) {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: productId },
        categoryId,
        brandId,
      },
      select: {
        ...productCardSelect,
        translations: {
          where: { locale },
          select: { locale: true, name: true },
          take: 1,
        },
      },
      take,
      orderBy: { sortOrder: "asc" },
    });
    if (products.length > 0) return products.map(mapProductDecimals);
  }

  // Fallback to other products in same category
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: productId },
      categoryId,
    },
    select: {
      ...productCardSelect,
      translations: {
        where: { locale },
        select: { locale: true, name: true },
        take: 1,
      },
    },
    take,
    orderBy: { sortOrder: "asc" },
  });

  return products.map(mapProductDecimals);
}


