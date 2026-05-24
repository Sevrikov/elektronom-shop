// src/queries/products.ts
// Задача 1.9 — Реальные Prisma-запросы с 'use cache'
// MASTER_CONTEXT v1.3

import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
export { parseSearchParams } from "@/lib/utils";

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
    select: { url: true, alt: true, sortOrder: true },
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

// ─── Товар по slug ────────────────────────────────────────────────────────────

export async function getProductBySlug(slug: string, locale: string) {
  "use cache";
  cacheLife("seconds");
  cacheTag(`product-${slug}`);

  return prisma.product.findUnique({
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
        select: { id: true, url: true, alt: true, sortOrder: true },
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
}

// ─── Фильтрованный список товаров ─────────────────────────────────────────────

interface FilteredProductsInput {
  categorySlug?: string;
  brandSlug?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  sort?: "popular" | "price-asc" | "price-desc" | "new" | "rating";
  page?: number;
  pageSize?: number;
  attributes?: Record<string, string[]>;
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

export async function getFilteredProducts(input: FilteredProductsInput) {
  // Динамический запрос — не кэшируем, т.к. зависит от URL параметров (фильтры, сортировка, страница)
  // По MASTER_CONTEXT §7: страница категории — динамическая

  const { page = 1, pageSize = 24, locale } = input;
  const skip = (page - 1) * pageSize;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(input.categorySlug && {
      category: { slug: input.categorySlug },
    }),
    ...(input.brandSlug && {
      brand: { slug: input.brandSlug },
    }),
    ...(input.priceMin !== undefined || input.priceMax !== undefined
      ? {
          price: {
            ...(input.priceMin !== undefined && { gte: input.priceMin }),
            ...(input.priceMax !== undefined && { lte: input.priceMax }),
          },
        }
      : {}),
    ...(input.inStock && { stock: { gt: 0 } }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        ...productCardSelect,
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

  return { products, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
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

  return prisma.product.findMany({
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
}

// ─── Новинки ──────────────────────────────────────────────────────────────────

export async function getNewArrivals(locale: string, take = 8) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  cacheTag("new-arrivals");

  return prisma.product.findMany({
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

  return prisma.product.findMany({
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
    if (products.length > 0) return products;
  }

  // Fallback to other products in same category
  return prisma.product.findMany({
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
}


