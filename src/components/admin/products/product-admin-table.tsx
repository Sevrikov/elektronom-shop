import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Eye,
  EyeOff,
  MoreVertical,
  ExternalLink,
  Edit2,
  Copy,
  RefreshCw,
  Trash2,
  Sparkles,
} from 'lucide-react'
import type { AdminProductItem } from '@/actions/admin'
import type { ContentFactoryProductStatus } from '@/actions/admin'
import { useTranslations } from 'next-intl'

interface ProductAdminTableProps {
  products: AdminProductItem[]
  selectedIds: string[]
  onSelectChange: (ids: string[]) => void
  onStockChange: (productId: string, stock: number) => Promise<void>
  onToggleActive: (productId: string) => Promise<void>
  onEdit: (product: AdminProductItem) => void
  onDuplicate: (productId: string) => void
  onSyncAlgolia: (productId: string) => void
  onOpenFactory: (product: AdminProductItem) => void
  onOpenFactoryResult: (runId: string) => void
  factoryStatuses: Record<string, ContentFactoryProductStatus>
  onDelete: (product: AdminProductItem) => void
  locale: string
}

export function ProductAdminTable({
  products,
  selectedIds,
  onSelectChange,
  onStockChange,
  onToggleActive,
  onEdit,
  onDuplicate,
  onSyncAlgolia,
  onOpenFactory,
  onOpenFactoryResult,
  factoryStatuses,
  onDelete,
  locale,
}: ProductAdminTableProps) {
  const t = useTranslations('admin.productsTab.table')
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectChange(products.map((p) => p.id))
    } else {
      onSelectChange([])
    }
  };

  const handleSelectRow = (productId: string, checked: boolean) => {
    if (checked) {
      onSelectChange([...selectedIds, productId])
    } else {
      onSelectChange(selectedIds.filter((id) => id !== productId))
    }
  };

  const allSelected =
    products.length > 0 && products.every((p) => selectedIds.includes(p.id))

  const getProductQuality = (prod: AdminProductItem) => {
    const hasPhoto = prod.images.length > 0
    const hasPrice = Number(prod.price) > 0
    const hasBrand = !!prod.brandId
    const ukTrans = prod.translations.find((t) => t.locale === 'uk')
    const ruTrans = prod.translations.find((t) => t.locale === 'ru')
    const hasDescUk = !!ukTrans?.description && ukTrans.description.trim() !== ''
    const hasDescRu = !!ruTrans?.description && ruTrans.description.trim() !== ''

    let score = 0
    if (hasPhoto) score += 20
    if (hasPrice) score += 20
    if (hasBrand) score += 20
    if (hasDescUk) score += 20
    if (hasDescRu) score += 20

    return {
      score,
      details: { hasPhoto, hasPrice, hasBrand, hasDescUk, hasDescRu },
    }
  };

  return (
    <div className="overflow-x-auto border border-slate-200/80 rounded-xl mb-4 bg-white relative">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider select-none">
            <th className="px-4 py-3.5 w-12 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="size-4 rounded border-slate-300 accent-accent cursor-pointer"
              />
            </th>
            <th className="px-4 py-3.5 w-14">{t('photo')}</th>
            <th className="px-4 py-3.5">{t('title')}</th>
            <th className="px-4 py-3.5 w-36">SKU</th>
            <th className="px-4 py-3.5 w-44">{t('categoryBrand')}</th>
            <th className="px-4 py-3.5 w-32">{t('stock')}</th>
            <th className="px-4 py-3.5 w-44">{t('price')} ({t('margin')})</th>
            <th className="px-4 py-3.5 w-36 text-center">{t('quality')}</th>
            <th className="px-4 py-3.5 w-24 text-center">{t('active')}</th>
            <th className="px-4 py-3.5 w-16 text-right pr-6">{t('actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {products.map((prod) => {
            const trans = prod.translations?.find((t) => t.locale === locale)
            const catTrans = prod.category?.translations?.[0]
            const name = trans?.name ?? prod.slug
            const primaryImage = prod.images[0]?.url
            const factoryStatus = factoryStatuses[prod.id]

            const { score, details } = getProductQuality(prod)
            const isMenuOpen = activeMenuId === prod.id

            // Calculate profit margin if costPrice is set
            const price = Number(prod.price)
            const cost = prod.costPrice ? Number(prod.costPrice) : 0
            const margin = price > 0 && cost > 0 ? ((price - cost) / price) * 100 : null

            return (
              <tr
                key={prod.id}
                className={`hover:bg-slate-50/50 transition-colors ${
                  selectedIds.includes(prod.id) ? 'bg-slate-50/70' : ''
                }`}
              >
                {/* Checkbox */}
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(prod.id)}
                    onChange={(e) => handleSelectRow(prod.id, e.target.checked)}
                    className="size-4 rounded border-slate-300 accent-accent cursor-pointer"
                  />
                </td>

                {/* Photo Thumbnail */}
                <td className="px-4 py-3">
                  <div className="relative size-9 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden">
                    {primaryImage ? (
                      <Image
                        src={primaryImage}
                        alt={name}
                        width={36}
                        height={36}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase">
                        N/A
                      </span>
                    )}
                  </div>
                </td>

                {/* Title and Storefront Link */}
                <td className="px-4 py-3 max-w-sm">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 group">
                      <button
                        onClick={() => onEdit(prod)}
                        className="text-left font-bold text-slate-900 text-xs hover:text-accent transition-colors line-clamp-2"
                      >
                        {name}
                      </button>
                      {factoryStatus && (
                        <button
                          type="button"
                          onClick={() => onOpenFactoryResult(factoryStatus.factoryRunId)}
                          className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-black uppercase ${
                            factoryStatus.factoryRunStatus === 'exported' || factoryStatus.factoryRunStatus === 'approved'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : factoryStatus.factoryRunStatus === 'failed' || factoryStatus.factoryRunStatus === 'qa_failed'
                              ? 'border-rose-200 bg-rose-50 text-rose-700'
                              : 'border-blue-200 bg-blue-50 text-blue-700'
                          }`}
                          title={factoryStatus.localAgentNextAction || factoryStatus.factoryRunGate || factoryStatus.actionType}
                        >
                          <Sparkles className="size-3" />
                          AI {factoryStatus.factoryRunStatus}
                        </button>
                      )}
                      <Link
                        href={`/${locale}/product/${prod.slug}`}
                        target="_blank"
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition-opacity"
                        title={t('viewOnSite')}
                      >
                        <ExternalLink className="size-3" />
                      </Link>
                    </div>
                    {prod.isFeatured && (
                      <span className="inline-flex items-center gap-0.5 self-start text-[9px] font-black uppercase text-amber-600 bg-amber-50 border border-amber-100 px-1 py-0.2 rounded mt-0.5">
                        <Sparkles className="size-2 fill-amber-500 text-amber-500" />
                        Featured
                      </span>
                    )}
                  </div>
                </td>

                {/* SKU */}
                <td className="px-4 py-3 font-semibold text-xs text-slate-500 font-mono">
                  {prod.sku}
                </td>

                {/* Category & Brand */}
                <td className="px-4 py-3 text-xs flex flex-col gap-0.5">
                  <span className="font-extrabold text-slate-800">
                    {catTrans?.name ?? prod.category?.id ?? '—'}
                  </span>
                  <span className="font-medium text-slate-400">
                    {prod.brand?.name ?? '—'}
                  </span>
                </td>

                {/* Stock Input */}
                <td className="px-4 py-3">
                  <input
                    type="number"
                    defaultValue={prod.stock}
                    onBlur={(e) => onStockChange(prod.id, Number(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        ;(e.target as HTMLInputElement).blur()
                      }
                    }}
                    className={`w-20 h-7 border rounded-lg text-center font-bold text-xs outline-none transition-all ${
                      prod.stock === 0
                        ? 'border-rose-200 bg-rose-50/50 text-rose-700'
                        : 'border-slate-200 bg-slate-50/30 text-slate-700 focus:bg-white focus:border-accent'
                    }`}
                    min={0}
                  />
                </td>

                {/* Price (and Cost/Margin) */}
                <td className="px-4 py-3 text-xs">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 num">
                      {price.toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                    </span>
                    {cost > 0 && (
                      <span className="text-[10px] text-slate-400 font-medium num mt-0.5">
                        {t('cost')}{' '}
                        <span className="font-bold text-slate-600">
                          {cost.toLocaleString()} ₴
                        </span>
                        {margin !== null && (
                          <span
                            className={`ml-1.5 font-bold ${
                              margin >= 30
                                ? 'text-emerald-600'
                                : margin >= 15
                                ? 'text-blue-600'
                                : 'text-amber-600'
                            }`}
                          >
                            {margin.toFixed(0)}%
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </td>

                {/* Card Quality Checklist */}
                <td className="px-4 py-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    {/* Score badge */}
                    <div
                      className={`inline-flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded-full border ${
                        score >= 80
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : score >= 40
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {score}%
                    </div>
                    {/* Visual 5-dot checklist */}
                    <div className="flex items-center gap-0.5">
                      <span
                        className={`text-[9px] font-black uppercase w-3 text-center ${
                          details.hasPhoto ? 'text-emerald-500' : 'text-slate-300'
                        }`}
                        title={t('tooltipPhoto')}
                      >
                        📸
                      </span>
                      <span
                        className={`text-[9px] font-black ${
                          details.hasPrice ? 'text-emerald-500' : 'text-slate-300'
                        }`}
                        title={t('tooltipPrice')}
                      >
                        ₴
                      </span>
                      <span
                        className={`text-[9px] font-black ${
                          details.hasBrand ? 'text-emerald-500' : 'text-slate-300'
                        }`}
                        title={t('tooltipBrand')}
                      >
                        🏷️
                      </span>
                      <span
                        className={`text-[9px] font-black ${
                          details.hasDescUk ? 'text-emerald-500' : 'text-slate-300'
                        }`}
                        title={t('tooltipDescUk')}
                      >
                        UA
                      </span>
                      <span
                        className={`text-[9px] font-black ${
                          details.hasDescRu ? 'text-emerald-500' : 'text-slate-300'
                        }`}
                        title={t('tooltipDescRu')}
                      >
                        RU
                      </span>
                    </div>
                  </div>
                </td>

                {/* Toggle Active Badge/Button */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onToggleActive(prod.id)}
                    className="inline-flex cursor-pointer text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
                  >
                    {prod.isActive ? (
                      <Eye className="size-4.5 text-emerald-600 hover:text-emerald-700" />
                    ) : (
                      <EyeOff className="size-4.5 text-slate-400 hover:text-slate-500" />
                    )}
                  </button>
                </td>

                {/* Line Actions Menu */}
                <td className="px-4 py-3 text-right pr-6 relative">
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        setActiveMenuId(isMenuOpen ? null : prod.id)
                      }
                      className="size-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <MoreVertical className="size-4" />
                    </button>

                    {/* Popover Action Menu */}
                    {isMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveMenuId(null)}
                        />
                        <div className="absolute right-6 top-10 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-20 text-left animate-zoom-in">
                          <button
                            onClick={() => {
                              onEdit(prod)
                              setActiveMenuId(null)
                            }}
                            className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-bold"
                          >
                            <Edit2 className="size-3.5 text-slate-400" />
                            {t('edit')}
                          </button>

                          <button
                            onClick={() => {
                              onDuplicate(prod.id)
                              setActiveMenuId(null)
                            }}
                            className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-bold"
                          >
                            <Copy className="size-3.5 text-slate-400" />
                            {t('duplicate')}
                          </button>

                          <button
                            onClick={() => {
                              onOpenFactory(prod)
                              setActiveMenuId(null)
                            }}
                            className="w-full px-3 py-1.5 text-xs text-blue-700 hover:bg-blue-50 flex items-center gap-2 cursor-pointer font-bold"
                          >
                            <Sparkles className="size-3.5" />
                            AI Factory
                          </button>

                          {factoryStatus && (
                            <button
                              onClick={() => {
                                onOpenFactoryResult(factoryStatus.factoryRunId)
                                setActiveMenuId(null)
                              }}
                              className="w-full px-3 py-1.5 text-xs text-blue-700 hover:bg-blue-50 flex items-center gap-2 cursor-pointer font-bold"
                            >
                              <Eye className="size-3.5" />
                              Open AI result
                            </button>
                          )}

                          <button
                            onClick={() => {
                              onSyncAlgolia(prod.id)
                              setActiveMenuId(null)
                            }}
                            className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-bold"
                          >
                            <RefreshCw className="size-3.5 text-slate-400" />
                            {t('sync')}
                          </button>

                          <div className="h-px bg-slate-100 my-1" />

                          <button
                            onClick={() => {
                              onDelete(prod)
                              setActiveMenuId(null)
                            }}
                            className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-bold"
                          >
                            <Trash2 className="size-3.5" />
                            {t('delete')}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}

          {products.length === 0 && (
            <tr>
              <td
                colSpan={10}
                className="px-4 py-16 text-center text-slate-400 font-semibold"
              >
                {t('noProducts')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
