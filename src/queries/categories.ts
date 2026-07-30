// src/queries/categories.ts
// Задача 1.10 — Реальные Prisma-запросы категорий с 'use cache'
// MASTER_CONTEXT v1.3

import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { getCategoryFilterConfig, type QuickLink } from "@/lib/catalog-filter-config";
import type { ActiveFilters, CategoryFacets, FacetOption } from "@/types";
import { mapFrontendToDbAttributeKey, mapDbToFrontendAttributeKey, mapFrontendToDbAttributeValue, mapDbToFrontendAttributeValue } from "@/lib/attribute-mapper";


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
  count: number;
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
      _count: {
        select: { products: { where: { isActive: true } } },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  // Построение дерева с подсчетом количества товаров
  type BuildNode = CategoryTreeNode & { directCount: number };
  const map = new Map<string, BuildNode>();
  const roots: BuildNode[] = [];

  for (const cat of categories) {
    map.set(cat.id, {
      id: cat.id,
      slug: cat.slug,
      name: cat.translations[0]?.name ?? cat.slug,
      image: cat.image,
      sortOrder: cat.sortOrder,
      count: 0,
      directCount: cat._count?.products ?? 0,
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

  // Рекурсивно вычисляем общее количество товаров в категории и её подкатегориях
  function computeTotalCounts(node: BuildNode): number {
    let sum = node.directCount;
    for (const child of node.children as BuildNode[]) {
      sum += computeTotalCounts(child);
    }
    node.count = sum;
    return sum;
  }

  for (const root of roots) {
    computeTotalCounts(root);
  }

  return roots;
}

export async function getCategorySubtreeIds(categorySlug: string): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, slug: true, parentId: true },
  });

  const childrenMap = new Map<string, string[]>();
  let targetId: string | null = null;

  for (const cat of categories) {
    if (cat.slug === categorySlug) {
      targetId = cat.id;
    }
    if (cat.parentId) {
      const list = childrenMap.get(cat.parentId) || [];
      list.push(cat.id);
      childrenMap.set(cat.parentId, list);
    }
  }

  if (!targetId) return [];

  const subtreeIds: string[] = [];
  const queue: string[] = [targetId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    subtreeIds.push(currentId);
    const children = childrenMap.get(currentId);
    if (children) {
      queue.push(...children);
    }
  }

  return subtreeIds;
}

function getFilterSqls(activeFilters: ActiveFilters, excludeKey?: string) {
  const fragments: Prisma.Sql[] = [];

  // Always active filters
  fragments.push(Prisma.sql`p."isActive" = true`);

  // Brand
  if (excludeKey !== "brand" && activeFilters.brand && activeFilters.brand.length > 0) {
    fragments.push(Prisma.sql`b.slug IN (${Prisma.join(activeFilters.brand)})`);
  }

  // Price
  if (excludeKey !== "price") {
    if (activeFilters.priceMin !== undefined) {
      fragments.push(Prisma.sql`p.price >= ${activeFilters.priceMin}`);
    }
    if (activeFilters.priceMax !== undefined) {
      fragments.push(Prisma.sql`p.price <= ${activeFilters.priceMax}`);
    }
  }

  // InStock
  if (excludeKey !== "inStock" && activeFilters.inStock) {
    fragments.push(Prisma.sql`p.stock > 0`);
  }

  // Attributes
  const activeAttributeKeys = Object.keys(activeFilters).filter(
    (k) => !["brand", "priceMin", "priceMax", "inStock", "sort", "page"].includes(k)
  );

  for (const key of activeAttributeKeys) {
    if (excludeKey === key) continue;
    const values = activeFilters[key];
    if (Array.isArray(values) && values.length > 0) {
      const dbKey = mapFrontendToDbAttributeKey(key);
      const dbValues = values.map((v) => mapFrontendToDbAttributeValue(key, v));
      fragments.push(
        Prisma.sql`((jsonb_typeof(p.attributes->${dbKey}) = 'array' AND p.attributes->${dbKey} ?| ${dbValues}) OR (p.attributes->>${dbKey} IN (${Prisma.join(dbValues)})))`
      );
    }
  }

  return fragments;
}

export async function getCategoryFacets({
  categorySlug,
  activeFilters,
  locale,
}: {
  categorySlug: string;
  activeFilters: ActiveFilters;
  locale: "uk" | "ru";
}): Promise<CategoryFacets> {
  try {
    const categoryIds = await getCategorySubtreeIds(categorySlug);
    if (categoryIds.length === 0) {
      return getEmptyFacetsFallback(activeFilters);
    }

    const filterConfig = getCategoryFilterConfig(categorySlug);
    const allowedAttributeKeys = filterConfig.order.filter(
      (k) => !["brand", "price", "inStock", "sort", "page"].includes(k)
    );
    const allowedDbAttributeKeys = allowedAttributeKeys.map(mapFrontendToDbAttributeKey);

    // 1. Calculate total matched products under current active filters
    const allFilters = getFilterSqls(activeFilters);
    const whereClause = allFilters.length > 0
      ? Prisma.sql`WHERE p."categoryId" IN (${Prisma.join(categoryIds)}) AND ${Prisma.join(allFilters, ' AND ')}`
      : Prisma.sql`WHERE p."categoryId" IN (${Prisma.join(categoryIds)})`;

    const totalResult = await prisma.$queryRaw<{ count: number }[]>(
      Prisma.sql`
        SELECT COUNT(p.id)::int as count 
        FROM products p
        LEFT JOIN brands b ON p."brandId" = b.id
        ${whereClause}
      `
    );
    const total = totalResult[0]?.count ?? 0;

    // 2. Calculate price ranges (absolute min/max)
    const absolutePriceResult = await prisma.$queryRaw<{ min: number | null; max: number | null }[]>(
      Prisma.sql`
        SELECT MIN(p.price)::float as min, MAX(p.price)::float as max
        FROM products p
        WHERE p."categoryId" IN (${Prisma.join(categoryIds)}) AND p."isActive" = true
      `
    );
    const absoluteMin = absolutePriceResult[0]?.min ?? 0;
    const absoluteMax = absolutePriceResult[0]?.max ?? 0;

    // Available price range
    const priceExcludingFilters = getFilterSqls(activeFilters, "price");
    const priceWhereClause = priceExcludingFilters.length > 0
      ? Prisma.sql`WHERE p."categoryId" IN (${Prisma.join(categoryIds)}) AND ${Prisma.join(priceExcludingFilters, ' AND ')}`
      : Prisma.sql`WHERE p."categoryId" IN (${Prisma.join(categoryIds)})`;

    const availablePriceResult = await prisma.$queryRaw<{ min: number | null; max: number | null }[]>(
      Prisma.sql`
        SELECT MIN(p.price)::float as min, MAX(p.price)::float as max
        FROM products p
        LEFT JOIN brands b ON p."brandId" = b.id
        ${priceWhereClause}
      `
    );
    const availableMin = availablePriceResult[0]?.min ?? absoluteMin;
    const availableMax = availablePriceResult[0]?.max ?? absoluteMax;

    // 3. Price buckets (32 buckets)
    const BUCKET_COUNT = 32;
    const buckets = Array(BUCKET_COUNT).fill(0);
    if (absoluteMax > absoluteMin) {
      const bucketResults = await prisma.$queryRaw<{ bucket: number; count: number }[]>(
        Prisma.sql`
          SELECT 
            LEAST(31, GREATEST(0, FLOOR(((p.price - ${absoluteMin}::float) / NULLIF(${absoluteMax}::float - ${absoluteMin}::float, 0)) * 32)))::int as bucket,
            COUNT(p.id)::int as count
          FROM products p
          LEFT JOIN brands b ON p."brandId" = b.id
          ${priceWhereClause}
          GROUP BY bucket
        `
      );
      for (const r of bucketResults) {
        if (r.bucket >= 0 && r.bucket < BUCKET_COUNT) {
          buckets[r.bucket] = r.count;
        }
      }
    }

    // 4. Calculate brand facet options
    const brandExcludingFilters = getFilterSqls(activeFilters, "brand");
    const brandWhereClause = brandExcludingFilters.length > 0
      ? Prisma.sql`WHERE p."categoryId" IN (${Prisma.join(categoryIds)}) AND ${Prisma.join(brandExcludingFilters, ' AND ')}`
      : Prisma.sql`WHERE p."categoryId" IN (${Prisma.join(categoryIds)})`;

    const brandCountsResult = await prisma.$queryRaw<{ slug: string; count: number }[]>(
      Prisma.sql`
        SELECT 
          b.slug, 
          COUNT(p.id)::int as count
        FROM products p
        INNER JOIN brands b ON p."brandId" = b.id
        ${brandWhereClause}
        GROUP BY b.slug
      `
    );

    const allCategoryBrands = await prisma.brand.findMany({
      where: {
        products: {
          some: {
            categoryId: { in: categoryIds },
            isActive: true
          }
        }
      },
      select: { slug: true, name: true, logo: true }
    });

    const brandCountMap = new Map<string, number>();
    for (const b of brandCountsResult) {
      brandCountMap.set(b.slug, b.count);
    }

    const brands: FacetOption[] = allCategoryBrands.map((b) => {
      const isSelected = activeFilters.brand?.includes(b.slug) ?? false;
      const count = brandCountMap.get(b.slug) ?? 0;
      return {
        value: b.slug,
        label: b.name,
        count,
        selected: isSelected,
        disabled: count === 0 && !isSelected,
        logo: b.logo
      };
    });
    brands.sort((a, b) => a.label.localeCompare(b.label, locale, { numeric: true }));

    // 5. Calculate attribute facet options
    const activeAttributeKeys = Object.keys(activeFilters).filter(
      (k) => !["brand", "priceMin", "priceMax", "inStock", "sort", "page"].includes(k)
    );

    let nonActiveAttrCountsResult: { key: string; value: string; count: number }[] = [];
    const activeAttrCountsResult: { key: string; value: string; count: number }[] = [];
    let allCategoryAttributes: { key: string; value: string }[] = [];

    if (allowedDbAttributeKeys.length > 0) {
      nonActiveAttrCountsResult = await prisma.$queryRaw<{ key: string; value: string; count: number }[]>(
        Prisma.sql`
          SELECT 
            attr.key, 
            attr.value, 
            COUNT(p.id)::int as count
          FROM products p
          LEFT JOIN brands b ON p."brandId" = b.id
          CROSS JOIN LATERAL (
            SELECT key, jsonb_array_elements_text(
              CASE 
                WHEN jsonb_typeof(value) = 'array' THEN value 
                ELSE jsonb_build_array(value) 
              END
            ) as value
            FROM jsonb_each(p.attributes)
            WHERE key IN (${Prisma.join(allowedDbAttributeKeys)})
          ) attr
          ${whereClause}
          GROUP BY attr.key, attr.value
        `
      );

      for (const excludeKey of activeAttributeKeys) {
        if (!allowedAttributeKeys.includes(excludeKey)) continue;

        const excludeFilters = getFilterSqls(activeFilters, excludeKey);
        const excludeWhere = excludeFilters.length > 0
          ? Prisma.sql`WHERE p."categoryId" IN (${Prisma.join(categoryIds)}) AND ${Prisma.join(excludeFilters, ' AND ')}`
          : Prisma.sql`WHERE p."categoryId" IN (${Prisma.join(categoryIds)})`;

        const excludeDbKey = mapFrontendToDbAttributeKey(excludeKey);

        const res = await prisma.$queryRaw<{ key: string; value: string; count: number }[]>(
          Prisma.sql`
            SELECT 
              attr.key, 
              attr.value, 
              COUNT(p.id)::int as count
            FROM products p
            LEFT JOIN brands b ON p."brandId" = b.id
            CROSS JOIN LATERAL (
              SELECT key, jsonb_array_elements_text(
                CASE 
                  WHEN jsonb_typeof(value) = 'array' THEN value 
                  ELSE jsonb_build_array(value) 
                END
              ) as value
              FROM jsonb_each(p.attributes)
              WHERE key = ${excludeDbKey}
            ) attr
            ${excludeWhere}
            GROUP BY attr.key, attr.value
          `
        );
        activeAttrCountsResult.push(...res);
      }

      allCategoryAttributes = await prisma.$queryRaw<{ key: string; value: string }[]>(
        Prisma.sql`
          SELECT DISTINCT
            attr.key, 
            attr.value
          FROM products p
          CROSS JOIN LATERAL (
            SELECT key, jsonb_array_elements_text(
              CASE 
                WHEN jsonb_typeof(value) = 'array' THEN value 
                ELSE jsonb_build_array(value) 
              END
            ) as value
            FROM jsonb_each(p.attributes)
            WHERE key IN (${Prisma.join(allowedDbAttributeKeys)})
          ) attr
          WHERE p."categoryId" IN (${Prisma.join(categoryIds)}) AND p."isActive" = true
        `
      );
    }

    const attributeCountsMap = new Map<string, number>();
    for (const r of nonActiveAttrCountsResult) {
      const frontendKey = mapDbToFrontendAttributeKey(r.key);
      const frontendVal = mapDbToFrontendAttributeValue(frontendKey, r.value);
      attributeCountsMap.set(`${frontendKey}:${frontendVal}`, r.count);
    }
    for (const r of activeAttrCountsResult) {
      const frontendKey = mapDbToFrontendAttributeKey(r.key);
      const frontendVal = mapDbToFrontendAttributeValue(frontendKey, r.value);
      attributeCountsMap.set(`${frontendKey}:${frontendVal}`, r.count);
    }

    const possibleValuesByKey = new Map<string, Set<string>>();
    for (const item of allCategoryAttributes) {
      const frontendKey = mapDbToFrontendAttributeKey(item.key);
      const frontendVal = mapDbToFrontendAttributeValue(frontendKey, item.value);
      if (!possibleValuesByKey.has(frontendKey)) {
        possibleValuesByKey.set(frontendKey, new Set());
      }
      possibleValuesByKey.get(frontendKey)!.add(frontendVal);
    }

    for (const key of activeAttributeKeys) {
      if (!allowedAttributeKeys.includes(key)) continue;
      const values = activeFilters[key];
      if (Array.isArray(values)) {
        if (!possibleValuesByKey.has(key)) {
          possibleValuesByKey.set(key, new Set());
        }
        for (const val of values) {
          possibleValuesByKey.get(key)!.add(val);
        }
      }
    }

    const attributes: Record<string, FacetOption[]> = {};
    for (const [key, valuesSet] of possibleValuesByKey.entries()) {
      const options: FacetOption[] = [];
      const selectedValues = (activeFilters[key] as string[] | undefined) ?? [];

      for (const val of valuesSet) {
        const isSelected = selectedValues.includes(val);
        const count = attributeCountsMap.get(`${key}:${val}`) ?? 0;
        options.push({
          value: val,
          label: val,
          count,
          selected: isSelected,
          disabled: count === 0 && !isSelected,
        });
      }

      options.sort((a, b) => a.value.localeCompare(b.value, locale, { numeric: true }));
      attributes[key] = options;
    }

    return {
      total,
      price: {
        absoluteMin,
        absoluteMax,
        availableMin,
        availableMax,
        selectedMin: activeFilters.priceMin,
        selectedMax: activeFilters.priceMax,
        buckets,
      },
      brands,
      attributes,
    };
  } catch (error) {
    console.error("[getCategoryFacets] Error calculating facets:", error);
    return getEmptyFacetsFallback(activeFilters);
  }
}

function getEmptyFacetsFallback(activeFilters: ActiveFilters): CategoryFacets {
  return {
    total: 0,
    price: {
      absoluteMin: 0,
      absoluteMax: 0,
      availableMin: 0,
      availableMax: 0,
      selectedMin: activeFilters.priceMin,
      selectedMax: activeFilters.priceMax,
      buckets: Array(32).fill(0),
    },
    brands: [],
    attributes: {},
  };
}

export async function getCategoryFilters(slug: string) {
  // Legacy function: returns the facets with empty activeFilters
  const facets = await getCategoryFacets({
    categorySlug: slug,
    activeFilters: {},
    locale: "uk",
  });

  const attributes: Record<string, string[]> = {};
  const attributeCounts: Record<string, { value: string; count: number }[]> = {};

  for (const [key, options] of Object.entries(facets.attributes)) {
    attributes[key] = options.map((o) => o.value);
    attributeCounts[key] = options.map((o) => ({ value: o.value, count: o.count }));
  }

  return {
    brands: facets.brands.map((b) => ({ slug: b.value, name: b.label, count: b.count })),
    priceMin: facets.price.absoluteMin,
    priceMax: facets.price.absoluteMax,
    attributes,
    attributeCounts,
  };
}

export async function enrichQuickLinks(
  categorySlug: string,
  quickLinks: QuickLink[] | undefined
): Promise<(QuickLink & { imageUrl?: string | null })[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  cacheTag("products");
  cacheTag(`category-${categorySlug}-quick-links`);

  let linksToEnrich = quickLinks;
  if (!linksToEnrich || linksToEnrich.length === 0) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug, isActive: true },
      select: {
        children: {
          where: { isActive: true },
          select: {
            slug: true,
            image: true,
            translations: {
              select: { name: true, locale: true },
            },
          },
          take: 9,
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (category && category.children.length > 0) {
      linksToEnrich = category.children.map((child) => {
        const ukName = child.translations.find((t) => t.locale === "uk")?.name ?? child.slug;
        const ruName = child.translations.find((t) => t.locale === "ru")?.name ?? child.slug;
        return {
          label: { uk: ukName, ru: ruName },
          href: `/catalog/${child.slug}`,
          imageUrl: child.image,
        };
      });
    }
  }

  return linksToEnrich ?? [];
}
