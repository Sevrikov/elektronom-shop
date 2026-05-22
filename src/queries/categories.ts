// src/queries/categories.ts
// Задача 1.10 — Реальные Prisma-запросы категорий с 'use cache'
// MASTER_CONTEXT v1.3

import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

// ─── Все категории ────────────────────────────────────────────────────────────

export async function getCategories(locale: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  return prisma.category.findMany({
    where: { isActive: true },
    select: {
      id: true,
      slug: true,
      parentId: true,
      sortOrder: true,
      image: true,
      translations: {
        where: { locale },
        select: { name: true, description: true, metaTitle: true, metaDesc: true },
        take: 1,
      },
    },
    orderBy: { sortOrder: "asc" },
  });
}

// ─── Категория по slug ────────────────────────────────────────────────────────

export async function getCategoryBySlug(slug: string, locale: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  cacheTag(`category-${slug}`);

  return prisma.category.findUnique({
    where: { slug, isActive: true },
    select: {
      id: true,
      slug: true,
      parentId: true,
      sortOrder: true,
      image: true,
      translations: {
        where: { locale },
        select: { name: true, description: true, metaTitle: true, metaDesc: true },
        take: 1,
      },
      parent: {
        select: {
          slug: true,
          translations: {
            where: { locale },
            select: { name: true },
            take: 1,
          },
        },
      },
      children: {
        where: { isActive: true },
        select: {
          slug: true,
          image: true,
          translations: {
            where: { locale },
            select: { name: true },
            take: 1,
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

// ─── Дерево категорий (рекурсивное) ───────────────────────────────────────────

export interface CategoryTreeNode {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  sortOrder: number;
  children: CategoryTreeNode[];
}

export async function getCategoryTree(locale: string): Promise<CategoryTreeNode[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: {
      id: true,
      slug: true,
      parentId: true,
      sortOrder: true,
      image: true,
      translations: {
        where: { locale },
        select: { name: true },
        take: 1,
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  // Построение дерева
  const map = new Map<string, CategoryTreeNode>();
  const roots: CategoryTreeNode[] = [];

  for (const cat of categories) {
    map.set(cat.id, {
      id: cat.id,
      slug: cat.slug,
      name: cat.translations[0]?.name ?? cat.slug,
      image: cat.image,
      sortOrder: cat.sortOrder,
      children: [],
    });
  }

  for (const cat of categories) {
    const node = map.get(cat.id);
    if (!node) continue;

    if (cat.parentId) {
      const parent = map.get(cat.parentId);
      parent?.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

// ─── Доступные фильтры для категории ─────────────────────────────────────────

export async function getCategoryFilters(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`category-filters-${slug}`);

  const products = await prisma.product.findMany({
    where: {
      category: { slug },
      isActive: true,
    },
    select: {
      price: true,
      attributes: true,
      brand: { select: { slug: true, name: true } },
    },
    take: 1000,
  });

  // Агрегация доступных фильтров
  const brands = new Map<string, string>();
  let priceMin = Infinity;
  let priceMax = -Infinity;
  const attributeValues: Record<string, Set<string>> = {};

  for (const product of products) {
    // Бренды
    if (product.brand) {
      brands.set(product.brand.slug, product.brand.name);
    }

    // Цены
    const price = Number(product.price);
    if (price < priceMin) priceMin = price;
    if (price > priceMax) priceMax = price;

    // JSONB атрибуты
    const attrs = product.attributes as Record<string, string>;
    for (const [key, value] of Object.entries(attrs)) {
      if (!attributeValues[key]) {
        attributeValues[key] = new Set();
      }
      attributeValues[key]?.add(value);
    }
  }

  const attributes: Record<string, string[]> = {};
  for (const [key, values] of Object.entries(attributeValues)) {
    attributes[key] = Array.from(values).sort();
  }

  return {
    brands: Array.from(brands.entries()).map(([slug, name]) => ({ slug, name })),
    priceMin: priceMin === Infinity ? 0 : priceMin,
    priceMax: priceMax === -Infinity ? 0 : priceMax,
    attributes,
  };
}
