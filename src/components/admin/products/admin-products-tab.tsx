'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Plus, Loader2 } from 'lucide-react'
import type { Route } from 'next'
import {
  getProductsAdmin,
  getProductAdminStats,
  bulkToggleProductsActiveAdmin,
  bulkSyncProductsAlgoliaAdmin,
  bulkUpdateProductsCategoryAdmin,
  bulkUpdateProductsBrandAdmin,
  duplicateProductAdmin,
  toggleProductActiveAdmin,
  updateProductStockAdmin,
  deleteProductAdmin,
  saveProductAdmin,
  launchContentFactoryForProductAdmin,
  getContentFactoryProductStatusesAdmin,
  getContentFactoryRunResultAdmin,
} from '@/actions/admin'
import type {
  AdminProductItem,
  AdminCategoryItem,
  AdminBrandItem,
  ContentFactoryProductStatus,
  ContentFactoryRunResult,
} from '@/actions/admin'

import { ProductAdminStats } from './product-admin-stats'
import { ProductAdminFilters } from './product-admin-filters'
import { ProductAdminTable } from './product-admin-table'
import { ProductAdminBulkActions } from './product-admin-bulk-actions'
import { ProductEditModal } from './product-edit-modal'
import { ProductAiFactoryModal } from './product-ai-factory-modal'
import { ProductAiFactoryResultModal } from './product-ai-factory-result-modal'
import { useTranslations } from 'next-intl'

interface AdminProductsTabProps {
  categories: AdminCategoryItem[]
  brands: AdminBrandItem[]
  locale: string
}

export function AdminProductsTab({
  categories,
  brands,
  locale,
}: AdminProductsTabProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const t = useTranslations('admin.productsTab.messages')
  const tConfirm = useTranslations('admin.productsTab.deleteConfirm')

  // State definitions
  const [products, setProducts] = useState<AdminProductItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // KPI Stats state
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    inStock: 0,
    outOfStock: 0,
    withoutImages: 0,
    withoutPrice: 0,
    withoutBrand: 0,
    withoutDescUk: 0,
    withoutDescRu: 0,
    featured: 0,
  })

  // Modal edit state
  const [editingProduct, setEditingProduct] = useState<AdminProductItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Custom delete confirmation modal state
  const [productToDelete, setProductToDelete] = useState<AdminProductItem | null>(null)
  const [factoryProduct, setFactoryProduct] = useState<AdminProductItem | null>(null)
  const [factoryStatuses, setFactoryStatuses] = useState<Record<string, ContentFactoryProductStatus>>({})
  const [factoryResultRunId, setFactoryResultRunId] = useState<string | null>(null)
  const [factoryResult, setFactoryResult] = useState<ContentFactoryRunResult | null>(null)
  const [isFactoryResultLoading, setIsFactoryResultLoading] = useState(false)

  // Toast / notification local state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  };

  const loadFactoryStatuses = useCallback(async (items: AdminProductItem[]) => {
    if (!items.length) {
      setFactoryStatuses({})
      return
    }
    const res = await getContentFactoryProductStatusesAdmin(items.map((product) => product.id))
    if (res.success && res.statuses) {
      setFactoryStatuses(res.statuses)
    }
  }, [])

  // Synchronized reader: read URL parameters and fetch data
  const loadProductsAndStats = useCallback(async () => {
    setIsLoading(true)
    const page = Number(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId') || 'all'
    const brandId = searchParams.get('brandId') || 'all'
    const status = searchParams.get('status') || 'all'
    const stock = searchParams.get('stock') || 'all'
    const quality = searchParams.get('quality') || 'all'
    const featured = searchParams.get('featured') || 'all'
    const sort = searchParams.get('sort') || 'createdAt_desc'

    const res = await getProductsAdmin({
      page,
      limit: 20,
      search: search || undefined,
      categoryId: categoryId !== 'all' ? categoryId : undefined,
      brandId: brandId !== 'all' ? brandId : undefined,
      status: status !== 'all' ? status : undefined,
      stock: stock !== 'all' ? stock : undefined,
      quality: quality !== 'all' ? quality : undefined,
      featured: featured !== 'all' ? featured : undefined,
      sort,
    })

    if (res.success && res.items) {
      const loadedProducts = res.items as AdminProductItem[]
      setProducts(loadedProducts)
      setTotal(res.total || 0)
      setTotalPages(res.totalPages || 1)
      loadFactoryStatuses(loadedProducts)
    } else {
      showToast(res.error || t('fetchFailed'), 'error')
    }

    const statsRes = await getProductAdminStats()
    if (statsRes.success && statsRes.stats) {
      setStats(statsRes.stats)
    }
    setIsLoading(false)
  }, [searchParams, t, loadFactoryStatuses])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProductsAndStats()
  }, [loadProductsAndStats])

  // Clear selectedIds when page, search, or filters change in searchParams
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIds([])
  }, [searchParams])

  // Filter modifier helper
  const updateUrlFilters = (newFilters: Partial<{
    page: number
    search: string
    categoryId: string
    brandId: string
    status: string
    stock: string
    quality: string
    featured: string
    sort: string
  }>) => {
    const current = new URLSearchParams(searchParams.toString())
    
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val === undefined || val === 'all' || val === '') {
        current.delete(key)
      } else {
        current.set(key, String(val))
      }
    })

    // Reset pagination to page 1 on search change
    if (newFilters.search !== undefined || newFilters.categoryId !== undefined || newFilters.brandId !== undefined || newFilters.status !== undefined || newFilters.stock !== undefined || newFilters.quality !== undefined || newFilters.featured !== undefined) {
      current.set('page', '1')
    }

    router.push(`${pathname}?${current.toString()}` as Route, { scroll: false })
  };

  // Reset all filters
  const handleResetFilters = () => {
    router.push(pathname as Route, { scroll: false })
    setSelectedIds([])
  };

  // Stock update blur handler
  const handleStockChange = async (productId: string, stockCount: number) => {
    const res = await updateProductStockAdmin(productId, stockCount)
    if (res.success) {
      showToast(t('stockUpdated'))
      loadProductsAndStats()
    } else {
      showToast(res.error || 'Error', 'error')
    }
  };

  // Toggle active handler
  const handleToggleActive = async (productId: string) => {
    const res = await toggleProductActiveAdmin(productId)
    if (res.success) {
      showToast(
        res.isActive
          ? t('activated')
          : t('hidden')
      )
      loadProductsAndStats()
    } else {
      showToast(res.error || 'Error', 'error')
    }
  };

  // Save product handler
  const handleSaveProduct = async (data: Parameters<typeof saveProductAdmin>[0]) => {
    const res = await saveProductAdmin(data)
    if (res.success) {
      showToast(t('saved'))
      loadProductsAndStats()
    }
    return res
  };

  // Duplicate handler
  const handleDuplicateProduct = async (productId: string) => {
    const res = await duplicateProductAdmin(productId)
    if (res.success) {
      showToast(t('copied'))
      loadProductsAndStats()
    } else {
      showToast(res.error || 'Error', 'error')
    }
  };

  // Sync index
  const handleSyncAlgolia = async (productId: string) => {
    const res = await bulkSyncProductsAlgoliaAdmin([productId])
    if (res.success) {
      showToast(t('synced'))
    } else {
      showToast(res.error || 'Error', 'error')
    }
  };

  const handleLaunchContentFactory = async (
    payload: Parameters<typeof launchContentFactoryForProductAdmin>[0]
  ) => {
    const res = await launchContentFactoryForProductAdmin(payload)
    if (res.success) {
      showToast(`AI Factory queued: ${res.factoryRunStatus || 'created'} / ${res.localAgentJobStatus || 'queued'}`)
      await loadFactoryStatuses(products)
    } else {
      showToast(res.error || 'AI Factory launch failed', 'error')
    }
    return res
  };

  const handleOpenFactoryResult = async (runId: string) => {
    setFactoryResultRunId(runId)
    setFactoryResult(null)
    setIsFactoryResultLoading(true)
    const res = await getContentFactoryRunResultAdmin(runId)
    setFactoryResult(res)
    setIsFactoryResultLoading(false)
  };

  const refreshFactoryResult = async () => {
    if (!factoryResultRunId) return
    setIsFactoryResultLoading(true)
    const res = await getContentFactoryRunResultAdmin(factoryResultRunId)
    setFactoryResult(res)
    setIsFactoryResultLoading(false)
    await loadFactoryStatuses(products)
  };

  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    const res = await deleteProductAdmin(productId)
    if (res.success) {
      showToast(t('deleted'))
      setSelectedIds(selectedIds.filter((id) => id !== productId))
      loadProductsAndStats()
    } else {
      showToast(res.error || 'Error', 'error')
    }
  };

  // Bulk Publish
  const handleBulkPublish = async () => {
    const res = await bulkToggleProductsActiveAdmin(selectedIds, true)
    if (res.success) {
      showToast(t('bulkPublished'))
      setSelectedIds([])
      loadProductsAndStats()
    } else {
      showToast(res.error || 'Error', 'error')
    }
  };

  // Bulk Hide
  const handleBulkHide = async () => {
    const res = await bulkToggleProductsActiveAdmin(selectedIds, false)
    if (res.success) {
      showToast(t('bulkHidden'))
      setSelectedIds([])
      loadProductsAndStats()
    } else {
      showToast(res.error || 'Error', 'error')
    }
  };

  // Bulk Sync
  const handleBulkSync = async () => {
    const res = await bulkSyncProductsAlgoliaAdmin(selectedIds)
    if (res.success) {
      showToast(t('synced'))
      setSelectedIds([])
    } else {
      showToast(res.error || 'Error', 'error')
    }
  };

  // Bulk Move Category
  const handleBulkMoveCategory = async (catId: string) => {
    const res = await bulkUpdateProductsCategoryAdmin(selectedIds, catId)
    if (res.success) {
      showToast(t('categoryChanged'))
      setSelectedIds([])
      loadProductsAndStats()
    } else {
      showToast(res.error || 'Error', 'error')
    }
  };

  // Bulk Assign Brand
  const handleBulkAssignBrand = async (brId: string | null) => {
    const res = await bulkUpdateProductsBrandAdmin(selectedIds, brId)
    if (res.success) {
      showToast(t('brandChanged'))
      setSelectedIds([])
      loadProductsAndStats()
    } else {
      showToast(res.error || 'Error', 'error')
    }
  };

  // Bulk Export CSV
  const handleBulkExport = () => {
    const selectedProducts = products.filter((p) => selectedIds.includes(p.id))
    if (selectedProducts.length === 0) return

    const headers = ['SKU', 'Title', 'Category', 'Brand', 'Price', 'CostPrice', 'Stock', 'Status']
    
    // CSV Injection safety helper
    const escapeCsvValue = (val: string) => {
      const str = val || ''
      if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
        return `'${str}`
      }
      return str
    }

    const rows = selectedProducts.map((p) => {
      const trans = p.translations.find((t) => t.locale === locale)
      const catTrans = p.category?.translations?.[0]
      return [
        p.sku,
        trans?.name ?? p.slug,
        catTrans?.name ?? p.categoryId,
        p.brand?.name ?? '',
        Number(p.price).toString(),
        p.costPrice ? Number(p.costPrice).toString() : '',
        p.stock.toString(),
        p.isActive ? 'Active' : 'Hidden',
      ]
    })

    const csvContent = [
      headers.join(','), 
      ...rows.map((e) => e.map(val => `"${escapeCsvValue(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showToast(t('exported'))
  };

  // Helper to open Edit modal
  const handleEditOpen = (productItem: AdminProductItem) => {
    setEditingProduct(productItem)
    setIsModalOpen(true)
  };

  // Helper to open Create modal
  const handleCreateOpen = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  };

  const page = Number(searchParams.get('page') || '1')

  const currentFilters = {
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') || 'all',
    brandId: searchParams.get('brandId') || 'all',
    status: searchParams.get('status') || 'all',
    stock: searchParams.get('stock') || 'all',
    quality: searchParams.get('quality') || 'all',
    featured: searchParams.get('featured') || 'all',
    sort: searchParams.get('sort') || 'createdAt_desc',
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl border text-xs font-black shadow-lg transition-all duration-300 animate-slide-in ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* KPI Stats block */}
      <ProductAdminStats
        stats={stats}
        currentFilters={currentFilters}
        onFilterChange={(newFilters) => updateUrlFilters(newFilters)}
      />

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          {t('catalogTitle')}
          {isLoading && <Loader2 className="size-4 animate-spin text-slate-400" />}
        </h2>
        <button
          onClick={handleCreateOpen}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-4 bg-accent hover:bg-accent-hover text-white text-xs font-black rounded-xl transition-all shadow-sm shadow-accent/25 cursor-pointer"
        >
          <Plus className="size-4 stroke-[3]" />
          {t('addProduct')}
        </button>
      </div>

      {/* Advanced Filters block */}
      <ProductAdminFilters
        categories={categories}
        brands={brands}
        filters={currentFilters}
        onFilterChange={(newFilters) => updateUrlFilters(newFilters)}
        onReset={handleResetFilters}
        locale={locale}
      />

      {/* Main Table */}
      <ProductAdminTable
        products={products}
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
        onStockChange={handleStockChange}
        onToggleActive={handleToggleActive}
        onEdit={handleEditOpen}
        onDuplicate={handleDuplicateProduct}
        onSyncAlgolia={handleSyncAlgolia}
        onOpenFactory={setFactoryProduct}
        onOpenFactoryResult={handleOpenFactoryResult}
        factoryStatuses={factoryStatuses}
        onDelete={setProductToDelete}
        locale={locale}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-500">
          <span>
            {t('totalProducts')}{' '}
            <span className="text-slate-900 num font-black">{total}</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => updateUrlFilters({ page: page - 1 })}
              className="size-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center disabled:opacity-40 cursor-pointer transition-colors"
            >
              &larr;
            </button>
            <span className="px-3">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => updateUrlFilters({ page: page + 1 })}
              className="size-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center disabled:opacity-40 cursor-pointer transition-colors"
            >
              &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Floating Bulk Actions Panel */}
      <ProductAdminBulkActions
        selectedIds={selectedIds}
        categories={categories}
        brands={brands}
        onClearSelection={() => setSelectedIds([])}
        onBulkPublish={handleBulkPublish}
        onBulkHide={handleBulkHide}
        onBulkSync={handleBulkSync}
        onBulkMoveCategory={handleBulkMoveCategory}
        onBulkAssignBrand={handleBulkAssignBrand}
        onBulkExport={handleBulkExport}
        locale={locale}
      />

      {/* Product Create/Edit Dialog Modal */}
      <ProductEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        categories={categories}
        brands={brands}
        onSave={handleSaveProduct}
        locale={locale}
      />

      <ProductAiFactoryModal
        product={factoryProduct}
        onClose={() => setFactoryProduct(null)}
        onLaunch={handleLaunchContentFactory}
        locale={locale}
      />

      {factoryResultRunId && (
        <ProductAiFactoryResultModal
          result={factoryResult}
          isLoading={isFactoryResultLoading}
          locale={locale}
          onClose={() => {
            setFactoryResultRunId(null)
            setFactoryResult(null)
          }}
          onRefresh={refreshFactoryResult}
        />
      )}

      {/* Custom Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 animate-zoom-in">
            <h3 className="text-base font-black text-slate-950">
              {tConfirm('title')}
            </h3>
            <p className="text-xs font-semibold text-slate-600">
              {tConfirm('message', { name: productToDelete.translations.find((tr) => tr.locale === locale)?.name ?? productToDelete.slug })}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="h-9 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer transition-colors"
              >
                {tConfirm('btnCancel')}
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = productToDelete.id
                  setProductToDelete(null)
                  await handleDeleteProduct(id)
                }}
                className="h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs cursor-pointer transition-colors shadow-sm"
              >
                {tConfirm('btnConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
