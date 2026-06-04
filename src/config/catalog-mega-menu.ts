// src/config/catalog-mega-menu.ts
// Curated popular items and promo blocks per top-level category.
// TODO Sprint 3: replace popular/promo with DB-driven admin config.

export interface MegaMenuPopularItem {
  slug: string
  labelUk: string
  labelRu: string
  href: string
}

export interface MegaMenuPromo {
  titleUk: string
  titleRu: string
  subtitleUk: string
  subtitleRu: string
  ctaUk: string
  ctaRu: string
  href: string
  image?: string
}

export interface MegaMenuCategoryConfig {
  /** matches Category.slug from DB */
  slug: string
  popular: MegaMenuPopularItem[]
  promo: MegaMenuPromo
}

export const megaMenuConfig: MegaMenuCategoryConfig[] = [
  {
    slug: 'elektryka',
    popular: [
      { slug: 'avtomaty', labelUk: 'Автоматичні вимикачі', labelRu: 'Автоматические выключатели', href: '/catalog/avtomatychni-vymykachi' },
      { slug: 'uzo', labelUk: 'УЗО та диф-автомати', labelRu: 'УЗО и диф-автоматы', href: '/catalog/dyferentsialni-avtomatychni-vymykachi-bez-zakhystu-vid-nadstrumu-pzv' },
      { slug: 'shchyty', labelUk: 'Щити електричні', labelRu: 'Щиты электрические', href: '/catalog/shchytky-modulni-vbudovani-ubox' },
      { slug: 'rozetky', labelUk: 'Розетки та вимикачі', labelRu: 'Розетки и выключатели', href: '/catalog/elektroustanovochni-vyroby' },
    ],
    promo: {
      titleUk: 'Електрика ABB та Schneider',
      titleRu: 'Электрика ABB и Schneider',
      subtitleUk: 'Офіційний дистрибʼютор. Гарантія та документи.',
      subtitleRu: 'Официальный дистрибьютор. Гарантия и документы.',
      ctaUk: 'Перейти до електрики',
      ctaRu: 'Перейти к электрике',
      href: '/catalog/elektryka',
    },
  },
  {
    slug: 'instrumenty',
    popular: [
      { slug: 'dreli', labelUk: 'Дрилі та перфоратори', labelRu: 'Дрели и перфораторы', href: '/catalog/instrumenty' },
      { slug: 'ruchnyy', labelUk: 'Ручний інструмент', labelRu: 'Ручной инструмент', href: '/catalog/stolyarno-slyusarnyy-instrument' },
      { slug: 'elektrynyy', labelUk: 'Акумуляторний інструмент', labelRu: 'Аккумуляторный инструмент', href: '/catalog/instrument-akumulyatornyy' },
    ],
    promo: {
      titleUk: 'Makita та Bosch',
      titleRu: 'Makita и Bosch',
      subtitleUk: 'Великий вибір інструментів для будівництва та ремонту.',
      subtitleRu: 'Большой выбор инструментов для строительства и ремонта.',
      ctaUk: 'До інструментів',
      ctaRu: 'К инструментам',
      href: '/catalog/instrumenty',
    },
  },
  {
    slug: 'led-osvitlennya',
    popular: [
      { slug: 'led-lampy', labelUk: 'LED-лампи', labelRu: 'LED-лампы', href: '/catalog/led-osvitlennya' },
      { slug: 'svitylnyky', labelUk: 'Світильники', labelRu: 'Светильники', href: '/catalog/led-osvitlennya' },
    ],
    promo: {
      titleUk: 'LED-освітлення',
      titleRu: 'LED-освещение',
      subtitleUk: 'Економте до 80% електроенергії з LED-рішеннями.',
      subtitleRu: 'Экономьте до 80% электроэнергии с LED-решениями.',
      ctaUk: 'Вибрати LED',
      ctaRu: 'Выбрать LED',
      href: '/catalog/led-osvitlennya',
    },
  },
  {
    slug: 'kabeli-droty',
    popular: [
      { slug: 'vvg', labelUk: 'Кабель ВВГ', labelRu: 'Кабель ВВГ', href: '/catalog/kabeli-droty' },
      { slug: 'sylovi', labelUk: 'Силові кабелі', labelRu: 'Силовые кабели', href: '/catalog/sylovi-kabeli' },
      { slug: 'merezhevyi', labelUk: 'Мережевий кабель', labelRu: 'Сетевой кабель', href: '/catalog/merezhevyy-kabel' },
    ],
    promo: {
      titleUk: 'Кабельна продукція',
      titleRu: 'Кабельная продукция',
      subtitleUk: 'Широкий асортимент кабелів та проводів від провідних виробників.',
      subtitleRu: 'Широкий ассортимент кабелей и проводов от ведущих производителей.',
      ctaUk: 'До кабелів',
      ctaRu: 'К кабелям',
      href: '/catalog/kabeli-droty',
    },
  },
  {
    slug: 'elektroustanovochni-vyroby',
    popular: [
      { slug: 'rozetky-schuko', labelUk: 'Розетки', labelRu: 'Розетки', href: '/catalog/rozetky' },
      { slug: 'vymykachi', labelUk: 'Вимикачі', labelRu: 'Выключатели', href: '/catalog/vymykachi' },
    ],
    promo: {
      titleUk: 'Розетки та вимикачі',
      titleRu: 'Розетки и выключатели',
      subtitleUk: 'Legrand, Schneider, Werkel — вся лінійка в одному місці.',
      subtitleRu: 'Legrand, Schneider, Werkel — вся линейка в одном месте.',
      ctaUk: 'До розеток',
      ctaRu: 'К розеткам',
      href: '/catalog/elektroustanovochni-vyroby',
    },
  },
  {
    slug: 'dzherela-bezperebiynoho-zhyvlennya-dbzh',
    popular: [
      { slug: 'ups', labelUk: 'Джерела безперебійного живлення', labelRu: 'Источники бесперебойного питания', href: '/catalog/ups-dzherelo-bezperebiynoho-zhyvlennya' },
      { slug: 'invertory', labelUk: 'Інвертори', labelRu: 'Инверторы', href: '/catalog/invertory' },
      { slug: 'router-ups', labelUk: 'Міні ДБЖ для роутера', labelRu: 'Мини ИБП для роутера', href: '/catalog/mini-ups-dlya-routera' },
    ],
    promo: {
      titleUk: 'Автоматика для надійного живлення',
      titleRu: 'Автоматика для надёжного питания',
      subtitleUk: 'ДБЖ, інвертори, стабілізатори від провідних брендів.',
      subtitleRu: 'ИБП, инверторы, стабилизаторы от ведущих брендов.',
      ctaUk: 'До ДБЖ',
      ctaRu: 'К ИБП',
      href: '/catalog/dzherela-bezperebiynoho-zhyvlennya-dbzh',
    },
  },
  {
    slug: 'rozumnyy-budynok',
    popular: [
      { slug: 'smart-budynok', labelUk: 'Розумний будинок', labelRu: 'Умный дом', href: '/catalog/rozumnyy-budynok' },
    ],
    promo: {
      titleUk: 'Розумний будинок',
      titleRu: 'Умный дом',
      subtitleUk: 'Автоматизуйте свій дім із сучасними рішеннями IoT.',
      subtitleRu: 'Автоматизируйте свой дом с современными IoT-решениями.',
      ctaUk: 'Розумний будинок',
      ctaRu: 'Умный дом',
      href: '/catalog/rozumnyy-budynok',
    },
  },
]

/** Fallback promo for categories without a config entry */
export function getPromoForSlug(slug: string, locale: 'uk' | 'ru'): { title: string; subtitle: string; cta: string; href: string; image?: string } {
  const cfg = megaMenuConfig.find((c) => c.slug === slug)
  if (cfg) {
    return {
      title: locale === 'uk' ? cfg.promo.titleUk : cfg.promo.titleRu,
      subtitle: locale === 'uk' ? cfg.promo.subtitleUk : cfg.promo.subtitleRu,
      cta: locale === 'uk' ? cfg.promo.ctaUk : cfg.promo.ctaRu,
      href: cfg.promo.href,
      ...(cfg.promo.image ? { image: cfg.promo.image } : {}),
    }
  }
  return {
    title: slug,
    subtitle: '',
    cta: locale === 'uk' ? 'Перейти до категорії' : 'Перейти в категорию',
    href: `/catalog/${slug}`,
  }
}

export function getPopularForSlug(slug: string, locale: 'uk' | 'ru'): { label: string; href: string }[] {
  const cfg = megaMenuConfig.find((c) => c.slug === slug)
  if (!cfg) return []
  return cfg.popular.map((p) => ({
    label: locale === 'uk' ? p.labelUk : p.labelRu,
    href: p.href,
  }))
}
