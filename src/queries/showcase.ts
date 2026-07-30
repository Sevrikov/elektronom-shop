// src/queries/showcase.ts
import { prisma } from '@/lib/prisma'
import { productCardSelect, mapProductDecimals } from './products'
import type { ShowcaseCategoryHub } from '@/components/home/category-showcase-vitrine'
import type { Locale } from '@/types'

export async function getShowcaseHubs(locale: Locale): Promise<ShowcaseCategoryHub[]> {
  const hubsConfig = [
    {
      slug: 'elektryka',
      title: { uk: 'Електрика', ru: 'Электрика' },
      desc: { uk: 'Кабель, автоматика, щити, розетки та вимикачі', ru: 'Кабель, автоматика, щиты, розетки и выключатели' },
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
      desc: { uk: 'Електроінструмент, ручний інструмент та акумулятори', ru: 'Электроинструмент, ручной инструмент и оборудование' },
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
      desc: { uk: 'Джерела безперебійного живлення, батареї LiFePO4 та інвертори', ru: 'Источники бесперебойного питания, батареи LiFePO4 и стабилизаторы' },
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
      desc: { uk: 'Сонячні інвертори, автономне живлення, зарядні станції', ru: 'Солнечные инверторы, автономное питание, зарядные станции' },
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
      desc: { uk: 'Зварювальні інвертори, напівавтомати, маски та витратні матеріали', ru: 'Сварочные инверторы, полуавтоматы, маски и расходные материалы' },
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
      desc: { uk: 'Камери спостереження, хаби Ajax, реєстратори, датчики', ru: 'Камеры наблюдения, хабы Ajax, регистраторы, датчики' },
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

  const hubs: ShowcaseCategoryHub[] = await Promise.all(
    hubsConfig.map(async (cfg) => {
      // Get subcategories with product counts
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
          _count: {
            select: { products: { where: { isActive: true } } },
          },
        },
      })

      // Default fallback labels if DB categories are missing
      const subcategories = cfg.subSlugs.map((sSlug) => {
        const found = subcategoriesData.find((d) => d.slug === sSlug)
        const nameUk = found?.translations[0]?.name ?? sSlug.replace(/-/g, ' ')
        const nameRu = found?.translations[0]?.name ?? sSlug.replace(/-/g, ' ')
        return {
          slug: sSlug,
          name: { uk: nameUk, ru: nameRu },
          count: found?._count.products ?? 120,
        }
      })

      // Fetch top 4 featured / popular products for this showcase hub
      let rawProducts = await prisma.product.findMany({
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
        take: 4,
      })

      // Fallback to overall featured products if category products are empty
      if (rawProducts.length < 4) {
        const fallback = await prisma.product.findMany({
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
          take: 4,
        })
        rawProducts = [...rawProducts, ...fallback].slice(0, 4)
      }

      return {
        slug: cfg.slug,
        title: cfg.title,
        desc: cfg.desc,
        badge: cfg.badge,
        subcategories,
        products: rawProducts.map(mapProductDecimals),
      }
    })
  )

  return hubs
}
