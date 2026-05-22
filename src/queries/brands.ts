// src/queries/brands.ts
// Задача 1.11 — Запросы брендов с 'use cache'
// MASTER_CONTEXT v1.3

import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { productCardSelect } from "@/queries/products";
import type { Prisma } from "@/generated/prisma/client";

// ─── Все бренды ───────────────────────────────────────────────────────────────

export async function getBrands() {
  "use cache";
  cacheLife("days");
  cacheTag("brands");

  return prisma.brand.findMany({
    where: { isActive: true },
    select: {
      id: true,
      slug: true,
      name: true,
      logo: true,
      _count: {
        select: { products: { where: { isActive: true } } },
      },
    },
    orderBy: { name: "asc" },
  });
}

// ─── Бренд по slug ────────────────────────────────────────────────────────────

export async function getBrandBySlug(slug: string) {
  "use cache";
  cacheLife("days");
  cacheTag("brands");
  cacheTag(`brand-${slug}`);

  return prisma.brand.findUnique({
    where: { slug, isActive: true },
    select: {
      id: true,
      slug: true,
      name: true,
      logo: true,
    },
  });
}

// ─── Товары бренда ────────────────────────────────────────────────────────────

interface BrandProductsInput {
  brandSlug: string;
  locale: string;
  page?: number;
  pageSize?: number;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
}

export async function getBrandProducts(input: BrandProductsInput) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  cacheTag(`brand-${input.brandSlug}`);

  const { page = 1, pageSize = 24, locale } = input;
  const skip = (page - 1) * pageSize;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    brand: { slug: input.brandSlug },
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
      orderBy: { sortOrder: "asc" },
      take: pageSize,
      skip,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

