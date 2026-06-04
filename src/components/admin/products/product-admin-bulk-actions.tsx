import { useState } from 'react'
import {
  Eye,
  EyeOff,
  RefreshCw,
  FolderOpen,
  Tag,
  Download,
  X,
  Check,
} from 'lucide-react'
import type { AdminCategoryItem, AdminBrandItem } from '@/actions/admin'
import { useTranslations } from 'next-intl'

interface ProductAdminBulkActionsProps {
  selectedIds: string[]
  categories: AdminCategoryItem[]
  brands: AdminBrandItem[]
  onClearSelection: () => void
  onBulkPublish: () => Promise<void>
  onBulkHide: () => Promise<void>
  onBulkSync: () => Promise<void>
  onBulkMoveCategory: (categoryId: string) => Promise<void>
  onBulkAssignBrand: (brandId: string | null) => Promise<void>
  onBulkExport: () => void
  locale: string
}

export function ProductAdminBulkActions({
  selectedIds,
  categories,
  brands,
  onClearSelection,
  onBulkPublish,
  onBulkHide,
  onBulkSync,
  onBulkMoveCategory,
  onBulkAssignBrand,
  onBulkExport,
  locale,
}: ProductAdminBulkActionsProps) {
  const t = useTranslations('admin.productsTab.bulk')
  const [selectedCatId, setSelectedCatId] = useState('')
  const [selectedBrandId, setSelectedBrandId] = useState('none')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (selectedIds.length === 0) return null

  const handleAction = async (fn: () => Promise<void>) => {
    setIsSubmitting(true)
    try {
      await fn()
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl w-[calc(100%-2rem)] animate-slide-up">
      {/* Left: Info */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center justify-center size-7 rounded-lg bg-accent/20 border border-accent/30 text-accent font-black text-xs">
          {selectedIds.length}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-black tracking-wide">
            {t('selected')}
          </span>
          <span className="text-[10px] text-slate-400 font-bold">
            {t('bulkActions')}
          </span>
        </div>
        <button
          onClick={onClearSelection}
          className="size-6 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Center & Right: Actions Group */}
      <div className="flex flex-wrap items-center justify-end gap-3.5 w-full md:w-auto">
        {/* Toggle states */}
        <div className="flex items-center gap-1.5 border-r border-slate-800 pr-3.5">
          <button
            disabled={isSubmitting}
            onClick={() => handleAction(onBulkPublish)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg hover:bg-slate-800 text-xs font-bold text-emerald-400 disabled:opacity-50 cursor-pointer transition-colors"
          >
            <Eye className="size-3.5" />
            {t('publish')}
          </button>
          <button
            disabled={isSubmitting}
            onClick={() => handleAction(onBulkHide)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg hover:bg-slate-800 text-xs font-bold text-slate-400 disabled:opacity-50 cursor-pointer transition-colors"
          >
            <EyeOff className="size-3.5" />
            {t('hide')}
          </button>
          <button
            disabled={isSubmitting}
            onClick={() => handleAction(onBulkSync)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg hover:bg-slate-800 text-xs font-bold text-slate-300 disabled:opacity-50 cursor-pointer transition-colors"
            title={t('syncTitle')}
          >
            <RefreshCw className="size-3.5" />
            {t('syncAlgolia')}
          </button>
        </div>

        {/* Change category */}
        <div className="flex items-center gap-1 border-r border-slate-800 pr-3.5">
          <FolderOpen className="size-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
            disabled={isSubmitting}
            className="h-8 px-2 rounded-lg bg-slate-850 border border-slate-800 text-xs font-bold text-slate-200 outline-none max-w-[140px] focus:border-slate-700"
          >
            <option value="">{t('changeCategoryPlaceholder')}</option>
            {categories.map((cat) => {
              const t = cat.translations.find((tr) => tr.locale === locale)
              return (
                <option key={cat.id} value={cat.id}>
                  {t?.name ?? cat.slug}
                </option>
              )
            })}
          </select>
          <button
            disabled={!selectedCatId || isSubmitting}
            onClick={() =>
              handleAction(async () => {
                await onBulkMoveCategory(selectedCatId)
                setSelectedCatId('')
              })
            }
            className="flex items-center justify-center size-8 rounded-lg bg-accent text-white hover:bg-accent-hover disabled:bg-slate-800 disabled:text-slate-600 disabled:opacity-60 transition-colors cursor-pointer"
          >
            <Check className="size-3.5" />
          </button>
        </div>

        {/* Assign brand */}
        <div className="flex items-center gap-1 border-r border-slate-800 pr-3.5">
          <Tag className="size-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedBrandId}
            onChange={(e) => setSelectedBrandId(e.target.value)}
            disabled={isSubmitting}
            className="h-8 px-2 rounded-lg bg-slate-850 border border-slate-800 text-xs font-bold text-slate-200 outline-none max-w-[140px] focus:border-slate-700"
          >
            <option value="none">{t('noBrand')}</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          <button
            disabled={isSubmitting}
            onClick={() =>
              handleAction(async () => {
                await onBulkAssignBrand(
                  selectedBrandId === 'none' ? null : selectedBrandId
                )
              })
            }
            className="flex items-center justify-center size-8 rounded-lg bg-accent text-white hover:bg-accent-hover disabled:bg-slate-800 disabled:text-slate-600 transition-colors cursor-pointer"
          >
            <Check className="size-3.5" />
          </button>
        </div>

        {/* Export */}
        <button
          onClick={onBulkExport}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
        >
          <Download className="size-3.5" />
          {t('export')}
        </button>
      </div>
    </div>
  )
}
