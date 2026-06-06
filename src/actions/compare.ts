'use server'

import { prisma } from '@/lib/prisma'
import { getTransformedImageUrl } from '@/lib/images'
import type { CompareColumn, CompareProduct, CompareDirection } from '@/components/compare/compare-table'

const ATTR_METADATA: Record<string, { label: { uk: string; ru: string }; direction: CompareDirection; unit?: string }> = {
  poles: {
    label: { uk: 'Кількість полюсів', ru: 'Количество полюсов' },
    direction: 'text',
  },
  rating_a: {
    label: { uk: 'Номінальний струм', ru: 'Номинальный ток' },
    direction: 'higher',
    unit: 'А',
  },
  breaking_ka: {
    label: { uk: 'Відключна здатність', ru: 'Отключающая способность' },
    direction: 'higher',
    unit: 'кА',
  },
  voltage_v: {
    label: { uk: 'Номінальна напруга', ru: 'Номинальное напряжение' },
    direction: 'text',
    unit: 'В',
  },
  curve: {
    label: { uk: 'Характеристика спрацювання', ru: 'Характеристика срабатывания' },
    direction: 'text',
  },
  weight_kg: {
    label: { uk: 'Маса', ru: 'Масса' },
    direction: 'lower',
    unit: 'кг',
  },
  ip_class: {
    label: { uk: 'Ступінь захисту', ru: 'Степень защиты IP' },
    direction: 'higher',
  },
  power_w: {
    label: { uk: 'Потужність', ru: 'Мощность' },
    direction: 'higher',
    unit: 'Вт',
  },
  frequency_hz: {
    label: { uk: 'Частота', ru: 'Частота' },
    direction: 'text',
    unit: 'Гц',
  },
  phase: {
    label: { uk: 'Кількість фаз', ru: 'Количество фаз' },
    direction: 'text',
  },
  mounting: {
    label: { uk: 'Спосіб монтажу', ru: 'Способ монтажа' },
    direction: 'text',
  },
  cross_section_mm2: {
    label: { uk: 'Переріз', ru: 'Сечение' },
    direction: 'text',
    unit: 'мм²',
  },
  length_m: {
    label: { uk: 'Довжина', ru: 'Длина' },
    direction: 'text',
    unit: 'м',
  },
}

export async function getCompareData(
  productIds: string[],
  locale: 'uk' | 'ru' = 'uk'
): Promise<{
  products: CompareProduct[]
  columns: CompareColumn[]
}> {
  if (!productIds || productIds.length === 0) {
    return { products: [], columns: [] }
  }

  // 1. Fetch products from the database using precise fields
  const dbProducts = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isActive: true,
    },
    select: {
      id: true,
      sku: true,
      price: true,
      comparePrice: true,
      attributes: true,
      translations: {
        where: { locale },
        select: { name: true },
        take: 1,
      },
      images: {
        select: { url: true, processedUrl: true, provider: true, publicId: true, alt: true, sortOrder: true },
        orderBy: { sortOrder: 'asc' },
        take: 1,
      },
    },
    take: 50, // Keep query within limit safety
  })

  // 2. Identify all attribute keys present in the fetched products
  const presentAttrKeys = new Set<string>()
  for (const p of dbProducts) {
    const attrs = (p.attributes as Record<string, unknown>) ?? {}
    for (const key of Object.keys(attrs)) {
      // ignore helper or internal engineering fields, and ignore Artykul/SKU
      const norm = key.toLowerCase().replace(/[\s_-]+/g, '')
      if (
        key !== 'engineeringRole' &&
        key !== 'qty_breaks' &&
        norm !== 'artykul' &&
        norm !== 'артикул' &&
        norm !== 'sku' &&
        attrs[key] !== null &&
        attrs[key] !== undefined &&
        attrs[key] !== ''
      ) {
        presentAttrKeys.add(key)
      }
    }
  }

  // 3. Build dynamic columns starting with Price
  const priceLabel = locale === 'uk' ? 'Ціна' : 'Цена'
  const columns: CompareColumn[] = [
    { key: 'price', label: priceLabel, direction: 'lower', unit: '₴' },
  ]

  for (const key of presentAttrKeys) {
    const meta = ATTR_METADATA[key]
    if (meta) {
      columns.push({
        key,
        label: meta.label[locale],
        direction: meta.direction,
        ...(meta.unit ? { unit: meta.unit } : {}),
      })
    } else {
      // Fallback formatting for unmapped custom attributes
      const formattedLabel = key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
      columns.push({
        key,
        label: formattedLabel,
        direction: 'text',
      })
    }
  }

  // 4. Map products to the CompareProduct structure
  const products: CompareProduct[] = dbProducts.map((p) => {
    const name = p.translations[0]?.name ?? p.sku
    const mainImage = p.images[0] ?? null
    const imageUrl = mainImage
      ? getTransformedImageUrl(mainImage, { width: 320, height: 320, crop: 'limit' })
      : null

    const attrs = (p.attributes as Record<string, unknown>) ?? {}
    const values: Record<string, string | number | null | undefined> = {
      price: Number(p.price),
    }

    for (const key of presentAttrKeys) {
      values[key] = attrs[key] as string | number | null | undefined
    }

    return {
      id: p.id,
      name,
      sku: p.sku,
      image: imageUrl,
      values,
    }
  })

  return { products, columns }
}
