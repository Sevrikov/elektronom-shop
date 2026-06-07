'use server'

import { prisma } from '@/lib/prisma'
import { getTransformedImageUrl } from '@/lib/images'
import type { CompareColumn, CompareProduct, CompareDirection } from '@/components/compare/compare-table'
import { translateAttributeKey, translateAttributeValue } from '@/lib/translit-translator'

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

  // 1. Current / Amperage
  if (
    norm.includes('strum') ||
    norm.includes('tok') ||
    norm.includes('rating') ||
    norm.includes('current')
  ) {
    return 10
  }

  // 2. Voltage
  if (
    norm.includes('napruh') ||
    norm.includes('napryazh') ||
    norm.includes('voltage')
  ) {
    return 20
  }

  // 3. Poles / Contacts / Phases / Modules
  if (
    norm.includes('polyus') ||
    norm.includes('poles') ||
    norm.includes('kontakt') ||
    norm.includes('phase') ||
    norm.includes('moduley')
  ) {
    return 30
  }

  // 4. Breaking capacity / Strength
  if (
    norm.includes('breaking') ||
    norm.includes('vymykayuch') ||
    norm.includes('otklyuch') ||
    norm.includes('mitsnist') ||
    norm.includes('prochnost')
  ) {
    return 40
  }

  // 5. IP Protection
  if (
    norm.includes('ip') ||
    norm.includes('zashchyt') ||
    norm.includes('zahyst') ||
    norm.includes('protection')
  ) {
    return 50
  }

  // 6. Temperature / Operating conditions
  if (
    norm.includes('temperat') ||
    norm.includes('ekspluat') ||
    norm.includes('uslov') ||
    norm.includes('umov')
  ) {
    return 60
  }

  // 7. Mounting / Installation
  if (
    norm.includes('montazh') ||
    norm.includes('mounting')
  ) {
    return 70
  }

  // 8. Dimensions, weight, volume
  if (
    norm.includes('ves') ||
    norm.includes('weight') ||
    norm.includes('ob_yem') ||
    norm.includes('obyem') ||
    norm.includes('volume') ||
    norm.includes('size') ||
    norm.includes('massa') ||
    norm.includes('masa') ||
    norm.includes('length') ||
    norm.includes('dlyna') ||
    norm.includes('dovzh')
  ) {
    return 80
  }

  // 9. Packaging quantities / Box count
  if (
    norm.includes('upakov') ||
    norm.includes('yashch') ||
    norm.includes('qty') ||
    norm.includes('kilkist') ||
    norm.includes('kolich')
  ) {
    return 90
  }

  // 10. Advantages / features
  if (
    norm.startsWith('perevaha') ||
    norm.startsWith('advantage') ||
    norm.includes('osobennost') ||
    norm.includes('osoblyvost')
  ) {
    return 110
  }

  // 11. General text / others
  return 100
}

export interface CompareGroup {
  categoryId: string
  categoryName: string
  products: CompareProduct[]
  columns: CompareColumn[]
}

export async function getCompareData(
  productIds: string[],
  locale: 'uk' | 'ru' = 'uk'
): Promise<{
  groups: CompareGroup[]
}> {
  if (!productIds || productIds.length === 0) {
    return { groups: [] }
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
      category: {
        select: {
          id: true,
          slug: true,
          translations: {
            where: { locale },
            select: { name: true },
            take: 1,
          },
        },
      },
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
  const productOrder = new Map(productIds.map((id, index) => [id, index]))
  dbProducts.sort((a, b) => (productOrder.get(a.id) ?? 9999) - (productOrder.get(b.id) ?? 9999))

  // Group DB products by category
  const groupsMap = new Map<string, {
    categoryName: string
    dbProducts: typeof dbProducts
  }>()

  for (const p of dbProducts) {
    const catId = p.category?.id ?? 'other'
    const catName = p.category?.translations[0]?.name ?? p.category?.slug ?? (locale === 'ru' ? 'Другие товары' : 'Інші товари')
    
    if (!groupsMap.has(catId)) {
      groupsMap.set(catId, { categoryName: catName, dbProducts: [] })
    }
    groupsMap.get(catId)!.dbProducts.push(p)
  }

  const groups: CompareGroup[] = []

  for (const [categoryId, groupData] of groupsMap.entries()) {
    const { categoryName, dbProducts: groupDbProducts } = groupData

    // 2. Identify all attribute keys present in this group's products
    const presentAttrKeys = new Set<string>()
    for (const p of groupDbProducts) {
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

    // Filter the keys to exclude columns where most compared products in this group have no value.
    const filteredAttrKeys = Array.from(presentAttrKeys).filter((key) => {
      const hasValueCount = groupDbProducts.filter((p) => {
        const attrs = (p.attributes as Record<string, unknown>) ?? {}
        const val = attrs[key]
        return val !== null && val !== undefined && val !== ''
      }).length

      const threshold = groupDbProducts.length / 2
      return groupDbProducts.length === 1
        ? hasValueCount >= 1
        : (hasValueCount >= 2 && hasValueCount >= threshold)
    })

    // Sort the keys: quantitative specs first, then other specs, then advantages last (numerically sorted)
    const sortedAttrKeys = filteredAttrKeys.sort((a, b) => {
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
        columns.push({
          key,
          label: translateAttributeKey(key, locale),
          direction: 'text',
        })
      }
    }

    // 4. Map products to the CompareProduct structure
    const products: CompareProduct[] = groupDbProducts.map((p) => {
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
        const rawVal = attrs[key]
        values[key] = typeof rawVal === 'string'
          ? translateAttributeValue(rawVal, locale)
          : (rawVal as string | number | null | undefined)
      }

      return {
        id: p.id,
        name,
        sku: p.sku,
        image: imageUrl,
        values,
      }
    })

    groups.push({
      categoryId,
      categoryName,
      products,
      columns,
    })
  }

  return { groups }
}
