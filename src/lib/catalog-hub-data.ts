/** Catalog Hub — data for sidebar tree, featured categories, project lists, warehouse chips, brands */

/** Subcategory in sidebar tree */
export interface SubCategory {
  slug: string
  name: { uk: string; ru: string }
  count: number
}

/** Extended sidebar category with optional subcategories */
export interface SidebarCategoryExpanded {
  id: string
  slug: string
  name: { uk: string; ru: string }
  icon: string
  count: number
  defaultOpen?: boolean
  subcategories?: SubCategory[]
}

/** Warehouse stock chip */
export interface WarehouseChip {
  city: { uk: string; ru: string }
  skuCount: number
}

/** Project list card */
export interface ProjectListItem {
  id: string
  name: string
  skuCount: number
  totalUah: number
  updatedLabel: { uk: string; ru: string }
  discount: string
}

/** Featured category card (2×2) */
export interface FeaturedCategory {
  slug: string
  icon: string
  name: { uk: string; ru: string }
  count: number
  subcategoryLinks: { slug: string; name: { uk: string; ru: string } }[]
}

// ─── Warehouse data ──────────────────────────────────────────────────────────

export const warehouseChips: WarehouseChip[] = [
  { city: { uk: 'Київ', ru: 'Киев' }, skuCount: 4200 },
  { city: { uk: 'Львів', ru: 'Львов' }, skuCount: 2100 },
  { city: { uk: 'Дніпро', ru: 'Днепр' }, skuCount: 1800 },
  { city: { uk: 'Одеса', ru: 'Одесса' }, skuCount: 950 },
]

// ─── Project lists (mock) ────────────────────────────────────────────────────

export const projectLists: ProjectListItem[] = [
  { id: 'pl1', name: "ЖК 'Сонячний' — 5 поверх", skuCount: 47, totalUah: 89600, updatedLabel: { uk: 'оновлено сьогодні', ru: 'обновлено сегодня' }, discount: '−12%' },
  { id: 'pl2', name: 'СТО на Бориспільській', skuCount: 23, totalUah: 34200, updatedLabel: { uk: 'оновлено вчора', ru: 'обновлено вчера' }, discount: '−12%' },
  { id: 'pl3', name: "Кафе 'Грузин' — реконструкція", skuCount: 31, totalUah: 52800, updatedLabel: { uk: 'оновлено 3 дні тому', ru: 'обновлено 3 дня назад' }, discount: '−12%' },
]

// ─── Featured categories (2×2 grid) ──────────────────────────────────────────

export const featuredCategories: FeaturedCategory[] = [
  {
    slug: 'led-osvitlennya', icon: 'lightbulb',
    name: { uk: 'Освітлення LED', ru: 'Освещение LED' }, count: 3200,
    subcategoryLinks: [
      { slug: 'led-paneli', name: { uk: 'LED-панелі', ru: 'LED-панели' } },
      { slug: 'liniyni-svitylnyky', name: { uk: 'Лінійні світильники', ru: 'Линейные светильники' } },
      { slug: 'prozhektory', name: { uk: 'Прожектори', ru: 'Прожекторы' } },
      { slug: 'lampy-e27', name: { uk: 'Лампи E27', ru: 'Лампы E27' } },
    ],
  },
  {
    slug: 'kabeli-droty', icon: 'cable',
    name: { uk: 'Кабель та провід', ru: 'Кабель и провод' }, count: 1850,
    subcategoryLinks: [
      { slug: 'vvgng-ls', name: { uk: 'ВВГнг-LS', ru: 'ВВГнг-LS' } },
      { slug: 'nym', name: { uk: 'NYM', ru: 'NYM' } },
      { slug: 'shvvp', name: { uk: 'ШВВП', ru: 'ШВВП' } },
      { slug: 'kabel-pvs', name: { uk: 'Кабель ПВС', ru: 'Кабель ПВС' } },
    ],
  },
  {
    slug: 'avtomatychni-vymykachi', icon: 'zap',
    name: { uk: 'Автоматичні вимикачі', ru: 'Автоматические выключатели' }, count: 1240,
    subcategoryLinks: [
      { slug: '1-polyusnyy', name: { uk: '1-полюсний', ru: '1-полюсный' } },
      { slug: '2-polyusnyy', name: { uk: '2-полюсний', ru: '2-полюсный' } },
      { slug: '3-polyusnyy', name: { uk: '3-полюсний', ru: '3-полюсный' } },
      { slug: '4-polyusnyy', name: { uk: '4-полюсний', ru: '4-полюсный' } },
    ],
  },
  {
    slug: 'elektroustanovochni-vyroby', icon: 'plug',
    name: { uk: 'Розетки та вимикачі', ru: 'Розетки и выключатели' }, count: 890,
    subcategoryLinks: [
      { slug: 'legrand-valena', name: { uk: 'Legrand Valena', ru: 'Legrand Valena' } },
      { slug: 'schneider-unica', name: { uk: 'Schneider Unica', ru: 'Schneider Unica' } },
      { slug: 'odynarni', name: { uk: 'Одинарні', ru: 'Одинарные' } },
      { slug: 'podviyni', name: { uk: 'Подвійні', ru: 'Двойные' } },
    ],
  },
]

// ─── Sidebar subcategories (expanded categories) ─────────────────────────────

export const sidebarSubcategories: Record<string, SubCategory[]> = {
  'avtomatychni-vymykachi': [
    { slug: '1-polyusni', name: { uk: '1-полюсні', ru: '1-полюсные' }, count: 320 },
    { slug: '2-polyusni', name: { uk: '2-полюсні', ru: '2-полюсные' }, count: 280 },
    { slug: '3-polyusni', name: { uk: '3-полюсні', ru: '3-полюсные' }, count: 410 },
    { slug: '4-polyusni', name: { uk: '4-полюсні', ru: '4-полюсные' }, count: 230 },
  ],
  'kabeli-droty': [
    { slug: 'vvgng-ls', name: { uk: 'ВВГнг-LS', ru: 'ВВГнг-LS' }, count: 640 },
    { slug: 'nym', name: { uk: 'NYM', ru: 'NYM' }, count: 380 },
    { slug: 'shvvp', name: { uk: 'ШВВП', ru: 'ШВВП' }, count: 290 },
    { slug: 'pvs', name: { uk: 'ПВС', ru: 'ПВС' }, count: 310 },
    { slug: 'inshi', name: { uk: 'Інші', ru: 'Другие' }, count: 230 },
  ],
  'led-osvitlennya': [
    { slug: 'led-paneli', name: { uk: 'LED-панелі', ru: 'LED-панели' }, count: 820 },
    { slug: 'liniyni-svitylnyky', name: { uk: 'Лінійні світильники', ru: 'Линейные светильники' }, count: 640 },
    { slug: 'prozhektory', name: { uk: 'Прожектори', ru: 'Прожекторы' }, count: 550 },
    { slug: 'lampy-e27', name: { uk: 'Лампи E27', ru: 'Лампы E27' }, count: 480 },
    { slug: 'strichky', name: { uk: 'Стрічки', ru: 'Ленты' }, count: 380 },
    { slug: 'inshe', name: { uk: 'Інше', ru: 'Другое' }, count: 330 },
  ],
}

// Default-expanded slugs
export const defaultExpandedSlugs = ['avtomatychni-vymykachi', 'kabeli-droty', 'led-osvitlennya']

// ─── Brand pills ─────────────────────────────────────────────────────────────

export const brandPills = [
  'Schneider Electric', 'ABB', 'Legrand', 'Bosch', 'Makita',
  'DeWALT', 'Hager', 'IEK', 'Eaton', 'Werkel',
]

// ─── AI prompt chips ─────────────────────────────────────────────────────────

export const aiPromptChips = [
  { uk: 'Двокімнатна квартира 65 м²', ru: 'Двухкомнатная квартира 65 м²' },
  { uk: 'Автосервіс 100 м²', ru: 'Автосервис 100 м²' },
  { uk: 'Кафе 80 м²', ru: 'Кафе 80 м²' },
  { uk: 'Гараж + двір', ru: 'Гараж + двор' },
  { uk: 'Офіс open-space', ru: 'Офис open-space' },
  { uk: 'Виробничий цех 200 м²', ru: 'Производственный цех 200 м²' },
]
