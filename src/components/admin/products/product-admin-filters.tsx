import { Search, RotateCcw } from 'lucide-react'
import type { AdminCategoryItem, AdminBrandItem } from '@/actions/admin'
import { useTranslations } from 'next-intl'

interface ProductAdminFiltersProps {
  categories: AdminCategoryItem[]
  brands: AdminBrandItem[]
  filters: {
    search?: string
    categoryId?: string
    brandId?: string
    status?: string
    stock?: string
    quality?: string
    featured?: string
    sort?: string
  }
  onFilterChange: (filters: Partial<ProductAdminFiltersProps['filters']>) => void
  onReset: () => void
  locale: string
}

export function ProductAdminFilters({
  categories,
  brands,
  filters,
  onFilterChange,
  onReset,
  locale,
}: ProductAdminFiltersProps) {
  const t = useTranslations('admin.productsTab.filters')

  const hasActiveFilters =
    !!filters.search ||
    (filters.categoryId && filters.categoryId !== 'all') ||
    (filters.brandId && filters.brandId !== 'all') ||
    (filters.status && filters.status !== 'all') ||
    (filters.stock && filters.stock !== 'all') ||
    (filters.quality && filters.quality !== 'all') ||
    (filters.featured && filters.featured !== 'all')

  return (
    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 mb-6 flex flex-col gap-4">
      {/* Top filter row: search, category, brand, sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder={t('searchPlaceholder')}
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 outline-none text-xs focus:border-accent bg-white focus:ring-1 focus:ring-accent transition-all font-semibold"
          />
        </div>

        {/* Category select */}
        <select
          value={filters.categoryId || 'all'}
          onChange={(e) => onFilterChange({ categoryId: e.target.value })}
          className="h-9 px-3 rounded-xl border border-slate-200 bg-white outline-none text-xs font-bold text-slate-700 focus:border-accent"
        >
          <option value="all">{t('allCategories')}</option>
          {categories.map((cat) => {
            const trans = cat.translations?.find((t) => t.locale === locale)
            return (
              <option key={cat.id} value={cat.id}>
                {trans?.name ?? cat.slug}
              </option>
            )
          })}
        </select>

        {/* Brand select */}
        <select
          value={filters.brandId || 'all'}
          onChange={(e) => onFilterChange({ brandId: e.target.value })}
          className="h-9 px-3 rounded-xl border border-slate-200 bg-white outline-none text-xs font-bold text-slate-700 focus:border-accent"
        >
          <option value="all">{t('allBrands')}</option>
          <option value="none">{t('noBrand')}</option>
          {brands.map((br) => (
            <option key={br.id} value={br.id}>
              {br.name}
            </option>
          ))}
        </select>

        {/* Sort option */}
        <select
          value={filters.sort || 'createdAt_desc'}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
          className="h-9 px-3 rounded-xl border border-slate-200 bg-white outline-none text-xs font-bold text-slate-700 focus:border-accent"
        >
          <option value="createdAt_desc">{t('sortNewest')}</option>
          <option value="createdAt_asc">{t('sortOldest')}</option>
          <option value="updatedAt_desc">{t('sortUpdatedDesc')}</option>
          <option value="updatedAt_asc">{t('sortUpdatedAsc')}</option>
          <option value="price_desc">{t('sortPriceDesc')}</option>
          <option value="price_asc">{t('sortPriceAsc')}</option>
          <option value="stock_desc">{t('sortStockDesc')}</option>
          <option value="stock_asc">{t('sortStockAsc')}</option>
          <option value="name_asc">{t('sortNameAsc')}</option>
          <option value="name_desc">{t('sortNameDesc')}</option>
        </select>
      </div>

      {/* Bottom filter row: status, stock, quality, featured, and reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/50">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status select */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-extrabold uppercase text-slate-400">
              {t('statusLabel')}
            </span>
            <select
              value={filters.status || 'all'}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white outline-none text-xs font-bold text-slate-700"
            >
              <option value="all">{t('allStatuses')}</option>
              <option value="active">{t('statusActive')}</option>
              <option value="hidden">{t('statusHidden')}</option>
            </select>
          </div>

          {/* Stock select */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-extrabold uppercase text-slate-400">
              {t('stockLabel')}
            </span>
            <select
              value={filters.stock || 'all'}
              onChange={(e) => onFilterChange({ stock: e.target.value })}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white outline-none text-xs font-bold text-slate-700"
            >
              <option value="all">{t('allProducts')}</option>
              <option value="inStock">{t('stockIn')}</option>
              <option value="outOfStock">{t('stockOut')}</option>
            </select>
          </div>

          {/* Quality select */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-extrabold uppercase text-slate-400">
              {t('qualityLabel')}
            </span>
            <select
              value={filters.quality || 'all'}
              onChange={(e) => onFilterChange({ quality: e.target.value })}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white outline-none text-xs font-bold text-slate-700"
            >
              <option value="all">{t('allProducts')}</option>
              <option value="no-photo">{t('qualityNoPhoto')}</option>
              <option value="no-price">{t('qualityNoPrice')}</option>
              <option value="no-brand">{t('qualityNoBrand')}</option>
              <option value="no-desc-uk">{t('qualityNoDescUk')}</option>
              <option value="no-desc-ru">{t('qualityNoDescRu')}</option>
            </select>
          </div>

          {/* Featured select */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-extrabold uppercase text-slate-400">
              {t('featuredLabel')}
            </span>
            <select
              value={filters.featured || 'all'}
              onChange={(e) => onFilterChange({ featured: e.target.value })}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white outline-none text-xs font-bold text-slate-700"
            >
              <option value="all">{t('allProducts')}</option>
              <option value="featured">{t('typeFeatured')}</option>
              <option value="regular">{t('typeRegular')}</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 text-xs font-bold transition-colors cursor-pointer self-end mt-2 md:mt-0"
          >
            <RotateCcw className="size-3.5" />
            {t('resetBtn')}
          </button>
        )}
      </div>
    </div>
  )
}
