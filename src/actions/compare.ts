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
  ves_kh: {
    label: { uk: 'Маса, кг', ru: 'Масса, кг' },
    direction: 'lower',
  },
  ob_yem_kh: {
    label: { uk: 'Об\'єм, м³', ru: 'Объем, м³' },
    direction: 'lower',
  },
  kilkist_v_yashchyku_sht: {
    label: { uk: 'Кількість в упаковці, шт', ru: 'Количество в упаковке, шт' },
    direction: 'higher',
  },
  vidpovidnist_standartam: {
    label: { uk: 'Відповідність стандартам', ru: 'Соответствие стандартам' },
    direction: 'text',
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

function getColumnPriority(key: string): number {
  const norm = key.toLowerCase().replace(/[\s_-]+/g, '_')
  if (norm === 'price') return 0
  
  // quantitative characteristics
  if (
    norm.includes('ves') || 
    norm.includes('weight') || 
    norm.includes('ob_yem') || 
    norm.includes('obyem') || 
    norm.includes('volume') ||
    norm.includes('kilkist') || 
    norm.includes('qty') ||
    norm.includes('rating') ||
    norm.includes('breaking') ||
    norm.includes('voltage') ||
    norm.includes('poles') ||
    norm.includes('current')
  ) {
    return 1
  }
  
  // advantages are last
  if (norm.startsWith('perevaha') || norm.startsWith('advantage')) {
    return 3
  }
  
  // other text specifications
  return 2
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

  // Sort the keys: quantitative specs first, then other specs, then advantages last (numerically sorted)
  const sortedAttrKeys = Array.from(presentAttrKeys).sort((a, b) => {
    const prioA = getColumnPriority(a)
    const prioB = getColumnPriority(b)
    if (prioA !== prioB) return prioA - prioB
    
    const normA = a.toLowerCase().replace(/[\s_-]+/g, '_')
    const normB = b.toLowerCase().replace(/[\s_-]+/g, '_')
    if (normA.startsWith('perevaha') && normB.startsWith('perevaha')) {
      const numA = parseInt(normA.replace('perevaha', '').replace(/[^0-9]/g, '')) || 0
      const numB = parseInt(normB.replace('perevaha', '').replace(/[^0-9]/g, '')) || 0
      return numA - numB
    }
    
    return a.localeCompare(b)
  })

  // 3. Build dynamic columns starting with Price
  const priceLabel = locale === 'uk' ? 'Ціна' : 'Цена'
  const columns: CompareColumn[] = [
    { key: 'price', label: priceLabel, direction: 'lower', unit: '₴' },
  ]

  for (const key of sortedAttrKeys) {
    const normKey = key.toLowerCase().replace(/[\s_-]+/g, '_')
    const meta = ATTR_METADATA[normKey]
    if (meta) {
      columns.push({
        key,
        label: meta.label[locale],
        direction: meta.direction,
        ...(meta.unit ? { unit: meta.unit } : {}),
      })
    } else if (normKey.startsWith('perevaha')) {
      const num = normKey.replace('perevaha', '').replace(/[^0-9]/g, '').trim()
      const labelUk = `Перевага ${num}`
      const labelRu = `Преимущество ${num}`
      columns.push({
        key,
        label: locale === 'ru' ? labelRu : labelUk,
        direction: 'text',
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

    for (const key of sortedAttrKeys) {
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
