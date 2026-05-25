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
    slug: 'elektrika',
    popular: [
      { slug: 'avtomaty', labelUk: 'Автоматичні вимикачі', labelRu: 'Автоматические выключатели', href: '/catalog/avtomaty' },
      { slug: 'uzo', labelUk: 'УЗО та диф-автомати', labelRu: 'УЗО и диф-автоматы', href: '/catalog/pzv-ta-dyf-avtomaty' },
      { slug: 'shchyty', labelUk: 'Щити електричні', labelRu: 'Щиты электрические', href: '/catalog/shchyty-elektrychni' },
      { slug: 'pusk', labelUk: 'Пускова апаратура', labelRu: 'Пусковая аппаратура', href: '/catalog/puskova-aparatura' },
      { slug: 'rozetky', labelUk: 'Розетки та вимикачі', labelRu: 'Розетки и выключатели', href: '/catalog/rozetky-ta-vymykachi' },
    ],
    promo: {
      titleUk: 'Електрика ABB та Schneider',
      titleRu: 'Электрика ABB и Schneider',
      subtitleUk: 'Офіційний дистрибʼютор. Гарантія та документи.',
      subtitleRu: 'Официальный дистрибьютор. Гарантия и документы.',
      ctaUk: 'Перейти до електрики',
      ctaRu: 'Перейти к электрике',
      href: '/catalog/elektrika',
    },
  },
  {
    slug: 'instrumenty',
    popular: [
      { slug: 'dreli', labelUk: 'Дрилі та перфоратори', labelRu: 'Дрели и перфораторы', href: '/catalog/instrumenty' },
      { slug: 'shlif', labelUk: 'Шліфувальні машини', labelRu: 'Шлифовальные машины', href: '/catalog/instrumenty' },
      { slug: 'ruchnyy', labelUk: 'Ручний інструмент', labelRu: 'Ручной инструмент', href: '/catalog/instrument-ruchnyy' },
      { slug: 'elektrynyy', labelUk: 'Електроінструмент', labelRu: 'Электроинструмент', href: '/catalog/instrument-elektrychnyy' },
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
    slug: 'osvitlennya-led',
    popular: [
      { slug: 'led-lampy', labelUk: 'LED-лампи', labelRu: 'LED-лампы', href: '/catalog/osvitlennya-led' },
      { slug: 'svitylnyky', labelUk: 'Світильники', labelRu: 'Светильники', href: '/catalog/osvitlennya-led' },
      { slug: 'proty', labelUk: 'Прожектори', labelRu: 'Прожекторы', href: '/catalog/osvitlennya-led' },
    ],
    promo: {
      titleUk: 'LED-освітлення',
      titleRu: 'LED-освещение',
      subtitleUk: 'Економте до 80% електроенергії з LED-рішеннями.',
      subtitleRu: 'Экономьте до 80% электроэнергии с LED-решениями.',
      ctaUk: 'Вибрати LED',
      ctaRu: 'Выбрать LED',
      href: '/catalog/osvitlennya-led',
    },
  },
  {
    slug: 'kabel-ta-provid',
    popular: [
      { slug: 'vvg', labelUk: 'Кабель ВВГ', labelRu: 'Кабель ВВГ', href: '/catalog/kabel-ta-provid' },
      { slug: 'nyy', labelUk: 'Провід NYY', labelRu: 'Провод NYY', href: '/catalog/kabel-ta-provid' },
      { slug: 'koaksialnyi', labelUk: 'Коаксіальний кабель', labelRu: 'Коаксиальный кабель', href: '/catalog/kabel-ta-provid' },
    ],
    promo: {
      titleUk: 'Кабельна продукція',
      titleRu: 'Кабельная продукция',
      subtitleUk: 'Широкий асортимент кабелів та проводів від провідних виробників.',
      subtitleRu: 'Широкий ассортимент кабелей и проводов от ведущих производителей.',
      ctaUk: 'До кабелів',
      ctaRu: 'К кабелям',
      href: '/catalog/kabel-ta-provid',
    },
  },
  {
    slug: 'rozetky-ta-vymykachi',
    popular: [
      { slug: 'rozetky-schuko', labelUk: 'Розетки Schuko', labelRu: 'Розетки Schuko', href: '/catalog/rozetky-ta-vymykachi' },
      { slug: 'vymykachi-odnoklavishni', labelUk: 'Вимикачі однокл.', labelRu: 'Выключатели одноклав.', href: '/catalog/rozetky-ta-vymykachi' },
    ],
    promo: {
      titleUk: 'Розетки та вимикачі',
      titleRu: 'Розетки и выключатели',
      subtitleUk: 'Legrand, Schneider, Werkel — вся лінійка в одному місці.',
      subtitleRu: 'Legrand, Schneider, Werkel — вся линейка в одном месте.',
      ctaUk: 'До розеток',
      ctaRu: 'К розеткам',
      href: '/catalog/rozetky-ta-vymykachi',
    },
  },
  {
    slug: 'avtomatyka',
    popular: [
      { slug: 'rele', labelUk: 'Реле проміжні', labelRu: 'Реле промежуточные', href: '/catalog/avtomatyka' },
      { slug: 'kontaktory', labelUk: 'Контактори', labelRu: 'Контакторы', href: '/catalog/kontaktory' },
      { slug: 'avr', labelUk: 'АВР / перемикачі', labelRu: 'АВР / переключатели', href: '/catalog/avtomatyka' },
    ],
    promo: {
      titleUk: 'Автоматика для надійного живлення',
      titleRu: 'Автоматика для надёжного питания',
      subtitleUk: 'Реле, контактори, АВР від провідних брендів.',
      subtitleRu: 'Реле, контакторы, АВР от ведущих брендов.',
      ctaUk: 'До автоматики',
      ctaRu: 'К автоматике',
      href: '/catalog/avtomatyka',
    },
  },
  {
    slug: 'rozumnyy-dim',
    popular: [
      { slug: 'smart-rozetky', labelUk: 'Розумні розетки', labelRu: 'Умные розетки', href: '/catalog/rozumnyy-dim' },
      { slug: 'smart-svitlo', labelUk: 'Розумне освітлення', labelRu: 'Умное освещение', href: '/catalog/rozumnyy-dim' },
    ],
    promo: {
      titleUk: 'Розумний дім',
      titleRu: 'Умный дом',
      subtitleUk: 'Автоматизуйте свій дім із сучасними рішеннями IoT.',
      subtitleRu: 'Автоматизируйте свой дом с современными IoT-решениями.',
      ctaUk: 'Розумний дім',
      ctaRu: 'Умный дом',
      href: '/catalog/rozumnyy-dim',
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
