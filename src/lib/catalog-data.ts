import type { CatalogProduct, FilterDefinition } from '@/types'

// ─── Filter definitions per category ─────────────────────────────────────────

export const categoryFilters: Record<string, FilterDefinition[]> = {
  'avtomatychni-vymykachi': [
    { key: 'brand', type: 'checkbox', label: { uk: 'Бренд', ru: 'Бренд' }, searchable: true },
    { key: 'poles', type: 'pill', label: { uk: 'Кількість полюсів', ru: 'Кол-во полюсов' }, options: ['1P', '2P', '3P', '3P+N', '4P'] },
    { key: 'rated_current', type: 'pill', label: { uk: 'Номінальний струм, А', ru: 'Номинальный ток, А' }, options: ['6', '10', '16', '20', '25', '32', '40', '50', '63'] },
    { key: 'breaking_capacity', type: 'pill', label: { uk: 'Відключна здатність, кА', ru: 'Откл. способность, кА' }, options: ['4.5', '6', '10', '15', '25'] },
    { key: 'curve', type: 'pill', label: { uk: 'Характеристика', ru: 'Характеристика' }, options: ['B', 'C', 'D'] },
    { key: 'price', type: 'range', label: { uk: 'Ціна, ₴', ru: 'Цена, ₴' } },
  ],
  'elektroustanovochni-vyroby': [
    { key: 'brand', type: 'checkbox', label: { uk: 'Бренд', ru: 'Бренд' }, searchable: true },
    { key: 'type', type: 'checkbox', label: { uk: 'Тип', ru: 'Тип' }, options: ['Розетка', 'Вимикач', 'Рамка', 'Діммер'] },
    { key: 'series', type: 'checkbox', label: { uk: 'Серія', ru: 'Серия' }, searchable: true, options: ['Valena Life', 'Asfora', 'Unica', 'Sedna', 'Atlas Design'] },
    { key: 'color', type: 'pill', label: { uk: 'Колір', ru: 'Цвет' }, options: ['Білий', 'Кремовий', 'Сірий', 'Чорний', 'Антрацит'] },
    { key: 'price', type: 'range', label: { uk: 'Ціна, ₴', ru: 'Цена, ₴' } },
  ],
  'kabeli-droty': [
    { key: 'brand', type: 'checkbox', label: { uk: 'Бренд', ru: 'Бренд' }, searchable: true },
    { key: 'cable_type', type: 'checkbox', label: { uk: 'Тип кабелю', ru: 'Тип кабеля' }, options: ['ВВГнг', 'ВВГнг-LS', 'NYM', 'ПВС', 'ШВВП', 'СІП'] },
    { key: 'cores', type: 'pill', label: { uk: 'Кількість жил', ru: 'Кол-во жил' }, options: ['1', '2', '3', '4', '5'] },
    { key: 'section', type: 'pill', label: { uk: 'Переріз, мм²', ru: 'Сечение, мм²' }, options: ['0.75', '1', '1.5', '2.5', '4', '6', '10', '16'] },
    { key: 'price', type: 'range', label: { uk: 'Ціна, ₴', ru: 'Цена, ₴' } },
  ],
  'led-osvitlennya': [
    { key: 'brand', type: 'checkbox', label: { uk: 'Бренд', ru: 'Бренд' }, searchable: true },
    { key: 'led_type', type: 'checkbox', label: { uk: 'Тип', ru: 'Тип' }, options: ['Панель', 'Лампа', 'Світильник', 'Стрічка', 'Прожектор'] },
    { key: 'wattage', type: 'pill', label: { uk: 'Потужність, Вт', ru: 'Мощность, Вт' }, options: ['5', '7', '9', '12', '18', '24', '36', '40'] },
    { key: 'color_temp', type: 'pill', label: { uk: 'Температура, К', ru: 'Температура, К' }, options: ['3000', '4000', '5000', '6500'] },
    { key: 'price', type: 'range', label: { uk: 'Ціна, ₴', ru: 'Цена, ₴' } },
  ],
}

// Default filters for categories without specific definitions
export const defaultCategoryFilters: FilterDefinition[] = [
  { key: 'brand', type: 'checkbox', label: { uk: 'Бренд', ru: 'Бренд' }, searchable: true },
  { key: 'price', type: 'range', label: { uk: 'Ціна, ₴', ru: 'Цена, ₴' } },
]

// ─── Mock catalog products ───────────────────────────────────────────────────

export const catalogProducts: CatalogProduct[] = [
  // Автоматичні вимикачі
  { id: 'c1', slug: 'abb-sh201-c16', brand: 'ABB', name: { uk: 'Автоматичний вимикач ABB SH201-C16 1P 16A 6kA', ru: 'Автоматический выключатель ABB SH201-C16 1P 16A 6kA' }, sku: '2CDS211001R0164', price: 245, stock: 150, categorySlug: 'avtomatychni-vymykachi', icon: 'zap', qtyBreaks: [{ minQty: 10, unitPrice: 230.30 }, { minQty: 50, unitPrice: 220.50 }, { minQty: 200, unitPrice: 208.25 }], rating: 4.8, reviewsCount: 225, attributes: { poles: '1P', rated_current: '16', breaking_capacity: '6', curve: 'C' } },
  { id: 'c2', slug: 'abb-sh202-c16', brand: 'ABB', name: { uk: 'Автоматичний вимикач ABB SH202-C16 2P 16A 6kA', ru: 'Автоматический выключатель ABB SH202-C16 2P 16A 6kA' }, sku: '2CDS212001R0164', price: 412, stock: 98, categorySlug: 'avtomatychni-vymykachi', icon: 'zap', qtyBreaks: [{ minQty: 10, unitPrice: 387.28 }, { minQty: 50, unitPrice: 370.80 }, { minQty: 200, unitPrice: 350.20 }], rating: 4.9, reviewsCount: 318, attributes: { poles: '2P', rated_current: '16', breaking_capacity: '6', curve: 'C' } },
  { id: 'c3', slug: 'abb-sh201-c10', brand: 'ABB', name: { uk: 'Автоматичний вимикач ABB SH201-C10 1P 10A 6kA', ru: 'Автоматический выключатель ABB SH201-C10 1P 10A 6kA' }, sku: '2CDS211001R0104', price: 238, stock: 200, categorySlug: 'avtomatychni-vymykachi', icon: 'zap', qtyBreaks: [{ minQty: 10, unitPrice: 223.72 }, { minQty: 50, unitPrice: 214.20 }, { minQty: 200, unitPrice: 202.30 }], rating: 4.7, reviewsCount: 156, attributes: { poles: '1P', rated_current: '10', breaking_capacity: '6', curve: 'C' } },
  { id: 'c4', slug: 'abb-sh201-c25', brand: 'ABB', name: { uk: 'Автоматичний вимикач ABB SH201-C25 1P 25A 6kA', ru: 'Автоматический выключатель ABB SH201-C25 1P 25A 6kA' }, sku: '2CDS211001R0254', price: 252, stock: 120, categorySlug: 'avtomatychni-vymykachi', icon: 'zap', qtyBreaks: [{ minQty: 10, unitPrice: 236.88 }, { minQty: 50, unitPrice: 226.80 }, { minQty: 200, unitPrice: 214.20 }], rating: 4.6, reviewsCount: 89, attributes: { poles: '1P', rated_current: '25', breaking_capacity: '6', curve: 'C' } },
  { id: 'c5', slug: 'schneider-easy9-c16-1p', brand: 'SCHNEIDER', name: { uk: 'Автоматичний вимикач Schneider Easy9 C16 1P 16A 4.5kA', ru: 'Автоматический выключатель Schneider Easy9 C16 1P 16A 4.5kA' }, sku: 'EZ9F34116', price: 145, stock: 300, categorySlug: 'avtomatychni-vymykachi', icon: 'zap', qtyBreaks: [{ minQty: 20, unitPrice: 133.40 }, { minQty: 50, unitPrice: 127.60 }, { minQty: 200, unitPrice: 120.35 }], rating: 4.5, reviewsCount: 412, attributes: { poles: '1P', rated_current: '16', breaking_capacity: '4.5', curve: 'C' } },
  { id: 'c6', slug: 'schneider-easy9-c25-2p', brand: 'SCHNEIDER', name: { uk: 'Автоматичний вимикач Schneider Easy9 C25 2P 25A 4.5kA', ru: 'Автоматический выключатель Schneider Easy9 C25 2P 25A 4.5kA' }, sku: 'EZ9F34225', price: 298, stock: 180, categorySlug: 'avtomatychni-vymykachi', icon: 'zap', qtyBreaks: [{ minQty: 10, unitPrice: 274.16 }, { minQty: 50, unitPrice: 262.24 }, { minQty: 200, unitPrice: 247.34 }], rating: 4.4, reviewsCount: 203, attributes: { poles: '2P', rated_current: '25', breaking_capacity: '4.5', curve: 'C' } },
  { id: 'c7', slug: 'legrand-tx3-c16-1p', brand: 'LEGRAND', name: { uk: 'Автоматичний вимикач Legrand TX³ C16 1P 16A 6kA', ru: 'Автоматический выключатель Legrand TX³ C16 1P 16A 6kA' }, sku: '404028', price: 195, stock: 250, categorySlug: 'avtomatychni-vymykachi', icon: 'zap', qtyBreaks: [{ minQty: 10, unitPrice: 181.35 }, { minQty: 50, unitPrice: 172.55 }, { minQty: 200, unitPrice: 163.80 }], rating: 4.6, reviewsCount: 178, attributes: { poles: '1P', rated_current: '16', breaking_capacity: '6', curve: 'C' } },
  { id: 'c8', slug: 'legrand-tx3-c32-3p', brand: 'LEGRAND', name: { uk: 'Автоматичний вимикач Legrand TX³ C32 3P 32A 6kA', ru: 'Автоматический выключатель Legrand TX³ C32 3P 32A 6kA' }, sku: '404058', price: 780, stock: 45, categorySlug: 'avtomatychni-vymykachi', icon: 'zap', qtyBreaks: [{ minQty: 5, unitPrice: 741 }, { minQty: 20, unitPrice: 702 }, { minQty: 100, unitPrice: 663 }], rating: 4.8, reviewsCount: 67, attributes: { poles: '3P', rated_current: '32', breaking_capacity: '6', curve: 'C' } },
  { id: 'c9', slug: 'hager-mbn116', brand: 'HAGER', name: { uk: 'Автоматичний вимикач Hager MBN116 1P 16A 6kA B', ru: 'Автоматический выключатель Hager MBN116 1P 16A 6kA B' }, sku: 'MBN116', price: 210, stock: 95, categorySlug: 'avtomatychni-vymykachi', icon: 'zap', qtyBreaks: [{ minQty: 10, unitPrice: 199.50 }, { minQty: 50, unitPrice: 189 }, { minQty: 200, unitPrice: 178.50 }], rating: 4.7, reviewsCount: 92, attributes: { poles: '1P', rated_current: '16', breaking_capacity: '6', curve: 'B' } },
  { id: 'c10', slug: 'eaton-pl6-c16-2p', brand: 'EATON', name: { uk: 'Автоматичний вимикач Eaton PL6-C16/2 2P 16A 6kA', ru: 'Автоматический выключатель Eaton PL6-C16/2 2P 16A 6kA' }, sku: '286567', price: 380, stock: 60, categorySlug: 'avtomatychni-vymykachi', icon: 'zap', qtyBreaks: [{ minQty: 10, unitPrice: 357.20 }, { minQty: 50, unitPrice: 342 }, { minQty: 200, unitPrice: 323 }], rating: 4.5, reviewsCount: 134, attributes: { poles: '2P', rated_current: '16', breaking_capacity: '6', curve: 'C' } },
  { id: 'c11', slug: 'iek-ba47-29-c16-1p', brand: 'IEK', name: { uk: 'Автоматичний вимикач IEK ВА47-29 C16 1P 16A 4.5kA', ru: 'Автоматический выключатель IEK ВА47-29 C16 1P 16A 4.5kA' }, sku: 'MVA20-1-016-C', price: 68, stock: 500, categorySlug: 'avtomatychni-vymykachi', icon: 'zap', qtyBreaks: [{ minQty: 30, unitPrice: 64.60 }, { minQty: 100, unitPrice: 59.84 }, { minQty: 500, unitPrice: 54.40 }], rating: 4.0, reviewsCount: 567, attributes: { poles: '1P', rated_current: '16', breaking_capacity: '4.5', curve: 'C' } },
  { id: 'c12', slug: 'iek-ba47-29-c25-3p', brand: 'IEK', name: { uk: 'Автоматичний вимикач IEK ВА47-29 C25 3P 25A 4.5kA', ru: 'Автоматический выключатель IEK ВА47-29 C25 3P 25A 4.5kA' }, sku: 'MVA20-3-025-C', price: 185, stock: 320, categorySlug: 'avtomatychni-vymykachi', icon: 'zap', qtyBreaks: [{ minQty: 20, unitPrice: 170.20 }, { minQty: 50, unitPrice: 162.80 }, { minQty: 200, unitPrice: 148 }], rating: 4.1, reviewsCount: 234, attributes: { poles: '3P', rated_current: '25', breaking_capacity: '4.5', curve: 'C' } },
  // Кабель
  { id: 'c13', slug: 'vvgng-ls-3x2-5', brand: 'ОДЕСКАБЕЛЬ', name: { uk: 'Кабель ВВГнг-LS 3×2.5 мм² (100м)', ru: 'Кабель ВВГнг-LS 3×2.5 мм² (100м)' }, sku: 'ODS-VVG-325-100', price: 3240, stock: 80, categorySlug: 'kabeli-droty', icon: 'cable', qtyBreaks: [{ minQty: 5, unitPrice: 2980.80 }, { minQty: 20, unitPrice: 2851.20 }, { minQty: 100, unitPrice: 2721.60 }], rating: 4.6, reviewsCount: 89, attributes: { cable_type: 'ВВГнг-LS', cores: '3', section: '2.5' } },
  { id: 'c14', slug: 'vvgng-3x1-5', brand: 'ОДЕСКАБЕЛЬ', name: { uk: 'Кабель ВВГнг 3×1.5 мм² (100м)', ru: 'Кабель ВВГнг 3×1.5 мм² (100м)' }, sku: 'ODS-VVG-315-100', price: 2180, stock: 120, categorySlug: 'kabeli-droty', icon: 'cable', qtyBreaks: [{ minQty: 5, unitPrice: 2005.60 }, { minQty: 20, unitPrice: 1919.50 }, { minQty: 100, unitPrice: 1831.20 }], rating: 4.5, reviewsCount: 67, attributes: { cable_type: 'ВВГнг', cores: '3', section: '1.5' } },
  { id: 'c15', slug: 'pvs-3x1-5', brand: 'ОДЕСКАБЕЛЬ', name: { uk: 'Провід ПВС 3×1.5 мм² (100м)', ru: 'Провод ПВС 3×1.5 мм² (100м)' }, sku: 'ODS-PVS-315', price: 1850, stock: 200, categorySlug: 'kabeli-droty', icon: 'cable', qtyBreaks: [{ minQty: 10, unitPrice: 1665 }, { minQty: 50, unitPrice: 1572.50 }, { minQty: 200, unitPrice: 1480 }], rating: 4.4, reviewsCount: 45, attributes: { cable_type: 'ПВС', cores: '3', section: '1.5' } },
  // Розетки
  { id: 'c16', slug: 'legrand-valena-life-white', brand: 'LEGRAND', name: { uk: 'Розетка Legrand Valena Life біла з/з', ru: 'Розетка Legrand Valena Life белая с/з' }, sku: '752820', price: 186, stock: 400, categorySlug: 'elektroustanovochni-vyroby', icon: 'plug', qtyBreaks: [{ minQty: 20, unitPrice: 163.68 }, { minQty: 50, unitPrice: 155.82 }, { minQty: 200, unitPrice: 148.80 }], rating: 4.7, reviewsCount: 312, attributes: { type: 'Розетка', series: 'Valena Life', color: 'Білий' } },
  { id: 'c17', slug: 'schneider-asfora-white-switch', brand: 'SCHNEIDER', name: { uk: 'Вимикач Schneider Asfora 1-кл. білий', ru: 'Выключатель Schneider Asfora 1-кл. белый' }, sku: 'EPH0100121', price: 95, stock: 350, categorySlug: 'elektroustanovochni-vyroby', icon: 'plug', qtyBreaks: [{ minQty: 20, unitPrice: 85.50 }, { minQty: 50, unitPrice: 80.75 }, { minQty: 200, unitPrice: 76 }], rating: 4.3, reviewsCount: 189, attributes: { type: 'Вимикач', series: 'Asfora', color: 'Білий' } },
  { id: 'c18', slug: 'legrand-valena-life-frame-2', brand: 'LEGRAND', name: { uk: 'Рамка 2-місна Legrand Valena Life біла', ru: 'Рамка 2-местная Legrand Valena Life белая' }, sku: '754002', price: 78, stock: 280, categorySlug: 'elektroustanovochni-vyroby', icon: 'plug', qtyBreaks: [{ minQty: 20, unitPrice: 66.30 }, { minQty: 50, unitPrice: 62.40 }, { minQty: 200, unitPrice: 58.50 }], rating: 4.8, reviewsCount: 245, attributes: { type: 'Рамка', series: 'Valena Life', color: 'Білий' } },
  // LED
  { id: 'c19', slug: 'philips-led-panel-40w', brand: 'PHILIPS', name: { uk: 'LED-панель Philips 40W 6500K 600×600', ru: 'LED-панель Philips 40W 6500K 600×600' }, sku: 'PHL-LP40-65K', price: 1280, stock: 90, categorySlug: 'led-osvitlennya', icon: 'lightbulb', qtyBreaks: [{ minQty: 10, unitPrice: 1152 }, { minQty: 50, unitPrice: 1088 }, { minQty: 200, unitPrice: 1024 }], rating: 4.6, reviewsCount: 178, attributes: { led_type: 'Панель', wattage: '40', color_temp: '6500' } },
  { id: 'c20', slug: 'osram-led-bulb-12w', brand: 'OSRAM', name: { uk: 'Лампа LED Osram 12W E27 4000K', ru: 'Лампа LED Osram 12W E27 4000K' }, sku: 'OSR-LED12-4K', price: 89, stock: 600, categorySlug: 'led-osvitlennya', icon: 'lightbulb', qtyBreaks: [{ minQty: 30, unitPrice: 80.10 }, { minQty: 100, unitPrice: 75.65 }, { minQty: 500, unitPrice: 71.20 }], rating: 4.4, reviewsCount: 432, attributes: { led_type: 'Лампа', wattage: '12', color_temp: '4000' } },
  { id: 'c21', slug: 'iek-dpo-2001-18w', brand: 'IEK', name: { uk: 'Світильник LED IEK ДПО 2001 18W IP54', ru: 'Светильник LED IEK ДПО 2001 18W IP54' }, sku: 'LDPO0-2001', price: 412, stock: 150, categorySlug: 'led-osvitlennya', icon: 'lightbulb', qtyBreaks: [{ minQty: 10, unitPrice: 378.32 }, { minQty: 50, unitPrice: 354.32 }, { minQty: 200, unitPrice: 329.60 }], rating: 4.2, reviewsCount: 98, attributes: { led_type: 'Світильник', wattage: '18', color_temp: '6500' } },
  { id: 'c22', slug: 'philips-led-strip-5m', brand: 'PHILIPS', name: { uk: 'Стрічка LED Philips 5м 3000K 14.4W/м', ru: 'Лента LED Philips 5м 3000K 14.4W/м' }, sku: 'PHL-STRIP-5M', price: 680, stock: 75, categorySlug: 'led-osvitlennya', icon: 'lightbulb', qtyBreaks: [{ minQty: 10, unitPrice: 625.60 }, { minQty: 50, unitPrice: 578 }, { minQty: 200, unitPrice: 544 }], rating: 4.5, reviewsCount: 56, attributes: { led_type: 'Стрічка', wattage: '72', color_temp: '3000' } },
  { id: 'c23', slug: 'schneider-easy9-c32-1p', brand: 'SCHNEIDER', name: { uk: 'Автоматичний вимикач Schneider Easy9 C32 1P 32A 4.5kA', ru: 'Автоматический выключатель Schneider Easy9 C32 1P 32A 4.5kA' }, sku: 'EZ9F34132', price: 155, stock: 220, categorySlug: 'avtomatychni-vymykachi', icon: 'zap', qtyBreaks: [{ minQty: 20, unitPrice: 142.60 }, { minQty: 50, unitPrice: 136.40 }, { minQty: 200, unitPrice: 128.65 }], rating: 4.3, reviewsCount: 167, attributes: { poles: '1P', rated_current: '32', breaking_capacity: '4.5', curve: 'C' } },
  { id: 'c24', slug: 'abb-sh203-c25', brand: 'ABB', name: { uk: 'Автоматичний вимикач ABB SH203-C25 3P 25A 6kA', ru: 'Автоматический выключатель ABB SH203-C25 3P 25A 6kA' }, sku: '2CDS213001R0254', price: 890, stock: 35, categorySlug: 'avtomatychni-vymykachi', icon: 'zap', qtyBreaks: [{ minQty: 5, unitPrice: 845.50 }, { minQty: 20, unitPrice: 801 }, { minQty: 100, unitPrice: 756.50 }], rating: 4.9, reviewsCount: 78, attributes: { poles: '3P', rated_current: '25', breaking_capacity: '6', curve: 'C' } },
]

/** Get unique brands from products for a given category */
export function getBrandsForCategory(categorySlug: string): { brand: string; count: number }[] {
  const products = catalogProducts.filter(p => p.categorySlug === categorySlug)
  const brandMap = new Map<string, number>()
  for (const p of products) {
    brandMap.set(p.brand, (brandMap.get(p.brand) ?? 0) + 1)
  }
  return Array.from(brandMap.entries())
    .map(([brand, count]) => ({ brand, count }))
    .sort((a, b) => b.count - a.count)
}

/** Get price range for a category */
export function getPriceRange(categorySlug: string): { min: number; max: number } {
  const products = catalogProducts.filter(p => p.categorySlug === categorySlug)
  if (products.length === 0) return { min: 0, max: 10000 }
  const prices = products.map(p => p.price)
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

/** Get attribute value counts for a specific filter key */
export function getAttributeCounts(categorySlug: string, attrKey: string): { value: string; count: number }[] {
  const products = catalogProducts.filter(p => p.categorySlug === categorySlug)
  const valueMap = new Map<string, number>()
  for (const p of products) {
    const val = p.attributes[attrKey]
    if (val) {
      valueMap.set(val, (valueMap.get(val) ?? 0) + 1)
    }
  }
  return Array.from(valueMap.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
}
