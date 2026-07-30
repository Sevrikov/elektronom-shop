// src/queries/showcase.ts
import { prisma } from '@/lib/prisma'
import { productCardSelect, mapProductDecimals } from './products'
import { getCategorySubtreeIds } from './categories'
import type { ShowcaseCategoryHub } from '@/components/home/category-showcase-vitrine'
import type { Locale } from '@/types'

export async function getShowcaseHubs(locale: Locale): Promise<ShowcaseCategoryHub[]> {
  const hubsConfig = [
    {
      slug: 'elektryka',
      title: { uk: 'Електрика', ru: 'Электрика' },
      badge: { uk: 'ТОП ПРОДАЖІВ', ru: 'ТОП ПРОДАЖ' },
      subSlugs: [
        'avtomatychni-vymykachi',
        'dyferentsialni-avtomatychni-vymykachi-bez-zakhystu-vid-nadstrumu-pzv',
        'kabeli-droty',
        'elektroustanovochni-vyroby',
        'shchytky-modulni-vbudovani-ubox',
        'led-osvitlennya',
      ],
    },
    {
      slug: 'instrumenty',
      title: { uk: 'Інструмент', ru: 'Инструмент' },
      badge: { uk: 'ХІТИ ТА НОВИНКИ', ru: 'ХИТЫ И НОВИНКИ' },
      subSlugs: [
        'stolyarno-slyusarnyy-instrument',
        'instrument-akumulyatornyy',
        'dreli-perforatory',
        'multimetry-testery',
        'spetsodag-zakhyst',
        'krepezh-metizy',
      ],
    },
    {
      slug: 'dzherela-bezperebiynoho-zhyvlennya-dbzh',
      title: { uk: 'ДБЖ та акумулятори', ru: 'ИБП и аккумуляторы' },
      badge: { uk: 'ЭНЕРГОНЕЗАВИСИМОСТЬ', ru: 'ЭНЕРГОНЕЗАВИСИМОСТЬ' },
      subSlugs: [
        'ups-dzherelo-bezperebiynoho-zhyvlennya',
        'invertory',
        'mini-ups-dlya-routera',
        'sylovi-kabeli',
      ],
    },
    {
      slug: 'alternatyvna-enerhetyka',
      title: { uk: 'Альтернативна енергетика', ru: 'Альтернативная энергетика' },
      badge: { uk: 'ЭКО-ТЕХНОЛОГИИ', ru: 'ЭКО-ТЕХНОЛОГИИ' },
      subSlugs: [
        'invertory',
        'mini-ups-dlya-routera',
        'ups-dzherelo-bezperebiynoho-zhyvlennya',
        'merezhevyy-kabel',
      ],
    },
    {
      slug: 'zvaryuvalne-obladnannya',
      title: { uk: 'Зварювальне обладнання', ru: 'Сварочное оборудование' },
      badge: { uk: 'ПРОФЕСІЙНЕ', ru: 'ПРОФЕССИОНАЛЬНОЕ' },
      subSlugs: [
        'instrumenty',
        'spetsodag-zakhyst',
        'stolyarno-slyusarnyy-instrument',
      ],
    },
    {
      slug: 'videonablyudeniye',
      title: { uk: 'Видеонаглядение & Безпека', ru: 'Видеонаблюдение & Безопасность' },
      badge: { uk: 'БЕЗПЕКА 24/7', ru: 'БЕЗОПАСНОСТЬ 24/7' },
      subSlugs: [
        'cctv',
        'ohorona',
        'nvr',
        'smoke',
        'merezhevyy-kabel',
      ],
    },
  ]

  // Pre-fetch overall fallback products to guarantee vitrine always has products
  const fallbackProductsRaw = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      ...productCardSelect,
      translations: {
        where: { locale },
        select: { locale: true, name: true },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 12,
  })

  const fallbackProducts = fallbackProductsRaw.map(mapProductDecimals)

  const hubs: ShowcaseCategoryHub[] = await Promise.all(
    hubsConfig.map(async (cfg) => {
      // Fetch subcategories
      const subcategoriesData = await prisma.category.findMany({
        where: {
          slug: { in: cfg.subSlugs },
          isActive: true,
        },
        select: {
          slug: true,
          translations: {
            where: { locale },
            select: { name: true },
            take: 1,
          },
        },
      })

      const subcategories = cfg.subSlugs.map((sSlug) => {
        const found = subcategoriesData.find((d) => d.slug === sSlug)
        const nameUk = found?.translations[0]?.name ?? sSlug.replace(/-/g, ' ')
        const nameRu = found?.translations[0]?.name ?? sSlug.replace(/-/g, ' ')
        return {
          slug: sSlug,
          name: { uk: nameUk, ru: nameRu },
        }
      })

      // Fetch products for all subcategories in this hub
      const allSubCategoryProductsRaw = await prisma.product.findMany({
        where: {
          isActive: true,
          category: {
            OR: [
              { slug: cfg.slug },
              { slug: { in: cfg.subSlugs } },
              { parent: { slug: cfg.slug } },
            ],
          },
        },
        select: {
          ...productCardSelect,
          translations: {
            where: { locale },
            select: { locale: true, name: true },
            take: 1,
          },
        },
        orderBy: { sortOrder: 'asc' },
        take: 36,
      })

      const hubProducts = allSubCategoryProductsRaw.length > 0
        ? allSubCategoryProductsRaw.map(mapProductDecimals)
        : fallbackProducts

      // Map products specifically per subcategory slug
      const productsBySubcategory: Record<string, typeof fallbackProducts> = {}

      await Promise.all(
        subcategories.map(async (sub) => {
          // 1. Fetch exact subtree category IDs for this subcategory
          const subTreeIds = await getCategorySubtreeIds(sub.slug)

          let subProductsRaw: typeof allSubCategoryProductsRaw = []
          if (subTreeIds.length > 0) {
            subProductsRaw = await prisma.product.findMany({
              where: {
                isActive: true,
                categoryId: { in: subTreeIds },
              },
              select: {
                ...productCardSelect,
                translations: {
                  where: { locale },
                  select: { locale: true, name: true },
                  take: 1,
                },
              },
              orderBy: { sortOrder: 'asc' },
              take: 12,
            })
          }

          if (subProductsRaw.length > 0) {
            productsBySubcategory[sub.slug] = subProductsRaw.map(mapProductDecimals)
          } else {
            // 2. Fallback: Filter hubProducts by strict category slug/title relevance (preventing PZV from appearing under circuit breakers)
            const isAvtomat = sub.slug.includes('avtomat') && !sub.slug.includes('pzv') && !sub.slug.includes('dyferent')
            const isPzv = sub.slug.includes('pzv') || sub.slug.includes('dyferent')

            const matched = hubProducts.filter((p) => {
              const catSlug = (p.category.slug || '').toLowerCase()
              const nameLower = (p.translations[0]?.name ?? p.slug).toLowerCase()

              if (isAvtomat) {
                if (catSlug.includes('pzv') || catSlug.includes('dyferent') || nameLower.includes('пзв') || nameLower.includes('узо')) {
                  return false
                }
                return catSlug.includes('avtomat') || nameLower.includes('автомат') || nameLower.includes('выключатель')
              }

              if (isPzv) {
                return catSlug.includes('pzv') || catSlug.includes('dyferent') || nameLower.includes('пзв') || nameLower.includes('узо') || nameLower.includes('диф')
              }

              return catSlug.includes(sub.slug) || sub.slug.includes(catSlug)
            })

            productsBySubcategory[sub.slug] = matched.length > 0 ? matched.slice(0, 12) : hubProducts.slice(0, 12)
          }
        })
      )

      return {
        slug: cfg.slug,
        title: cfg.title,
        badge: cfg.badge,
        subcategories,
        products: hubProducts.slice(0, 12),
        productsBySubcategory,
      }
    })
  )

  return hubs
}

