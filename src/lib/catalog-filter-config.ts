// src/lib/catalog-filter-config.ts
// Per-category filter order, labels, units, searchable groups (TZ §7.3 + §4.2)

export interface QuickLink {
  label: { uk: string; ru: string }
  /** filter key + value to encode in URL, OR explicit href */
  filter?: { key: string; value: string }
  href?: string
}

export interface FilterConfig {
  /** Ordered list of filter keys for this category */
  order: string[]
  /** Human-readable labels per key per locale */
  labels?: Record<string, { uk: string; ru: string }>
  /** Physical units displayed after values */
  units?: Record<string, string>
  /** Keys that should render a search input inside the filter group */
  searchable?: string[]
  /**
   * Quick landing links shown under H1 (SEO/UX scenario chips).
   * Each link either navigates to a filtered URL or a standalone landing page.
   */
  quickLinks?: QuickLink[]
}

/** Global fallback — applies to any category without a specific config */
export const defaultFilterConfig: FilterConfig = {
  order: ['brand', 'price', 'inStock'],
  searchable: ['brand'],
}

/** Per-category overrides */
export const categoryFilterConfig: Record<string, FilterConfig> = {
  'avtomatychni-vymykachi': {
    order: ['brand', 'price', 'inStock', 'poles', 'rated_current', 'curve', 'breaking_capacity'],
    labels: {
      poles:             { uk: 'Кількість полюсів',       ru: 'Кол-во полюсов' },
      rated_current:     { uk: 'Номінальний струм, А',    ru: 'Номинальный ток, А' },
      curve:             { uk: 'Характеристика відкл.',   ru: 'Характеристика откл.' },
      breaking_capacity: { uk: 'Відключна здатність, кА', ru: 'Откл. способность, кА' },
    },
    searchable: ['brand'],
    quickLinks: [
      { label: { uk: '1P автомати',         ru: '1P автоматы' },         filter: { key: 'poles', value: '1P' } },
      { label: { uk: '2P автомати',         ru: '2P автоматы' },         filter: { key: 'poles', value: '2P' } },
      { label: { uk: '3P автомати',         ru: '3P автоматы' },         filter: { key: 'poles', value: '3P' } },
      { label: { uk: 'C16',                 ru: 'C16' },                 filter: { key: 'rated_current', value: '16' } },
      { label: { uk: 'C25',                 ru: 'C25' },                 filter: { key: 'rated_current', value: '25' } },
      { label: { uk: 'ABB',                 ru: 'ABB' },                 filter: { key: 'brand', value: 'abb' } },
      { label: { uk: 'Schneider Electric',  ru: 'Schneider Electric' },  filter: { key: 'brand', value: 'schneider-electric' } },
      { label: { uk: 'Legrand',             ru: 'Legrand' },             filter: { key: 'brand', value: 'legrand' } },
      { label: { uk: 'Hager',              ru: 'Hager' },               filter: { key: 'brand', value: 'hager' } },
    ],
  },

  'rozetky-ta-vymykachi': {
    order: ['brand', 'price', 'inStock', 'type', 'series', 'color'],
    labels: {
      type:   { uk: 'Тип',   ru: 'Тип' },
      series: { uk: 'Серія', ru: 'Серия' },
      color:  { uk: 'Колір', ru: 'Цвет' },
    },
    searchable: ['brand', 'series'],
    quickLinks: [
      { label: { uk: 'Розетки',       ru: 'Розетки' },       filter: { key: 'type', value: 'Розетка' } },
      { label: { uk: 'Вимикачі',      ru: 'Выключатели' },   filter: { key: 'type', value: 'Вимикач' } },
      { label: { uk: 'Valena Life',   ru: 'Valena Life' },   filter: { key: 'series', value: 'Valena Life' } },
      { label: { uk: 'Asfora',        ru: 'Asfora' },        filter: { key: 'series', value: 'Asfora' } },
      { label: { uk: 'Legrand',       ru: 'Legrand' },       filter: { key: 'brand', value: 'legrand' } },
      { label: { uk: 'Schneider',     ru: 'Schneider' },     filter: { key: 'brand', value: 'schneider' } },
      { label: { uk: 'Білий колір',   ru: 'Белый цвет' },   filter: { key: 'color', value: 'Білий' } },
    ],
  },

  'kabel-ta-provid': {
    order: ['brand', 'price', 'inStock', 'cable_type', 'cores', 'section'],
    labels: {
      cable_type: { uk: 'Тип кабелю',    ru: 'Тип кабеля' },
      cores:      { uk: 'Кількість жил', ru: 'Кол-во жил' },
      section:    { uk: 'Переріз',       ru: 'Сечение' },
    },
    units: {
      section: 'мм²',
    },
    searchable: ['brand'],
    quickLinks: [
      { label: { uk: 'ВВГнг',     ru: 'ВВГнг' },     filter: { key: 'cable_type', value: 'ВВГнг' } },
      { label: { uk: 'ВВГнг-LS',  ru: 'ВВГнг-LS' },  filter: { key: 'cable_type', value: 'ВВГнг-LS' } },
      { label: { uk: 'ПВС',       ru: 'ПВС' },       filter: { key: 'cable_type', value: 'ПВС' } },
      { label: { uk: '1.5 мм²',   ru: '1.5 мм²' },  filter: { key: 'section', value: '1.5' } },
      { label: { uk: '2.5 мм²',   ru: '2.5 мм²' },  filter: { key: 'section', value: '2.5' } },
      { label: { uk: '3 жили',    ru: '3 жилы' },    filter: { key: 'cores', value: '3' } },
    ],
  },

  'motornye-masla': {
    order: ['brand', 'price', 'inStock', 'viscosity', 'volume', 'type', 'api', 'acea'],
    labels: {
      viscosity: { uk: "В'язкість",   ru: 'Вязкость' },
      volume:    { uk: "Об'єм",       ru: 'Объём' },
      type:      { uk: 'Тип',         ru: 'Тип' },
      api:       { uk: 'API',         ru: 'API' },
      acea:      { uk: 'ACEA',        ru: 'ACEA' },
    },
    units: {
      volume: 'л',
    },
    searchable: ['brand'],
    quickLinks: [
      { label: { uk: '5W-30',        ru: '5W-30' },        filter: { key: 'viscosity', value: '5W-30' } },
      { label: { uk: '5W-40',        ru: '5W-40' },        filter: { key: 'viscosity', value: '5W-40' } },
      { label: { uk: 'Castrol',      ru: 'Castrol' },      filter: { key: 'brand', value: 'castrol' } },
      { label: { uk: 'Shell',        ru: 'Shell' },        filter: { key: 'brand', value: 'shell' } },
      { label: { uk: 'Mobil',        ru: 'Mobil' },        filter: { key: 'brand', value: 'mobil' } },
      { label: { uk: 'Синтетичні',   ru: 'Синтетика' },    filter: { key: 'type', value: 'synthetic' } },
      { label: { uk: 'Для дизеля',   ru: 'Для дизеля' },  filter: { key: 'type', value: 'diesel' } },
      { label: { uk: '4 л',          ru: '4 л' },          filter: { key: 'volume', value: '4L' } },
    ],
  },

  'akumulyatory': {
    order: ['brand', 'price', 'inStock', 'voltage', 'capacity', 'technology', 'terminal_type'],
    labels: {
      voltage:       { uk: 'Напруга',       ru: 'Напряжение' },
      capacity:      { uk: 'Ємність',       ru: 'Ёмкость' },
      technology:    { uk: 'Технологія',    ru: 'Технология' },
      terminal_type: { uk: 'Тип клем',      ru: 'Тип клемм' },
    },
    units: {
      voltage:  'В',
      capacity: 'Аг',
    },
    searchable: ['brand'],
    quickLinks: [
      { label: { uk: '12V',       ru: '12V' },       filter: { key: 'voltage', value: '12' } },
      { label: { uk: 'LiFePO4',   ru: 'LiFePO4' },   filter: { key: 'technology', value: 'LiFePO4' } },
      { label: { uk: 'AGM',       ru: 'AGM' },       filter: { key: 'technology', value: 'AGM' } },
      { label: { uk: '100Аг',     ru: '100Ач' },     filter: { key: 'capacity', value: '100' } },
      { label: { uk: '200Аг',     ru: '200Ач' },     filter: { key: 'capacity', value: '200' } },
      { label: { uk: 'Для ДБЖ',   ru: 'Для ИБП' },  filter: { key: 'application', value: 'ups' } },
      { label: { uk: 'Trinix',    ru: 'Trinix' },    filter: { key: 'brand', value: 'trinix' } },
    ],
  },

  'osvitlennya-led': {
    order: ['brand', 'price', 'inStock', 'led_type', 'wattage', 'color_temp'],
    labels: {
      led_type:   { uk: 'Тип',          ru: 'Тип' },
      wattage:    { uk: 'Потужність',    ru: 'Мощность' },
      color_temp: { uk: 'Колірна температура', ru: 'Цветовая температура' },
    },
    units: {
      wattage:    'Вт',
      color_temp: 'К',
    },
    searchable: ['brand'],
    quickLinks: [
      { label: { uk: 'Панелі',    ru: 'Панели' },    filter: { key: 'led_type', value: 'Панель' } },
      { label: { uk: 'Лампи',     ru: 'Лампы' },     filter: { key: 'led_type', value: 'Лампа' } },
      { label: { uk: 'Стрічка',   ru: 'Лента' },     filter: { key: 'led_type', value: 'Стрічка' } },
      { label: { uk: 'Philips',   ru: 'Philips' },   filter: { key: 'brand', value: 'philips' } },
      { label: { uk: 'Osram',     ru: 'Osram' },     filter: { key: 'brand', value: 'osram' } },
      { label: { uk: '4000К нейтральний', ru: '4000К нейтральный' }, filter: { key: 'color_temp', value: '4000' } },
    ],
  },
}

/** Get config for a category slug, falling back to default */
export function getCategoryFilterConfig(slug: string): FilterConfig {
  return categoryFilterConfig[slug] ?? defaultFilterConfig
}
