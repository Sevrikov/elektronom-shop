// src/queries/search.ts
// Задача 1.13 — Prisma fallback поиск (без Algolia)
// MASTER_CONTEXT v1.3

import { prisma } from "@/lib/prisma";
import { productCardSelect } from "@/queries/products";

const DEFAULT_SEARCH_TAKE = 24;

// ─── Полнотекстовый поиск через Prisma ilike ─────────────────────────────────

export async function searchProductsFallback(
  query: string,
  locale: string,
  take = DEFAULT_SEARCH_TAKE
) {
  if (!query.trim()) return { products: [], total: 0 };

  const searchTerm = query.trim().toLowerCase();

  // Ищем по переводам (name) и sku
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        {
          translations: {
            some: {
              locale,
              name: { contains: searchTerm, mode: "insensitive" },
            },
          },
        },
        {
          sku: { contains: searchTerm, mode: "insensitive" },
        },
      ],
    },
    select: {
      ...productCardSelect,
      translations: {
        where: { locale },
        select: { name: true },
        take: 1,
      },
    },
    orderBy: { sortOrder: "asc" },
    take,
  });

  return { products, total: products.length };
}
