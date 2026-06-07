export type Locale = 'uk' | 'ru'

export interface Product {
  id: string
  slug: string
  name: Record<Locale, string>
  description: Record<Locale, string>
  price: number
  oldPrice?: number
  image: string
  category: string
  inStock: boolean
  rating?: number
  reviewsCount?: number
}

export interface Category {
  id: string
  slug: string
  name: Record<Locale, string>
  icon?: string
  image?: string
  productCount: number
  children?: Category[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface NavLink {
  label: Record<Locale, string>
  href: string
}

export interface ContactInfo {
  phone: string
  viber?: string
  email?: string
  address: Record<Locale, string>
  workingHours: Record<Locale, string>
}

// ─── Каталог (Rozetka-style) ────────────────────────────────────────────────

/** Оптова ціна (один рівень знижки) */
export interface QtyBreak {
  /** Мінімальна кількість для отримання цієї ціни */
  minQty: number
  /** Ціна за одиницю (₴) */
  unitPrice: number
}

/** Товар у каталозі — розширений тип з атрибутами для фільтрації */
export interface CatalogProduct {
  id: string
  slug: string
  brand: string
  name: Record<Locale, string>
  sku: string
  price: number
  comparePrice?: number
  stock: number
  categorySlug: string
  icon: string
  /** Оптові ціни (до 3-х рівнів) */
  qtyBreaks: QtyBreak[]
  rating?: number
  reviewsCount?: number
  /** Специфічні атрибути категорії: { poles: '2P', rating_a: '16' } */
  attributes: Record<string, string>
}

/** Тип фільтру */
export type FilterType = 'checkbox' | 'pill' | 'range'

/** Визначення одного фільтру для категорії */
export interface FilterDefinition {
  key: string
  type: FilterType
  label: Record<Locale, string>
  /** Доступні значення (для checkbox та pill) */
  options?: string[] | undefined
  /** Чи показувати пошукове поле (для довгих checkbox-списків) */
  searchable?: boolean | undefined
  /** Одиниця виміру: "А", "мм²", "₴" */
  unit?: string | undefined
}

/** Активні фільтри, зібрані з URL searchParams */
export interface ActiveFilters {
  brand?: string[] | undefined
  priceMin?: number | undefined
  priceMax?: number | undefined
  sort?: ('popular' | 'price-asc' | 'price-desc' | 'new' | 'rating') | undefined
  page?: number | undefined
  limit?: number | undefined
  inStock?: boolean | undefined
  /** Динамічні атрибути категорії */
  [key: string]: string[] | number | boolean | string | undefined
}

/** Хлібна крихта */
export interface BreadcrumbItem {
  name: string
  url?: string
}

// ─── AI-комплектатор (ТЗ §8.3) ─────────────────────────────────────────────

/** Один товар у згенерованому BOM */
export interface AIItem {
  sku: string
  brand: string
  title: string
  qty: number
  pricePerUnitUah: number
  totalUah: number
  inStockNearest: string
  notes?: string
}

/** Група товарів у BOM (щит, проводка, освітлення тощо) */
export interface AIGroup {
  title: string
  icon: string // lucide icon name
  items: AIItem[]
}

/** Повна відповідь AI-комплектатора */
export interface AIBomResponse {
  summary: {
    objectType: string
    estimatedTotalUah: number
    estimatedSavingsUah: number
    deliveryDays: number
  }
  groups: AIGroup[]
}

/** Запит до AI-комплектатора */
export interface AIConfiguratorRequest {
  text: string
  locale: Locale
  photoUrl?: string
}

/** Стан AI-комплектатора */
export type AIConfiguratorStatus = 'idle' | 'loading' | 'success' | 'error'

// ─── Фасети (Каталог) ────────────────────────────────────────────────────────

export interface FacetOption {
  value: string
  label: string
  count: number
  selected: boolean
  disabled: boolean
  logo?: string | null
}

export interface CategoryFacets {
  total: number
  price: {
    absoluteMin: number
    absoluteMax: number
    availableMin: number
    availableMax: number
    selectedMin?: number | undefined
    selectedMax?: number | undefined
    buckets: number[]
  }
  brands: FacetOption[]
  attributes: Record<string, FacetOption[]>
}

export interface BrandFacetItem {
  brand: string
  label?: string
  count: number
  disabled?: boolean
  selected?: boolean
  logo?: string | null
}

export interface AttributeFacetItem {
  value: string
  count: number
  disabled?: boolean
  selected?: boolean
}
