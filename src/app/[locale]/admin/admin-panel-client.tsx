'use client'

import { useState, useEffect, useTransition } from 'react'
import type { OrderStatus } from '@/generated/prisma/client'
import {
  Users,
  ShoppingCart,
  Package,
  RefreshCw,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  FileText,
  Bookmark,
  Tags,
  CheckCircle,
  MessageSquare,
  Star,
} from 'lucide-react'
import {
  getProductsAdmin,
  saveProductAdmin,
  toggleProductActiveAdmin,
  updateProductStockAdmin,
  deleteProductAdmin,
  getOrdersAdmin,
  updateOrderStatusAdmin,
  updateOrderNotesAdmin,
  getCategoriesBrandsAdmin,
  saveCategoryAdmin,
  saveBrandAdmin,
  getReviewsAdmin,
  toggleReviewVisibilityAdmin,
  deleteReviewAdmin,
  type AdminProductItem,
  type AdminOrderItem,
  type AdminReviewItem,
  type AdminCategoryItem,
  type AdminBrandItem,
  type CustomerData,
  type OrderItemSnapshot,
} from '@/actions/admin'
import { ImageUploader, type ProductImageInput } from '@/components/admin/image-uploader'

interface AdminPanelClientProps {
  initialStats: {
    totalOrders: number
    totalUsers: number
    totalProducts: number
  }
  initialRecentOrders: AdminOrderItem[]
  initialCategories: AdminCategoryItem[]
  initialBrands: AdminBrandItem[]
  locale: string
}

export default function AdminPanelClient({
  initialStats,
  initialRecentOrders,
  initialCategories,
  initialBrands,
  locale,
}: AdminPanelClientProps) {
  const uk = locale !== 'ru'
  const loc = locale === 'ru' ? 'ru' : 'uk'
  const [isPending, startTransition] = useTransition()

  // Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'categories_brands' | 'reviews'>('overview')

  // Stats & States
  const [stats, setStats] = useState(initialStats)
  const [recentOrders, setRecentOrders] = useState<AdminOrderItem[]>(initialRecentOrders)
  const [categories, setCategories] = useState<AdminCategoryItem[]>(initialCategories)
  const [brands, setBrands] = useState<AdminBrandItem[]>(initialBrands)

  // Products tab states
  const [products, setProducts] = useState<AdminProductItem[]>([])
  const [productsTotal, setProductsTotal] = useState(0)
  const [productsPage, setProductsPage] = useState(1)
  const [productsSearch, setProductsSearch] = useState('')
  const [productsCategory, setProductsCategory] = useState('')
  const [productsBrand, setProductsBrand] = useState('')
  const [editingProduct, setEditingProduct] = useState<AdminProductItem | null>(null)
  const [productModalOpen, setProductModalOpen] = useState(false)

  // Product Form State
  const [productForm, setProductForm] = useState<{
    id: string
    sku: string
    slug: string
    categoryId: string
    brandId: string
    price: number
    comparePrice: string | number
    costPrice: string | number
    stock: number
    isActive: boolean
    isFeatured: boolean
    sortOrder: number
    nameUk: string
    descriptionUk: string
    nameRu: string
    descriptionRu: string
    images: ProductImageInput[]
  }>({
    id: '',
    sku: '',
    slug: '',
    categoryId: '',
    brandId: '',
    price: 0,
    comparePrice: '',
    costPrice: '',
    stock: 0,
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
    nameUk: '',
    descriptionUk: '',
    nameRu: '',
    descriptionRu: '',
    images: [],
  })

  // Orders tab states
  const [orders, setOrders] = useState<AdminOrderItem[]>([])
  const [ordersTotal, setOrdersTotal] = useState(0)
  const [ordersPage, setOrdersPage] = useState(1)
  const [ordersStatus, setOrdersStatus] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderItem | null>(null)
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [orderNotes, setOrderNotes] = useState('')

  // Reviews tab states
  const [reviews, setReviews] = useState<AdminReviewItem[]>([])
  const [reviewsTotal, setReviewsTotal] = useState(0)
  const [reviewsPage, setReviewsPage] = useState(1)
  const [reviewsFilter, setReviewsFilter] = useState<'all' | 'pending' | 'visible'>('all')

  // Categories & Brands states
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<AdminCategoryItem | null>(null)
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    slug: '',
    parentId: '',
    sortOrder: 0,
    isActive: true,
    nameUk: '',
    descriptionUk: '',
    nameRu: '',
    descriptionRu: '',
  })

  const [brandModalOpen, setBrandModalOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<AdminBrandItem | null>(null)
  const [brandForm, setBrandForm] = useState({
    id: '',
    slug: '',
    name: '',
    logo: '',
    isActive: true,
  })

  // Toast/Notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Fetch helper for products
  const fetchProducts = (page = 1) => {
    startTransition(async () => {
      const res = await getProductsAdmin(
        page,
        15,
        productsSearch || undefined,
        productsCategory || undefined,
        productsBrand || undefined
      )
      if (res.success && res.items) {
        setProducts(res.items)
        setProductsTotal(res.total)
        setProductsPage(page)
      }
    })
  }

  // Fetch helper for orders
  const fetchOrders = (page = 1) => {
    startTransition(async () => {
      const res = await getOrdersAdmin(page, 15, ordersStatus || undefined)
      if (res.success && res.items) {
        setOrders(res.items)
        setOrdersTotal(res.total)
        setOrdersPage(page)
      }
    })
  }

  // Fetch helper for reviews
  const fetchReviews = (page = 1) => {
    startTransition(async () => {
      const isVisibleParam =
        reviewsFilter === 'all'
          ? undefined
          : reviewsFilter === 'visible'
          ? true
          : false
      const res = await getReviewsAdmin(page, 15, isVisibleParam)
      if (res.success && res.items) {
        setReviews(res.items)
        setReviewsTotal(res.total)
        setReviewsPage(page)
      }
    })
  }

  // Fetch metadata
  const fetchMetadata = () => {
    startTransition(async () => {
      const res = await getCategoriesBrandsAdmin()
      if (res.success) {
        if (res.categories) setCategories(res.categories)
        if (res.brands) setBrands(res.brands)
      }
    })
  }

  // Refreshes the active tab data
  const handleRefresh = async () => {
    if (activeTab === 'overview') {
      // Reload stats/recent
      const resProducts = await getProductsAdmin(1, 1)
      const resOrders = await getOrdersAdmin(1, 5)
      if (resProducts.success && resOrders.success) {
        setStats({
          totalOrders: resOrders.total ?? 0,
          totalUsers: initialStats.totalUsers, // non-editable directly here
          totalProducts: resProducts.total ?? 0,
        })
        if (resOrders.items) setRecentOrders(resOrders.items)
        showToast(uk ? 'Дані оновлено' : 'Данные обновлены')
      }
    } else if (activeTab === 'products') {
      fetchProducts(productsPage)
    } else if (activeTab === 'orders') {
      fetchOrders(ordersPage)
    } else if (activeTab === 'categories_brands') {
      fetchMetadata()
      showToast(uk ? 'Дані оновлено' : 'Данные обновлены')
    } else if (activeTab === 'reviews') {
      fetchReviews(reviewsPage)
    }
  }

  // Trigger loading when tab changes
  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts(1)
    } else if (activeTab === 'orders') {
      fetchOrders(1)
    } else if (activeTab === 'categories_brands') {
      fetchMetadata()
    } else if (activeTab === 'reviews') {
      fetchReviews(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, reviewsFilter])

  // --- Reviews Actions ---
  const handleToggleReviewVisibility = async (reviewId: string) => {
    const res = await toggleReviewVisibilityAdmin(reviewId)
    if (res.success) {
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, isVisible: res.isVisible ?? !r.isVisible } : r))
      )
      showToast(uk ? 'Статус відгуку змінено' : 'Статус отзыва изменен')
    } else {
      showToast(res.error || 'Error', 'error')
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (
      !confirm(
        uk
          ? 'Ви впевнені, що хочете видалити цей відгук?'
          : 'Вы уверены, что хотите удалить этот отзыв?'
      )
    )
      return
    const res = await deleteReviewAdmin(reviewId)
    if (res.success) {
      setReviews((prev) => prev.filter((r) => r.id !== reviewId))
      showToast(uk ? 'Відгук видалено' : 'Отзыв удален')
    } else {
      showToast(res.error || 'Error', 'error')
    }
  }

  // --- Products CRUD Actions ---
  const handleToggleActive = async (productId: string) => {
    const res = await toggleProductActiveAdmin(productId)
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isActive: res.isActive ?? !p.isActive } : p))
      )
      showToast(uk ? 'Статус товару змінено' : 'Статус товара изменен')
    } else {
      showToast(res.error || 'Error', 'error')
    }
  }

  const handleStockBlur = async (productId: string, value: number) => {
    if (value < 0) return
    const res = await updateProductStockAdmin(productId, value)
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: value } : p))
      )
      showToast(uk ? 'Залишок оновлено' : 'Остаток обновлен')
    } else {
      showToast(res.error || 'Error', 'error')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm(uk ? 'Ви впевнені, що хочете видалити цей товар?' : 'Вы уверены, что хотите удалить этот товар?')) return
    const res = await deleteProductAdmin(productId)
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      showToast(uk ? 'Товар видалено' : 'Товар удален')
    } else {
      showToast(res.error || 'Error', 'error')
    }
  }

  const handleEditProductOpen = (prod: AdminProductItem) => {
    setEditingProduct(prod)
    // Build translation data
    const transUk = prod.translations?.find((t) => t.locale === 'uk')
    const transRu = prod.translations?.find((t) => t.locale === 'ru')

    setProductForm({
      id: prod.id,
      sku: prod.sku,
      slug: prod.slug,
      categoryId: prod.categoryId || prod.category?.id || '',
      brandId: prod.brandId || prod.brand?.id || '',
      price: Number(prod.price),
      comparePrice: prod.comparePrice ? Number(prod.comparePrice) : '',
      costPrice: prod.costPrice ? Number(prod.costPrice) : '',
      stock: prod.stock,
      isActive: prod.isActive,
      isFeatured: prod.isFeatured || false,
      sortOrder: prod.sortOrder || 0,
      nameUk: transUk?.name || '',
      descriptionUk: transUk?.description || '',
      nameRu: transRu?.name || '',
      descriptionRu: transRu?.description || '',
      images: (prod.images || []).map((img) => ({
        id: img.id,
        url: img.url,
        provider: img.provider,
        publicId: img.publicId,
        width: img.width,
        height: img.height,
        format: img.format,
        size: img.size,
        alt: img.alt,
        sortOrder: img.sortOrder,
      })),
    })
    setProductModalOpen(true)
  }

  const handleNewProductOpen = () => {
    setEditingProduct(null)
    setProductForm({
      id: '',
      sku: '',
      slug: '',
      categoryId: categories[0]?.id || '',
      brandId: '',
      price: 0,
      comparePrice: '',
      costPrice: '',
      stock: 0,
      isActive: true,
      isFeatured: false,
      sortOrder: 0,
      nameUk: '',
      descriptionUk: '',
      nameRu: '',
      descriptionRu: '',
      images: [],
    })
    setProductModalOpen(true)
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      id: productForm.id || undefined,
      sku: productForm.sku,
      slug: productForm.slug,
      categoryId: productForm.categoryId,
      brandId: productForm.brandId || null,
      price: Number(productForm.price),
      comparePrice: productForm.comparePrice !== '' ? Number(productForm.comparePrice) : null,
      costPrice: productForm.costPrice !== '' ? Number(productForm.costPrice) : null,
      stock: Number(productForm.stock),
      isActive: productForm.isActive,
      isFeatured: productForm.isFeatured,
      sortOrder: Number(productForm.sortOrder),
      nameUk: productForm.nameUk,
      descriptionUk: productForm.descriptionUk,
      nameRu: productForm.nameRu,
      descriptionRu: productForm.descriptionRu,
      images: productForm.images,
    }

    startTransition(async () => {
      const res = await saveProductAdmin(payload)
      if (res.success) {
        showToast(uk ? 'Товар збережено' : 'Товар сохранен')
        setProductModalOpen(false)
        fetchProducts(productsPage)
      } else {
        showToast(res.error || 'Error saving product', 'error')
      }
    })
  }

  // --- Orders Actions ---
  const handleViewOrder = (order: AdminOrderItem) => {
    setSelectedOrder(order)
    setOrderNotes(order.notes || '')
    setOrderModalOpen(true)
  }

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const res = await updateOrderStatusAdmin(orderId, status)
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      )
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status } : null))
      }
      showToast(uk ? 'Статус замовлення оновлено' : 'Статус заказа обновлен')
    } else {
      showToast(res.error || 'Error', 'error')
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedOrder) return
    const res = await updateOrderNotesAdmin(selectedOrder.id, orderNotes)
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, notes: orderNotes } : o))
      )
      setSelectedOrder((prev) => (prev ? { ...prev, notes: orderNotes } : null))
      showToast(uk ? 'Коментар збережено' : 'Комментарий сохранен')
    } else {
      showToast(res.error || 'Error', 'error')
    }
  }

  // --- Categories CRUD ---
  const handleEditCategoryOpen = (cat: AdminCategoryItem) => {
    setEditingCategory(cat)
    const transUk = cat.translations?.find((t) => t.locale === 'uk')
    const transRu = cat.translations?.find((t) => t.locale === 'ru')

    setCategoryForm({
      id: cat.id,
      slug: cat.slug,
      parentId: cat.parentId || '',
      sortOrder: cat.sortOrder || 0,
      isActive: cat.isActive,
      nameUk: transUk?.name || '',
      descriptionUk: transUk?.description || '',
      nameRu: transRu?.name || '',
      descriptionRu: transRu?.description || '',
    })
    setCategoryModalOpen(true)
  }

  const handleNewCategoryOpen = () => {
    setEditingCategory(null)
    setCategoryForm({
      id: '',
      slug: '',
      parentId: '',
      sortOrder: 0,
      isActive: true,
      nameUk: '',
      descriptionUk: '',
      nameRu: '',
      descriptionRu: '',
    })
    setCategoryModalOpen(true)
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      id: categoryForm.id || undefined,
      slug: categoryForm.slug,
      parentId: categoryForm.parentId || null,
      sortOrder: Number(categoryForm.sortOrder),
      isActive: categoryForm.isActive,
      nameUk: categoryForm.nameUk,
      descriptionUk: categoryForm.descriptionUk,
      nameRu: categoryForm.nameRu,
      descriptionRu: categoryForm.descriptionRu,
    }

    const res = await saveCategoryAdmin(payload)
    if (res.success) {
      showToast(uk ? 'Категорію збережено' : 'Категория сохранена')
      setCategoryModalOpen(false)
      fetchMetadata()
    } else {
      showToast(res.error || 'Error saving category', 'error')
    }
  }

  // --- Brands CRUD ---
  const handleEditBrandOpen = (br: AdminBrandItem) => {
    setEditingBrand(br)
    setBrandForm({
      id: br.id,
      slug: br.slug,
      name: br.name,
      logo: br.logo || '',
      isActive: br.isActive,
    })
    setBrandModalOpen(true)
  }

  const handleNewBrandOpen = () => {
    setEditingBrand(null)
    setBrandForm({
      id: '',
      slug: '',
      name: '',
      logo: '',
      isActive: true,
    })
    setBrandModalOpen(true)
  }

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      id: brandForm.id || undefined,
      slug: brandForm.slug,
      name: brandForm.name,
      logo: brandForm.logo || null,
      isActive: brandForm.isActive,
    }

    const res = await saveBrandAdmin(payload)
    if (res.success) {
      showToast(uk ? 'Бренд збережено' : 'Бренд сохранен')
      setBrandModalOpen(false)
      fetchMetadata()
    } else {
      showToast(res.error || 'Error saving brand', 'error')
    }
  }

  const totalProductsPages = Math.ceil(productsTotal / 15)
  const totalOrdersPages = Math.ceil(ordersTotal / 15)

  return (
    <div className="min-h-[calc(100vh-200px)] bg-[#f8fafc] py-8 text-slate-800 antialiased font-sans">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg transition-all animate-bounce ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <CheckCircle className="size-4 shrink-0 text-current" />
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Bookmark className="text-accent fill-accent size-6 shrink-0" />
              {uk ? 'Адмін-панель' : 'Админ-панель'} <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-accent/15 text-accent tracking-wider">MVP</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {uk ? 'Керування замовленнями, товарами та каталогом' : 'Управление заказами, товарами и каталогом'}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold h-9 px-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${isPending ? 'animate-spin' : ''}`} />
            {uk ? 'Оновити' : 'Обновить'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 overflow-x-auto my-6 gap-1 scrollbar-none">
          {([
            { id: 'overview', label: uk ? 'Огляд' : 'Обзор', icon: FileText },
            { id: 'products', label: uk ? 'Товари' : 'Товары', icon: Package },
            { id: 'orders', label: uk ? 'Замовлення' : 'Заказы', icon: ShoppingCart },
            { id: 'categories_brands', label: uk ? 'Категорії / Бренди' : 'Категории / Бренды', icon: Tags },
            { id: 'reviews', label: uk ? 'Відгуки' : 'Отзывы', icon: MessageSquare },
          ] as const).map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'border-accent text-accent font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* LOADING INDICATOR OVERLAY FOR ACTIONS */}
        {isPending && activeTab !== 'overview' && (
          <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[1px] z-40 flex items-center justify-center">
            <div className="bg-white/80 p-4 rounded-full shadow-lg border border-slate-100">
              <Loader2 className="size-8 text-accent animate-spin" />
            </div>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────── */}
        {/* OVERVIEW TAB */}
        {/* ──────────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="size-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                  <ShoppingCart className="size-6 font-black" />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {uk ? 'Замовлення' : 'Заказы'}
                  </p>
                  <h3 className="text-3xl font-black text-slate-900 num mt-0.5">{stats.totalOrders}</h3>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="size-12 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                  <Users className="size-6 font-black" />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {uk ? 'Клієнти' : 'Клиенты'}
                  </p>
                  <h3 className="text-3xl font-black text-slate-900 num mt-0.5">{stats.totalUsers}</h3>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="size-12 rounded-xl bg-violet-500/15 text-violet-600 flex items-center justify-center">
                  <Package className="size-6 font-black" />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {uk ? 'Товари' : 'Товары'}
                  </p>
                  <h3 className="text-3xl font-black text-slate-900 num mt-0.5">{stats.totalProducts}</h3>
                </div>
              </div>
            </div>

            {/* Recent Orders Card */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-base font-black text-slate-900">
                  {uk ? 'Останні замовлення' : 'Последние заказы'}
                </h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {uk ? 'Усі замовлення' : 'Все заказы'}
                  <ChevronRight className="size-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-3.5">{uk ? 'Номер' : 'Номер'}</th>
                      <th className="px-6 py-3.5">{uk ? 'Клієнт' : 'Клиент'}</th>
                      <th className="px-6 py-3.5">{uk ? 'Статус' : 'Статус'}</th>
                      <th className="px-6 py-3.5">{uk ? 'Дата' : 'Дата'}</th>
                      <th className="px-6 py-3.5 text-right">{uk ? 'Сума' : 'Сумма'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {recentOrders.map((ord) => {
                      const client = ord.customerData as unknown as CustomerData
                      const name = client ? `${client.firstName ?? ''} ${client.lastName ?? ''}`.trim() : 'Гість'
                      const date = new Date(ord.createdAt).toLocaleDateString(
                        locale === 'uk' ? 'uk-UA' : 'ru-RU',
                        { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
                      )
                      return (
                        <tr
                          key={ord.id}
                          className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                          onClick={() => handleViewOrder(ord)}
                        >
                          <td className="px-6 py-4 font-black text-accent num">{ord.number}</td>
                          <td className="px-6 py-4 font-semibold">{name}</td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/15">
                              {ord.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 font-medium">{date}</td>
                          <td className="px-6 py-4 text-right font-black num">
                            {Number(ord.total).toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                          </td>
                        </tr>
                      )
                    })}
                    {recentOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                          {uk ? 'Замовлень немає' : 'Заказов нет'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────── */}
        {/* PRODUCTS TAB */}
        {/* ──────────────────────────────────────────────────────── */}
        {activeTab === 'products' && (
          <div className="animate-fade-in bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            {/* Filters Row */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                  <input
                    type="text"
                    value={productsSearch}
                    onChange={(e) => setProductsSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchProducts(1)}
                    placeholder={uk ? 'Пошук за назвою або SKU...' : 'Поиск по названию или SKU...'}
                    className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 outline-none text-xs focus:border-accent bg-slate-50 focus:bg-white transition-all font-semibold"
                  />
                </div>

                {/* Category select */}
                <select
                  value={productsCategory}
                  onChange={(e) => setProductsCategory(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 outline-none text-xs font-bold text-slate-700"
                >
                  <option value="">{uk ? 'Всі категорії' : 'Все категории'}</option>
                  {categories.map((cat) => {
                    const trans = cat.translations?.find((t) => t.locale === loc)
                    return (
                      <option key={cat.id} value={cat.id}>
                        {trans?.name ?? cat.slug}
                      </option>
                    )
                  })}
                </select>

                {/* Brand select */}
                <select
                  value={productsBrand}
                  onChange={(e) => setProductsBrand(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 outline-none text-xs font-bold text-slate-700"
                >
                  <option value="">{uk ? 'Всі бренди' : 'Все бренды'}</option>
                  {brands.map((br) => (
                    <option key={br.id} value={br.id}>
                      {br.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => fetchProducts(1)}
                  className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-colors cursor-pointer"
                >
                  {uk ? 'Фільтрувати' : 'Фильтровать'}
                </button>
              </div>

              <button
                onClick={handleNewProductOpen}
                className="inline-flex items-center justify-center gap-1.5 h-9 px-4 bg-accent hover:bg-accent-hover text-white text-xs font-black rounded-xl transition-all shadow-sm shadow-accent/25 cursor-pointer"
              >
                <Plus className="size-4 stroke-[3]" />
                {uk ? 'Додати товар' : 'Добавить товар'}
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl mb-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="px-4 py-3">{uk ? 'Товар' : 'Товар'}</th>
                    <th className="px-4 py-3">{uk ? 'SKU' : 'SKU'}</th>
                    <th className="px-4 py-3">{uk ? 'Категорія' : 'Категория'}</th>
                    <th className="px-4 py-3">{uk ? 'Ціна' : 'Цена'}</th>
                    <th className="px-4 py-3 w-32">{uk ? 'Залишок' : 'Остаток'}</th>
                    <th className="px-4 py-3 text-center">{uk ? 'Активний' : 'Активен'}</th>
                    <th className="px-4 py-3 text-right">{uk ? 'Дії' : 'Действия'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {products.map((prod) => {
                    const trans = prod.translations?.find((t) => t.locale === loc)
                    const catTrans = prod.category?.translations?.[0]
                    return (
                      <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs truncate">
                          {trans?.name ?? prod.slug}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-500 text-xs num">{prod.sku}</td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-500">
                          {catTrans?.name ?? prod.category?.id ?? '—'}
                        </td>
                        <td className="px-4 py-3 font-black text-slate-900 num">
                          {Number(prod.price).toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                        </td>
                        <td className="px-4 py-2 w-32">
                          <input
                            type="number"
                            defaultValue={prod.stock}
                            onBlur={(e) => handleStockBlur(prod.id, Number(e.target.value))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleStockBlur(prod.id, Number((e.target as HTMLInputElement).value))
                                ;(e.target as HTMLInputElement).blur()
                              }
                            }}
                            className="w-20 h-8 px-2 border border-slate-200 rounded-lg text-center font-bold text-xs bg-slate-50 focus:bg-white outline-none"
                            min={0}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleToggleActive(prod.id)}
                            className="inline-flex cursor-pointer"
                          >
                            {prod.isActive ? (
                              <Eye className="size-5 text-emerald-600 hover:text-emerald-700" />
                            ) : (
                              <EyeOff className="size-5 text-slate-400 hover:text-slate-500" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditProductOpen(prod)}
                              className="size-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <Edit2 className="size-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="size-8 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-600 flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400 font-semibold">
                        {uk ? 'Товарів не знайдено' : 'Товаров не найдено'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalProductsPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-500">
                <span>
                  {uk ? 'Всього товарів:' : 'Всего товаров:'} <span className="text-slate-900 num font-black">{productsTotal}</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={productsPage === 1}
                    onClick={() => fetchProducts(productsPage - 1)}
                    className="size-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="px-3">
                    {productsPage} / {totalProductsPages}
                  </span>
                  <button
                    disabled={productsPage === totalProductsPages}
                    onClick={() => fetchProducts(productsPage + 1)}
                    className="size-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ──────────────────────────────────────────────────────── */}
        {/* ORDERS TAB */}
        {/* ──────────────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="animate-fade-in bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            {/* Filters */}
            <div className="flex items-center gap-3 mb-6">
              <select
                value={ordersStatus}
                onChange={(e) => setOrdersStatus(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 outline-none text-xs font-bold text-slate-700"
              >
                <option value="">{uk ? 'Всі статуси' : 'Все статусы'}</option>
                {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].map(
                  (st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  )
                )}
              </select>
              <button
                onClick={() => fetchOrders(1)}
                className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-colors cursor-pointer"
              >
                {uk ? 'Фільтрувати' : 'Фильтровать'}
              </button>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl mb-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="px-4 py-3">{uk ? 'Номер' : 'Номер'}</th>
                    <th className="px-4 py-3">{uk ? 'Клієнт' : 'Клиент'}</th>
                    <th className="px-4 py-3">{uk ? 'Сума' : 'Сумма'}</th>
                    <th className="px-4 py-3">{uk ? 'Статус' : 'Статус'}</th>
                    <th className="px-4 py-3">{uk ? 'Оплата' : 'Оплата'}</th>
                    <th className="px-4 py-3">{uk ? 'Дата' : 'Дата'}</th>
                    <th className="px-4 py-3 text-right">{uk ? 'Дії' : 'Действия'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {orders.map((ord) => {
                    const client = ord.customerData as unknown as CustomerData
                    const name = client ? `${client.firstName ?? ''} ${client.lastName ?? ''}`.trim() : 'Гість'
                    const date = new Date(ord.createdAt).toLocaleDateString(
                      locale === 'uk' ? 'uk-UA' : 'ru-RU',
                      { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
                    )
                    return (
                      <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-black text-accent num">{ord.number}</td>
                        <td className="px-4 py-3 font-semibold">{name}</td>
                        <td className="px-4 py-3 font-black text-slate-900 num">
                          {Number(ord.total).toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                            className="h-7 px-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-slate-50 cursor-pointer"
                          >
                            {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].map(
                              (st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              )
                            )}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 font-medium">{date}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleViewOrder(ord)}
                            className="h-8 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                          >
                            {uk ? 'Перегляд' : 'Просмотр'}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400 font-semibold">
                        {uk ? 'Замовлень не знайдено' : 'Заказов не найдено'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalOrdersPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-500">
                <span>
                  {uk ? 'Всього замовлень:' : 'Всего заказов:'} <span className="text-slate-900 num font-black">{ordersTotal}</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={ordersPage === 1}
                    onClick={() => fetchOrders(ordersPage - 1)}
                    className="size-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="px-3">
                    {ordersPage} / {totalOrdersPages}
                  </span>
                  <button
                    disabled={ordersPage === totalOrdersPages}
                    onClick={() => fetchOrders(ordersPage + 1)}
                    className="size-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ──────────────────────────────────────────────────────── */}
        {/* CATEGORIES / BRANDS TAB */}
        {/* ──────────────────────────────────────────────────────── */}
        {activeTab === 'categories_brands' && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Categories Management */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h2 className="text-base font-black text-slate-900">{uk ? 'Категорії' : 'Категории'}</h2>
                <button
                  onClick={handleNewCategoryOpen}
                  className="inline-flex items-center gap-1 h-8 px-3 bg-accent hover:bg-accent-hover text-white text-xs font-black rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="size-3.5 stroke-[3]" />
                  {uk ? 'Додати' : 'Добавить'}
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const trans = cat.translations?.find((t) => t.locale === loc)
                  return (
                    <div key={cat.id} className="py-3 flex items-center justify-between text-sm">
                      <div>
                        <p className="font-bold text-slate-800">{trans?.name ?? cat.slug}</p>
                        <p className="text-xs text-slate-400 font-medium">Slug: {cat.slug}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                            cat.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}
                        >
                          {cat.isActive ? 'Active' : 'Hidden'}
                        </span>
                        <button
                          onClick={() => handleEditCategoryOpen(cat)}
                          className="size-7 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                        >
                          <Edit2 className="size-3" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Brands Management */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h2 className="text-base font-black text-slate-900">{uk ? 'Бренди' : 'Бренды'}</h2>
                <button
                  onClick={handleNewBrandOpen}
                  className="inline-flex items-center gap-1 h-8 px-3 bg-accent hover:bg-accent-hover text-white text-xs font-black rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="size-3.5 stroke-[3]" />
                  {uk ? 'Додати' : 'Добавить'}
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-1">
                {brands.map((br) => (
                  <div key={br.id} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-bold text-slate-800">{br.name}</p>
                      <p className="text-xs text-slate-400 font-medium">Slug: {br.slug}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                          br.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}
                      >
                        {br.isActive ? 'Active' : 'Hidden'}
                      </span>
                      <button
                        onClick={() => handleEditBrandOpen(br)}
                        className="size-7 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <Edit2 className="size-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────── */}
        {/* REVIEWS TAB */}
        {/* ──────────────────────────────────────────────────────── */}
        {activeTab === 'reviews' && (
          <div className="animate-fade-in bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            {/* Reviews Filter Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <div className="flex flex-wrap gap-2">
                {([
                  { id: 'all', label: uk ? 'Всі відгуки' : 'Все отзывы' },
                  { id: 'pending', label: uk ? 'На модерації' : 'На модерации' },
                  { id: 'visible', label: uk ? 'Схвалені' : 'Одобренные' },
                ] as const).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setReviewsFilter(f.id)}
                    className={`h-8 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      reviewsFilter === f.id
                        ? 'bg-slate-900 text-white font-black'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="text-xs text-slate-400 font-extrabold uppercase">
                {uk ? `Всього знайдено: ${reviewsTotal}` : `Всего найдено: ${reviewsTotal}`}
              </div>
            </div>

            {/* Reviews Grid/List */}
            <div className="flex flex-col gap-6">
              {reviews.map((rev) => {
                const prodName = rev.product?.translations?.[0]?.name ?? rev.product?.slug ?? '—'
                const reviewerName = rev.user?.name ?? '—'
                const reviewerEmail = rev.user?.email ?? '—'
                const createdDate = new Date(rev.createdAt).toLocaleDateString(
                  locale === 'uk' ? 'uk-UA' : 'ru-RU',
                  { day: 'numeric', month: 'long', year: 'numeric' }
                )

                return (
                  <div
                    key={rev.id}
                    className="border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow relative overflow-hidden bg-slate-50/20"
                  >
                    {/* Top Row: User Details, Star Rating & Date */}
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar Letter */}
                        <div className="size-10 rounded-full bg-accent/10 border border-accent/15 text-accent flex items-center justify-center font-black text-sm uppercase">
                          {reviewerName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900">{reviewerName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 tracking-wider">
                                {uk ? 'Купив товар' : 'Купил товар'}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 font-medium">{reviewerEmail}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {/* Stars */}
                        <div className="flex gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`size-4 ${
                                idx < rev.rating ? 'fill-amber-400' : 'text-slate-200 fill-none'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5">{createdDate}</span>
                      </div>
                    </div>

                    {/* Middle Row: Content */}
                    <div className="flex flex-col gap-3">
                      <div>
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                          {uk ? 'Товар' : 'Товар'}
                        </span>
                        <a
                          href={`/${locale}/product/${rev.product?.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-accent hover:underline inline-block"
                        >
                          {prodName}
                        </a>
                      </div>

                      {rev.comment && (
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                            {uk ? 'Коментар' : 'Комментарий'}
                          </span>
                          <p className="text-sm font-semibold text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                            {rev.comment}
                          </p>
                        </div>
                      )}

                      {(rev.advantages || rev.disadvantages) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {rev.advantages && (
                            <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-xl p-3">
                              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block mb-1">
                                {uk ? 'Переваги' : 'Преимущества'}
                              </span>
                              <p className="text-xs font-semibold text-slate-700">{rev.advantages}</p>
                            </div>
                          )}
                          {rev.disadvantages && (
                            <div className="bg-rose-50/30 border border-rose-100/50 rounded-xl p-3">
                              <span className="text-[9px] font-black text-rose-600 uppercase tracking-wider block mb-1">
                                {uk ? 'Недоліки' : 'Недостатки'}
                              </span>
                              <p className="text-xs font-semibold text-slate-700">{rev.disadvantages}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Row: Status Badge & Actions */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1 bg-slate-50/30 -mx-5 -mb-5 px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                            rev.isVisible
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {rev.isVisible
                            ? uk
                              ? 'Схвалено'
                              : 'Одобрено'
                            : uk
                            ? 'На модерації'
                            : 'На модерации'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleReviewVisibility(rev.id)}
                          className={`inline-flex items-center gap-1 h-8 px-3.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                            rev.isVisible
                              ? 'bg-white hover:bg-slate-100 text-amber-700 border border-slate-200'
                              : 'bg-accent hover:bg-accent-hover text-white'
                          }`}
                        >
                          {rev.isVisible
                            ? uk
                              ? 'Приховати'
                              : 'Скрыть'
                            : uk
                            ? 'Схвалити'
                            : 'Одобрить'}
                        </button>

                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="h-8 w-8 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center cursor-pointer transition-all"
                          title={uk ? 'Видалити' : 'Удалить'}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {reviews.length === 0 && (
                <div className="py-12 text-center text-slate-400 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  {uk ? 'Відгуків не знайдено' : 'Отзывов не найдено'}
                </div>
              )}
            </div>

            {/* Reviews Pagination */}
            {reviewsTotal > 15 && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                <span className="text-xs text-slate-500 font-semibold">
                  {uk
                    ? `Сторінка ${reviewsPage} з ${Math.ceil(reviewsTotal / 15)}`
                    : `Страница ${reviewsPage} из ${Math.ceil(reviewsTotal / 15)}`}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={reviewsPage === 1}
                    onClick={() => fetchReviews(reviewsPage - 1)}
                    className="size-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    disabled={reviewsPage >= Math.ceil(reviewsTotal / 15)}
                    onClick={() => fetchReviews(reviewsPage + 1)}
                    className="size-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ──────────────────────────────────────────────────────── */}
        {/* PRODUCT CREATION/EDIT MODAL */}
        {/* ──────────────────────────────────────────────────────── */}
        {productModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-zoom-in">
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                <h3 className="text-base font-black text-slate-950">
                  {editingProduct
                    ? `${uk ? 'Редагувати товар' : 'Редактировать товар'}: ${editingProduct.sku}`
                    : (uk ? 'Додати новий товар' : 'Добавить новый товар')}
                </h3>
                <button
                  onClick={() => setProductModalOpen(false)}
                  className="size-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="p-6 flex flex-col gap-5">
                {/* 2-Col layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">SKU</label>
                    <input
                      type="text"
                      required
                      value={productForm.sku}
                      onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Slug</label>
                    <input
                      type="text"
                      required
                      value={productForm.slug}
                      onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">{uk ? 'Категорія' : 'Категория'}</label>
                    <select
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                    >
                      {categories.map((c) => {
                        const tr = c.translations?.find((t) => t.locale === loc)
                        return (
                          <option key={c.id} value={c.id}>
                            {tr?.name ?? c.slug}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">{uk ? 'Бренд' : 'Бренд'}</label>
                    <select
                      value={productForm.brandId}
                      onChange={(e) => setProductForm({ ...productForm, brandId: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                    >
                      <option value="">—</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">{uk ? 'Ціна (₴)' : 'Цена (₴)'}</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">{uk ? 'Стара ціна (₴)' : 'Старая цена (₴)'}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.comparePrice}
                      onChange={(e) => setProductForm({ ...productForm, comparePrice: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">{uk ? 'Собівартість (₴)' : 'Себестоимость (₴)'}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.costPrice}
                      onChange={(e) => setProductForm({ ...productForm, costPrice: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">{uk ? 'Залишок на складі' : 'Остаток на складе'}</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isActive}
                      onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                      className="size-4 rounded accent-accent"
                    />
                    {uk ? 'Активний (показувати на сайті)' : 'Активен (показывать на сайте)'}
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="size-4 rounded accent-accent"
                    />
                    {uk ? 'Рекомендований (на Головній)' : 'Рекомендуемый (на Главной)'}
                  </label>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-black text-slate-800 mb-2 uppercase tracking-wide">
                    {uk ? 'Український переклад (UK)' : 'Украинский перевод (UK)'}
                  </h4>
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      required
                      placeholder={uk ? 'Назва товару (UK)' : 'Название товара (UK)'}
                      value={productForm.nameUk}
                      onChange={(e) => setProductForm({ ...productForm, nameUk: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                    />
                    <textarea
                      placeholder={uk ? 'Опис товару (UK)' : 'Описание товара (UK)'}
                      value={productForm.descriptionUk}
                      onChange={(e) => setProductForm({ ...productForm, descriptionUk: e.target.value })}
                      rows={3}
                      className="w-full p-3 border border-slate-200 rounded-lg outline-none text-xs font-semibold resize-none"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-black text-slate-800 mb-2 uppercase tracking-wide">
                    {uk ? 'Російський переклад (RU)' : 'Русский перевод (RU)'}
                  </h4>
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      required
                      placeholder={uk ? 'Назва товару (RU)' : 'Название товара (RU)'}
                      value={productForm.nameRu}
                      onChange={(e) => setProductForm({ ...productForm, nameRu: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                    />
                    <textarea
                      placeholder={uk ? 'Опис товару (RU)' : 'Описание товара (RU)'}
                      value={productForm.descriptionRu}
                      onChange={(e) => setProductForm({ ...productForm, descriptionRu: e.target.value })}
                      rows={3}
                      className="w-full p-3 border border-slate-200 rounded-lg outline-none text-xs font-semibold resize-none"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                    {uk ? 'Зображення товару' : 'Изображения товара'}
                  </label>
                  <ImageUploader
                    images={productForm.images}
                    onChange={(newImages) => setProductForm({ ...productForm, images: newImages })}
                  />
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-end gap-3 sticky bottom-0 bg-white py-2">
                  <button
                    type="button"
                    onClick={() => setProductModalOpen(false)}
                    className="h-10 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer transition-colors"
                  >
                    {uk ? 'Скасувати' : 'Отмена'}
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 rounded-xl bg-accent hover:bg-accent-hover text-white font-extrabold text-xs cursor-pointer transition-colors shadow-sm"
                  >
                    {uk ? 'Зберегти' : 'Сохранить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────── */}
        {/* ORDER DETAILS SIDEBAR / DRAWER */}
        {/* ──────────────────────────────────────────────────────── */}
        {orderModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-end">
            <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slide-in overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {uk ? 'Замовлення' : 'Заказ'} <span className="text-accent num font-black">{selectedOrder.number}</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setOrderModalOpen(false)}
                  className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                {/* Status Updater */}
                <div>
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">{uk ? 'Статус замовлення' : 'Статус заказа'}</h4>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].map(
                      (st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Customer Info */}
                {(() => {
                  const client = selectedOrder.customerData as unknown as CustomerData
                  return (
                    <div>
                      <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 pb-1 border-b border-slate-100">{uk ? 'Покупець' : 'Покупатель'}</h4>
                      <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-2 text-xs font-semibold text-slate-700">
                        <div className="flex justify-between">
                          <span className="text-slate-400">{uk ? 'ПІБ' : 'ФИО'}</span>
                          <span className="text-slate-900">
                            {client?.firstName || ''} {client?.lastName || ''}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Email</span>
                          <span className="text-slate-900">{client?.email || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">{uk ? 'Телефон' : 'Телефон'}</span>
                          <span className="text-slate-900 num font-bold">{client?.phone || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">{uk ? 'Адреса' : 'Адрес'}</span>
                          <span className="text-slate-900 text-right max-w-[240px] truncate">
                            {client?.city || ''}, {client?.street || ''} {client?.building || ''}
                            {client?.apartment ? `, кв. ${client.apartment}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })()}

                {/* Order Items */}
                <div>
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 pb-1 border-b border-slate-100">{uk ? 'Товари' : 'Товары'}</h4>
                  <div className="flex flex-col gap-3">
                    {selectedOrder.items?.map((it) => {
                      const snap = it.snapshot as unknown as OrderItemSnapshot
                      return (
                        <div key={it.id} className="flex justify-between items-start gap-4 text-xs">
                          <div>
                            <p className="font-bold text-slate-900">{snap?.name ?? 'Product'}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">SKU: {snap?.sku ?? '—'}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-black text-slate-900 num">{Number(it.price).toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{it.quantity} шт</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Total */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex justify-between items-center text-sm font-extrabold text-slate-800">
                  <span>{uk ? 'Загальна сума:' : 'Общая сумма:'}</span>
                  <span className="text-lg font-black text-accent num">
                    {Number(selectedOrder.total).toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                  </span>
                </div>

                {/* Admin Notes */}
                <div>
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">{uk ? 'Нотатки адміністратора' : 'Заметки администратора'}</h4>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows={4}
                    placeholder={uk ? 'Введіть коментар для цього замовлення...' : 'Введите комментарий для этого заказа...'}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none text-xs font-semibold resize-none focus:border-accent bg-slate-50 focus:bg-white transition-colors"
                  />
                  <button
                    onClick={handleSaveNotes}
                    className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl mt-2 transition-colors cursor-pointer"
                  >
                    {uk ? 'Зберегти нотатку' : 'Сохранить заметку'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────── */}
        {/* CATEGORY DIALOG */}
        {/* ──────────────────────────────────────────────────────── */}
        {categoryModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md animate-zoom-in">
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900">
                  {editingCategory ? (uk ? 'Редагувати категорію' : 'Редактировать категорию') : (uk ? 'Додати категорію' : 'Добавить категорию')}
                </h3>
                <button onClick={() => setCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">{uk ? 'Батьківська категорія' : 'Родительская категория'}</label>
                  <select
                    value={categoryForm.parentId}
                    onChange={(e) => setCategoryForm({ ...categoryForm, parentId: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                  >
                    <option value="">—</option>
                    {categories
                      .filter((c) => c.id !== categoryForm.id)
                      .map((c) => {
                        const tr = c.translations?.find((t) => t.locale === loc)
                        return (
                          <option key={c.id} value={c.id}>
                            {tr?.name ?? c.slug}
                          </option>
                        )
                      })}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">{uk ? 'Сортування' : 'Сортировка'}</label>
                    <input
                      type="number"
                      required
                      value={categoryForm.sortOrder}
                      onChange={(e) => setCategoryForm({ ...categoryForm, sortOrder: Number(e.target.value) })}
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                    />
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-1.5 text-xs font-bold select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categoryForm.isActive}
                        onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                        className="size-4 rounded accent-accent"
                      />
                      {uk ? 'Активна' : 'Активна'}
                    </label>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Назва (UK)</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.nameUk}
                    onChange={(e) => setCategoryForm({ ...categoryForm, nameUk: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Назва (RU)</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.nameRu}
                    onChange={(e) => setCategoryForm({ ...categoryForm, nameRu: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                  />
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCategoryModalOpen(false)}
                    className="h-10 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer"
                  >
                    {uk ? 'Скасувати' : 'Отмена'}
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 rounded-xl bg-accent hover:bg-accent-hover text-white font-extrabold text-xs cursor-pointer shadow-sm"
                  >
                    {uk ? 'Зберегти' : 'Сохранить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ──────────────────────────────────────────────────────── */}
        {/* BRAND DIALOG */}
        {/* ──────────────────────────────────────────────────────── */}
        {brandModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md animate-zoom-in">
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900">
                  {editingBrand ? (uk ? 'Редагувати бренд' : 'Редактировать бренд') : (uk ? 'Додати бренд' : 'Добавить бренд')}
                </h3>
                <button onClick={() => setBrandModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleBrandSubmit} className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={brandForm.slug}
                    onChange={(e) => setBrandForm({ ...brandForm, slug: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">{uk ? 'Назва бренду' : 'Название бренда'}</label>
                  <input
                    type="text"
                    required
                    value={brandForm.name}
                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">{uk ? 'Логотип (URL)' : 'Логотип (URL)'}</label>
                  <input
                    type="text"
                    value={brandForm.logo}
                    onChange={(e) => setBrandForm({ ...brandForm, logo: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold"
                  />
                </div>

                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={brandForm.isActive}
                      onChange={(e) => setBrandForm({ ...brandForm, isActive: e.target.checked })}
                      className="size-4 rounded accent-accent"
                    />
                    {uk ? 'Активний' : 'Активен'}
                  </label>
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setBrandModalOpen(false)}
                    className="h-10 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer"
                  >
                    {uk ? 'Скасувати' : 'Отмена'}
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 rounded-xl bg-accent hover:bg-accent-hover text-white font-extrabold text-xs cursor-pointer shadow-sm"
                  >
                    {uk ? 'Зберегти' : 'Сохранить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
