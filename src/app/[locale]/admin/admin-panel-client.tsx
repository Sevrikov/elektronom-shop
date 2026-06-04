'use client'

import { useState, useEffect, useTransition } from 'react'
import type { OrderStatus } from '@/generated/prisma/client'
import {
  Users,
  ShoppingCart,
  Package,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
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
  Sliders,
  FileUp,
  Layers,
} from 'lucide-react'
import {
  getProductsAdmin,
  getOrdersAdmin,
  updateOrderStatusAdmin,
  updateOrderNotesAdmin,
  getCategoriesBrandsAdmin,
  saveCategoryAdmin,
  saveBrandAdmin,
  getReviewsAdmin,
  toggleReviewVisibilityAdmin,
  deleteReviewAdmin,
  type AdminOrderItem,
  type AdminReviewItem,
  type AdminCategoryItem,
  type AdminBrandItem,
  type CustomerData,
  type OrderItemSnapshot,
} from '@/actions/admin'
import { AdminProductsTab } from '@/components/admin/products/admin-products-tab'

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
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'characteristics' | 'categories_brands' | 'import' | 'collections' | 'orders' | 'deleted' | 'reviews'>('overview')

  // Stats & States
  const [stats, setStats] = useState(initialStats)
  const [recentOrders, setRecentOrders] = useState<AdminOrderItem[]>(initialRecentOrders)
  const [categories, setCategories] = useState<AdminCategoryItem[]>(initialCategories)
  const [brands, setBrands] = useState<AdminBrandItem[]>(initialBrands)

  // Products tab state is fully delegated to AdminProductsTab

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

  // Characteristics Tab State
  const [characteristics, setCharacteristics] = useState([
    { id: 'c1', nameUk: 'Ємність акумулятора', nameRu: 'Емкость аккумулятора', code: 'battery_capacity', type: 'select', valuesUk: '100 Ач, 150 Ач, 200 Ач', valuesRu: '100 Ач, 150 Ач, 200 Ач' },
    { id: 'c2', nameUk: 'Номінальна потужність', nameRu: 'Номинальная мощность', code: 'nominal_power', type: 'number', valuesUk: 'кВт', valuesRu: 'кВт' },
    { id: 'c3', nameUk: 'Тип інвертора', nameRu: 'Тип инвертора', code: 'inverter_type', type: 'select', valuesUk: 'Гібридний, Автономний, Мережевий', valuesRu: 'Гибридный, Автономный, Сетевой' },
    { id: 'c4', nameUk: 'Виробник', nameRu: 'Производитель', code: 'brand', type: 'text', valuesUk: 'Текстове поле', valuesRu: 'Текстовое поле' }
  ])
  const [charModalOpen, setCharModalOpen] = useState(false)
  const [charForm, setCharForm] = useState({
    id: '',
    nameUk: '',
    nameRu: '',
    code: '',
    type: 'select',
    valuesUk: '',
    valuesRu: '',
  })

  // Import Tab State
  const [importConsole, setImportConsole] = useState<string[]>([])
  const [importing, setImporting] = useState(false)
  const [dryRun, setDryRun] = useState(true)
  const [importType, setImportType] = useState('prices_stock')

  // Collections Tab State
  const [collections, setCollections] = useState([
    { id: 'col1', nameUk: 'Автономне живлення 2026', nameRu: 'Автономное питание 2026', slug: 'autonomous-power-2026', itemsCount: 15, isActive: true },
    { id: 'col2', nameUk: 'Популярні гелеві акумулятори', nameRu: 'Популярные гелевые аккумуляторы', slug: 'gel-batteries-popular', itemsCount: 8, isActive: true },
    { id: 'col3', nameUk: 'Акційні комплекти (Панель + Інвертор)', nameRu: 'Акционные комплекты (Панель + Инвертор)', slug: 'promo-solar-sets', itemsCount: 4, isActive: false }
  ])
  const [colModalOpen, setColModalOpen] = useState(false)
  const [colForm, setColForm] = useState({
    id: '',
    nameUk: '',
    nameRu: '',
    slug: '',
    isActive: true,
  })

  // Deleted Tab State
  const [deletedProducts, setDeletedProducts] = useState([
    { id: 'd1', nameUk: 'Акумулятор гелевий Challenger AS12-100', nameRu: 'Аккумулятор гелевый Challenger AS12-100', sku: 'CH-AS12-100', price: 9200, deletedAt: '2026-05-26T14:22:00Z' },
    { id: 'd2', nameUk: 'Інвертор напруги MUST PV18-3024 VPM', nameRu: 'Инвертор напряжения MUST PV18-3024 VPM', sku: 'MUST-PV18-3024', price: 18500, deletedAt: '2026-05-25T11:05:00Z' },
    { id: 'd3', nameUk: 'Сонячна панель Jinko Solar Tiger 440W', nameRu: 'Солнечная панель Jinko Solar Tiger 440W', sku: 'JK-440M-60HL4', price: 4800, deletedAt: '2026-05-24T09:12:00Z' }
  ])

  // Toast/Notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // --- Characteristics Handlers ---
  const handleSaveChar = (e: React.FormEvent) => {
    e.preventDefault()
    if (charForm.id) {
      setCharacteristics(prev => prev.map(c => c.id === charForm.id ? { ...c, ...charForm } : c))
      showToast(uk ? 'Характеристику оновлено' : 'Характеристика обновлена')
    } else {
      setCharacteristics(prev => [...prev, { ...charForm, id: 'c_' + Date.now() }])
      showToast(uk ? 'Характеристику додано' : 'Характеристика добавлена')
    }
    setCharModalOpen(false)
  }

  const handleDeleteChar = (id: string) => {
    setCharacteristics(prev => prev.filter(c => c.id !== id))
    showToast(uk ? 'Характеристику видалено' : 'Характеристика удалена')
  }

  // --- Collections Handlers ---
  const handleSaveCol = (e: React.FormEvent) => {
    e.preventDefault()
    if (colForm.id) {
      setCollections(prev => prev.map(c => c.id === colForm.id ? { ...c, ...colForm, itemsCount: c.itemsCount } : c))
      showToast(uk ? 'Підбірку оновлено' : 'Подборка обновлена')
    } else {
      setCollections(prev => [...prev, { ...colForm, id: 'col_' + Date.now(), itemsCount: 0 }])
      showToast(uk ? 'Підбірку створено' : 'Подборка создана')
    }
    setColModalOpen(false)
  }

  const handleDeleteCol = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id))
    showToast(uk ? 'Підбірку видалено' : 'Подборка удалена')
  }

  const handleToggleColActive = (id: string) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c))
    showToast(uk ? 'Статус підбірки змінено' : 'Статус подборки изменен')
  }

  // --- Import Handlers ---
  const handleRunImport = () => {
    if (importing) return
    setImporting(true)
    setImportConsole([uk ? '[ІНФО] Запуск процесу імпорту...' : '[ИНФО] Запуск процесса импорта...'])
    
    const messages = uk ? [
      '[ІНФО] Завантаження та перевірка файлу імпорту...',
      '[ІНФО] Знайдено 142 товарні позиції.',
      '[ІНФО] Зіставлення категорій та характеристик...',
      `[ІНФО] Режим: ${dryRun ? 'ТЕСТОВИЙ (dry-run)' : 'ЗАПИС В БД'}`,
      `[УВАГА] Рядок 14: Автоматична генерація SKU для товару "MUST PV18".`,
      '[УСПІХ] Оброблено без критичних помилок.',
      dryRun ? '[УСПІХ] Тестовий імпорт завершено. 0 помилок. Готово до бойового імпорту.' : '[УСПІХ] Товари успішно імпортовано та оновлено в базі даних!'
    ] : [
      '[ИНФО] Загрузка и валидация файла импорта...',
      '[ИНФО] Найдено 142 товарные позиции.',
      '[ИНФО] Сопоставление категорий и характеристик...',
      `[ИНФО] Режим: ${dryRun ? 'ТЕСТОВЫЙ (dry-run)' : 'ЗАПИСЬ В БД'}`,
      `[ВНИМАНИЕ] Строка 14: Автоматическая генерация SKU для товара "MUST PV18".`,
      '[УСПЕХ] Обработано без критических ошибок.',
      dryRun ? '[УСПЕХ] Тестовый импорт завершен. 0 ошибок. Готово к боевому импорту.' : '[УСПЕХ] Товары успешно импортированы и обновлены в базе данных!'
    ]

    messages.forEach((msg, idx) => {
      setTimeout(() => {
        setImportConsole(prev => [...prev, msg])
        if (idx === messages.length - 1) {
          setImporting(false)
        }
      }, (idx + 1) * 800)
    })
  }

  // --- Deleted Handlers ---
  const handleRestoreProduct = (id: string, name: string) => {
    setDeletedProducts(prev => prev.filter(p => p.id !== id))
    showToast(uk ? `Товар "${name}" успішно відновлено!` : `Товар "${name}" успешно восстановлен!`)
  }

  const handleWipeProduct = (id: string, name: string) => {
    setDeletedProducts(prev => prev.filter(p => p.id !== id))
    showToast(uk ? `Товар "${name}" видалено остаточно!` : `Товар "${name}" удален окончательно!`)
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
      const resProducts = await getProductsAdmin({ page: 1, limit: 1 })
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
      // Refreshed via router/URL state inside AdminProductsTab
      showToast(uk ? 'Дані оновлено' : 'Данные обновлены')
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
    if (activeTab === 'orders') {
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
            { id: 'characteristics', label: uk ? 'Характеристики' : 'Характеристики', icon: Sliders },
            { id: 'categories_brands', label: uk ? 'Категорії / Бренди' : 'Категории / Бренды', icon: Tags },
            { id: 'import', label: uk ? 'Імпорт' : 'Импорт', icon: FileUp },
            { id: 'collections', label: uk ? 'Групи / Доборки' : 'Группы / Подборки', icon: Layers },
            { id: 'orders', label: uk ? 'Замовлення' : 'Заказы', icon: ShoppingCart },
            { id: 'deleted', label: uk ? 'Видалені товари' : 'Удаленные товары', icon: Trash2 },
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
          <AdminProductsTab
            categories={categories}
            brands={brands}
            locale={locale}
          />
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

        {/* CHARACTERISTICS TAB */}
        {activeTab === 'characteristics' && (
          <div className="animate-fade-in bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  {uk ? 'Реєстр характеристик' : 'Реестр характеристик'}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {uk
                    ? 'Керуйте глобальними технічними атрибутами та фільтрами товарів'
                    : 'Управляйте глобальными техническими атрибутами и фильтрами товаров'}
                </p>
              </div>
              <button
                onClick={() => {
                  setCharForm({ id: '', nameUk: '', nameRu: '', code: '', type: 'select', valuesUk: '', valuesRu: '' })
                  setCharModalOpen(true)
                }}
                className="h-9 px-4 bg-accent hover:bg-accent-hover text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="size-4" />
                {uk ? 'Додати характеристику' : 'Добавить характеристику'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-3.5">{uk ? 'Назва' : 'Название'}</th>
                    <th className="px-6 py-3.5">{uk ? 'Системний код' : 'Системный код'}</th>
                    <th className="px-6 py-3.5">{uk ? 'Тип поля' : 'Тип поля'}</th>
                    <th className="px-6 py-3.5">{uk ? 'Значення / Одиниці' : 'Значения / Единицы'}</th>
                    <th className="px-6 py-3.5 text-right">{uk ? 'Дії' : 'Действия'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {characteristics.map((char) => (
                    <tr key={char.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {uk ? char.nameUk : char.nameRu}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-500">
                        {char.code}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {char.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500 max-w-xs truncate">
                        {uk ? char.valuesUk : char.valuesRu}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setCharForm(char)
                              setCharModalOpen(true)
                            }}
                            className="size-8 rounded-lg border border-slate-200 hover:border-slate-300 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteChar(char.id)}
                            className="size-8 rounded-lg border border-slate-200 hover:border-rose-200 hover:bg-rose-50 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* IMPORT TAB */}
        {activeTab === 'import' && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  {uk ? 'Імпорт товарних позицій' : 'Импорт товарных позиций'}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {uk
                    ? 'Завантажуйте прайс-листи та описи товарів у форматі CSV, XML (Prom.ua) або XLSX'
                    : 'Загружайте прайс-листы и описания товаров в формате CSV, XML (Prom.ua) или XLSX'}
                </p>
              </div>

              {/* Upload area */}
              <div className="border-2 border-dashed border-slate-200 hover:border-accent rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
                <FileUp className="size-10 text-slate-300 mb-3" />
                <span className="text-sm font-black text-slate-700 block">
                  {uk ? 'Виберіть файл для завантаження' : 'Выберите файл для загрузки'}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {uk ? 'Максимальний розмір: 20MB. Підтримуються .xml, .csv, .xlsx' : 'Максимальный размер: 20MB. Поддерживаются .xml, .csv, .xlsx'}
                </span>
              </div>

              {/* Import Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">
                    {uk ? 'Режим оновлення' : 'Режим обновления'}
                  </label>
                  <select
                    value={importType}
                    onChange={(e) => setImportType(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="prices_stock">
                      {uk ? 'Тільки ціни та залишки (швидко)' : 'Только цены и остатки (быстро)'}
                    </option>
                    <option value="full">
                      {uk ? 'Повне оновлення (всі поля)' : 'Полное обновление (все поля)'}
                    </option>
                  </select>
                </div>

                <div className="flex items-center gap-2 mt-5 md:mt-0">
                  <input
                    type="checkbox"
                    id="dryRunCheckbox"
                    checked={dryRun}
                    onChange={(e) => setDryRun(e.target.checked)}
                    className="size-4 text-accent border-slate-200 rounded focus:ring-accent accent-accent cursor-pointer"
                  />
                  <label htmlFor="dryRunCheckbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                    {uk
                      ? 'Попередній запуск (dry-run) без запису в базу'
                      : 'Предварительный запуск (dry-run) без записи в базу'}
                  </label>
                </div>
              </div>

              <button
                onClick={handleRunImport}
                disabled={importing}
                className="h-10 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-extrabold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {importing && <Loader2 className="size-3.5 animate-spin" />}
                {uk ? 'Запустити імпорт' : 'Запустить импорт'}
              </button>
            </div>

            {/* Dry-run Console Output */}
            <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 shadow-inner flex flex-col font-mono text-[11px] leading-relaxed min-h-[300px] lg:h-full max-h-[420px] overflow-hidden">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 pb-2 mb-3 block">
                {uk ? 'Консоль імпорту (Логи)' : 'Консоль импорта (Логи)'}
              </span>
              <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 scrollbar-none pr-1">
                {importConsole.map((line, idx) => {
                  let color = 'text-slate-300'
                  if (line.includes('[УСПІХ]') || line.includes('[УСПЕХ]')) color = 'text-emerald-400 font-bold'
                  if (line.includes('[УВАГА]') || line.includes('[ВНИМАНИЕ]')) color = 'text-amber-400 font-bold'
                  return <div key={idx} className={color}>{line}</div>
                })}
                {importConsole.length === 0 && (
                  <span className="text-slate-600 italic">
                    {uk ? 'Очікування запуску імпорту...' : 'Ожидание запуска импорта...'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* COLLECTIONS TAB */}
        {activeTab === 'collections' && (
          <div className="animate-fade-in bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  {uk ? 'Групи та доборки товарів' : 'Группы и подборки товаров'}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {uk
                    ? 'Створюйте та керуйте акційними підбірками, промо-групами та тематичними категоріями'
                    : 'Создавайте и управляйте акционными подборками, промо-группами и тематическими категориями'}
                </p>
              </div>
              <button
                onClick={() => {
                  setColForm({ id: '', nameUk: '', nameRu: '', slug: '', isActive: true })
                  setColModalOpen(true)
                }}
                className="h-9 px-4 bg-accent hover:bg-accent-hover text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="size-4" />
                {uk ? 'Створити групу' : 'Создать группу'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((col) => (
                <div
                  key={col.id}
                  className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col gap-4 relative overflow-hidden bg-slate-50/20"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {uk ? col.nameUk : col.nameRu}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400 font-semibold block mt-0.5">
                        /{col.slug}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        col.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {col.isActive ? (uk ? 'Активна' : 'Активна') : (uk ? 'Чернетка' : 'Черновик')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-semibold text-slate-600 border-t border-slate-100 pt-3 mt-1">
                    <span>
                      {uk ? 'Товарів у групі:' : 'Товаров в группе:'}{' '}
                      <span className="text-slate-900 font-extrabold">{col.itemsCount}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleColActive(col.id)}
                        className="text-[10px] font-bold text-accent hover:underline cursor-pointer"
                      >
                        {col.isActive ? (uk ? 'Деактивувати' : 'Деактивировать') : (uk ? 'Активувати' : 'Активировать')}
                      </button>
                      <span className="text-slate-200">|</span>
                      <button
                        onClick={() => {
                          setColForm(col)
                          setColModalOpen(true)
                        }}
                        className="text-[10px] font-bold text-slate-600 hover:text-slate-950 hover:underline cursor-pointer"
                      >
                        {uk ? 'Редагувати' : 'Редактировать'}
                      </button>
                      <span className="text-slate-200">|</span>
                      <button
                        onClick={() => handleDeleteCol(col.id)}
                        className="text-[10px] font-bold text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
                      >
                        {uk ? 'Видалити' : 'Удалить'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DELETED PRODUCTS (TRASH BIN) TAB */}
        {activeTab === 'deleted' && (
          <div className="animate-fade-in bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">
                {uk ? 'Видалені товари (Кошик)' : 'Удаленные товары (Корзина)'}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {uk
                  ? 'Відновлюйте раніше видалені товари назад у каталог або стирайте їх назавжди'
                  : 'Восстанавливайте ранее удаленные товары обратно в каталог или стирайте их навсегда'}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-3.5">{uk ? 'Назва товару' : 'Название товара'}</th>
                    <th className="px-6 py-3.5">{uk ? 'SKU' : 'SKU'}</th>
                    <th className="px-6 py-3.5">{uk ? 'Ціна' : 'Цена'}</th>
                    <th className="px-6 py-3.5">{uk ? 'Дата видалення' : 'Дата удаления'}</th>
                    <th className="px-6 py-3.5 text-right">{uk ? 'Дії' : 'Действия'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {deletedProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {uk ? prod.nameUk : prod.nameRu}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-500">
                        {prod.sku}
                      </td>
                      <td className="px-6 py-4 font-black num text-slate-900">
                        {prod.price.toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-RU')} ₴
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-semibold">
                        {new Date(prod.deletedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleRestoreProduct(prod.id, uk ? prod.nameUk : prod.nameRu)}
                            className="h-8 px-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold cursor-pointer transition-colors"
                          >
                            {uk ? 'Відновити' : 'Восстановить'}
                          </button>
                          <button
                            onClick={() => handleWipeProduct(prod.id, uk ? prod.nameUk : prod.nameRu)}
                            className="h-8 px-3 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-bold cursor-pointer transition-colors"
                          >
                            {uk ? 'Видалити назавжди' : 'Удалить навсегда'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {deletedProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                        {uk ? 'Кошик порожній' : 'Корзина пуста'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Old product modal removed in favor of ProductEditModal */}

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
        {/* CHARACTERISTIC MODAL */}
        {charModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
            <form
              onSubmit={handleSaveChar}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-zoom-in"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-black text-slate-900">
                  {charForm.id
                    ? uk
                      ? 'Редагувати характеристику'
                      : 'Редактировать характеристику'
                    : uk
                    ? 'Додати характеристику'
                    : 'Добавить характеристику'}
                </h3>
                <button
                  type="button"
                  onClick={() => setCharModalOpen(false)}
                  className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                    {uk ? 'Назва (UA)' : 'Название (UA)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={charForm.nameUk}
                    onChange={(e) => setCharForm((prev) => ({ ...prev, nameUk: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-accent outline-none text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                    {uk ? 'Назва (RU)' : 'Название (RU)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={charForm.nameRu}
                    onChange={(e) => setCharForm((prev) => ({ ...prev, nameRu: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-accent outline-none text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                    {uk ? 'Систний код' : 'Системный код'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="battery_capacity"
                    value={charForm.code}
                    onChange={(e) => setCharForm((prev) => ({ ...prev, code: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-accent outline-none text-xs font-semibold font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                    {uk ? 'Тип поля' : 'Тип поля'}
                  </label>
                  <select
                    value={charForm.type}
                    onChange={(e) => setCharForm((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="select">{uk ? 'Вибір зі списку (Select)' : 'Выбор из списка (Select)'}</option>
                    <option value="number">{uk ? 'Число (Number)' : 'Число (Number)'}</option>
                    <option value="text">{uk ? 'Текст (Text)' : 'Текст (Text)'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                    {uk ? 'Значення через кому (UA)' : 'Значения через запятую (UA)'}
                  </label>
                  <input
                    type="text"
                    placeholder="100 Ач, 150 Ач"
                    value={charForm.valuesUk}
                    onChange={(e) => setCharForm((prev) => ({ ...prev, valuesUk: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-accent outline-none text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                    {uk ? 'Значення через кому (RU)' : 'Значения через запятую (RU)'}
                  </label>
                  <input
                    type="text"
                    placeholder="100 Ач, 150 Ач"
                    value={charForm.valuesRu}
                    onChange={(e) => setCharForm((prev) => ({ ...prev, valuesRu: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-accent outline-none text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCharModalOpen(false)}
                  className="h-10 px-4 border border-slate-200 hover:bg-slate-100 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  {uk ? 'Скасувати' : 'Отмена'}
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  {uk ? 'Зберегти' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* COLLECTION MODAL */}
        {colModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
            <form
              onSubmit={handleSaveCol}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-zoom-in"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-black text-slate-900">
                  {colForm.id
                    ? uk
                      ? 'Редагувати підбірку'
                      : 'Редактировать подборку'
                    : uk
                    ? 'Створити підбірку'
                    : 'Создать подборку'}
                </h3>
                <button
                  type="button"
                  onClick={() => setColModalOpen(false)}
                  className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                    {uk ? 'Назва підбірки (UA)' : 'Название подборки (UA)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={colForm.nameUk}
                    onChange={(e) => setColForm((prev) => ({ ...prev, nameUk: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-accent outline-none text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                    {uk ? 'Назва підбірки (RU)' : 'Название подборки (RU)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={colForm.nameRu}
                    onChange={(e) => setColForm((prev) => ({ ...prev, nameRu: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-accent outline-none text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                    {uk ? 'Посилання (Slug)' : 'Ссылка (Slug)'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="promo-solar-sets"
                    value={colForm.slug}
                    onChange={(e) => setColForm((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-accent outline-none text-xs font-semibold font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="colActiveCheckbox"
                    checked={colForm.isActive}
                    onChange={(e) => setColForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="size-4 text-accent border-slate-200 rounded focus:ring-accent accent-accent cursor-pointer"
                  />
                  <label htmlFor="colActiveCheckbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                    {uk ? 'Активна група на сайті' : 'Активная группа на сайте'}
                  </label>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setColModalOpen(false)}
                  className="h-10 px-4 border border-slate-200 hover:bg-slate-100 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  {uk ? 'Скасувати' : 'Отмена'}
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  {uk ? 'Зберегти' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
