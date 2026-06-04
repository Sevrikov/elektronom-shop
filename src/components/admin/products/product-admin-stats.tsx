import { useTranslations } from 'next-intl'
import {
  Package,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ImageOff,
  DollarSign,
  Tag,
  FileText,
  Star,
} from 'lucide-react'

interface ProductAdminStatsProps {
  stats: {
    total: number
    active: number
    inactive: number
    inStock: number
    outOfStock: number
    withoutImages: number
    withoutPrice: number
    withoutBrand: number
    withoutDescUk: number
    withoutDescRu: number
    featured: number
  }
  currentFilters: {
    status?: string
    stock?: string
    quality?: string
    featured?: string
  }
  onFilterChange: (filters: {
    status?: string
    stock?: string
    quality?: string
    featured?: string
  }) => void
}

export function ProductAdminStats({
  stats,
  currentFilters,
  onFilterChange,
}: ProductAdminStatsProps) {
  const t = useTranslations('admin.productsTab.kpi')

  const items = [
    {
      key: 'total',
      label: t('total'),
      count: stats.total,
      icon: Package,
      color: 'bg-blue-50 text-blue-700 border-blue-100',
      activeColor: 'bg-blue-600 text-white border-blue-600',
      isActive:
        !currentFilters.status &&
        !currentFilters.stock &&
        !currentFilters.quality &&
        !currentFilters.featured,
      onClick: () =>
        onFilterChange({
          status: 'all',
          stock: 'all',
          quality: 'all',
          featured: 'all',
        }),
    },
    {
      key: 'active',
      label: t('active'),
      count: stats.active,
      icon: Eye,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      activeColor: 'bg-emerald-600 text-white border-emerald-600',
      isActive: currentFilters.status === 'active',
      onClick: () => onFilterChange({ status: 'active' }),
    },
    {
      key: 'inactive',
      label: t('inactive'),
      count: stats.inactive,
      icon: EyeOff,
      color: 'bg-slate-50 text-slate-700 border-slate-200',
      activeColor: 'bg-slate-700 text-white border-slate-700',
      isActive: currentFilters.status === 'hidden',
      onClick: () => onFilterChange({ status: 'hidden' }),
    },
    {
      key: 'inStock',
      label: t('inStock'),
      count: stats.inStock,
      icon: CheckCircle2,
      color: 'bg-teal-50 text-teal-700 border-teal-100',
      activeColor: 'bg-teal-600 text-white border-teal-600',
      isActive: currentFilters.stock === 'inStock',
      onClick: () => onFilterChange({ stock: 'inStock' }),
    },
    {
      key: 'outOfStock',
      label: t('outOfStock'),
      count: stats.outOfStock,
      icon: XCircle,
      color: 'bg-rose-50 text-rose-700 border-rose-100',
      activeColor: 'bg-rose-600 text-white border-rose-600',
      isActive: currentFilters.stock === 'outOfStock',
      onClick: () => onFilterChange({ stock: 'outOfStock' }),
    },
    {
      key: 'noPhoto',
      label: t('noPhoto'),
      count: stats.withoutImages,
      icon: ImageOff,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      activeColor: 'bg-amber-600 text-white border-amber-600',
      isActive: currentFilters.quality === 'no-photo',
      onClick: () => onFilterChange({ quality: 'no-photo' }),
    },
    {
      key: 'noPrice',
      label: t('noPrice'),
      count: stats.withoutPrice,
      icon: DollarSign,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      activeColor: 'bg-amber-600 text-white border-amber-600',
      isActive: currentFilters.quality === 'no-price',
      onClick: () => onFilterChange({ quality: 'no-price' }),
    },
    {
      key: 'noBrand',
      label: t('noBrand'),
      count: stats.withoutBrand,
      icon: Tag,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      activeColor: 'bg-amber-600 text-white border-amber-600',
      isActive: currentFilters.quality === 'no-brand',
      onClick: () => onFilterChange({ quality: 'no-brand' }),
    },
    {
      key: 'noDescUk',
      label: t('noDescUk'),
      count: stats.withoutDescUk,
      icon: FileText,
      color: 'bg-purple-50 text-purple-700 border-purple-100',
      activeColor: 'bg-purple-600 text-white border-purple-600',
      isActive: currentFilters.quality === 'no-desc-uk',
      onClick: () => onFilterChange({ quality: 'no-desc-uk' }),
    },
    {
      key: 'noDescRu',
      label: t('noDescRu'),
      count: stats.withoutDescRu,
      icon: FileText,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      activeColor: 'bg-indigo-600 text-white border-indigo-600',
      isActive: currentFilters.quality === 'no-desc-ru',
      onClick: () => onFilterChange({ quality: 'no-desc-ru' }),
    },
    {
      key: 'featured',
      label: t('featured'),
      count: stats.featured,
      icon: Star,
      color: 'bg-yellow-50 text-yellow-700 border-yellow-100',
      activeColor: 'bg-yellow-500 text-slate-950 border-yellow-500',
      isActive: currentFilters.featured === 'featured',
      onClick: () => onFilterChange({ featured: 'featured' }),
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.key}
            onClick={item.onClick}
            className={`flex flex-col gap-1 p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 hover:shadow-sm ${
              item.isActive ? item.activeColor : item.color
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Icon className="size-4 opacity-80" />
              <span className="text-lg font-black tracking-tight num">
                {item.count}
              </span>
            </div>
            <span className="text-[11px] font-bold leading-tight mt-1">
              {item.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
