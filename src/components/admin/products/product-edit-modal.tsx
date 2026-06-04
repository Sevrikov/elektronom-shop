import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { saveProductAdmin } from '@/actions/admin'
import type { AdminProductItem, AdminCategoryItem, AdminBrandItem } from '@/actions/admin'
import { ImageUploader, type ProductImageInput } from '@/components/admin/image-uploader'
import { useTranslations } from 'next-intl'

interface ProductEditModalProps {
  isOpen: boolean
  onClose: () => void
  product: AdminProductItem | null // null means Create mode
  categories: AdminCategoryItem[]
  brands: AdminBrandItem[]
  onSave: (data: Parameters<typeof saveProductAdmin>[0]) => Promise<{ success: boolean; error?: string }>
  locale: string
}

type TabType = 'general' | 'info' | 'prices' | 'stock' | 'media' | 'characteristics' | 'seo' | 'shopping'

export function ProductEditModal({
  isOpen,
  onClose,
  product,
  categories,
  brands,
  onSave,
  locale,
}: ProductEditModalProps) {
  const t = useTranslations('admin.productsTab.editModal')

  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>('general')

  // Form Fields State
  const [sku, setSku] = useState('')
  const [slug, setSlug] = useState('')
  const [nameUk, setNameUk] = useState('')
  const [nameRu, setNameRu] = useState('')
  const [descriptionUk, setDescriptionUk] = useState('')
  const [descriptionRu, setDescriptionRu] = useState('')
  const [price, setPrice] = useState<number>(0)
  const [comparePrice, setComparePrice] = useState<string | number>('')
  const [costPrice, setCostPrice] = useState<string | number>('')
  const [stock, setStock] = useState<number>(0)
  const [categoryId, setCategoryId] = useState('')
  const [brandId, setBrandId] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [images, setImages] = useState<ProductImageInput[]>([])
  
  // SEO tags
  const [metaTitleUk, setMetaTitleUk] = useState('')
  const [metaDescUk, setMetaDescUk] = useState('')
  const [metaTitleRu, setMetaTitleRu] = useState('')
  const [metaDescRu, setMetaDescRu] = useState('')

  // Google Shopping
  const [gtin, setGtin] = useState('')
  const [mpn, setMpn] = useState('')
  const [condition, setCondition] = useState<'NEW' | 'USED' | 'REFURBISHED'>('NEW')
  const [googleProductCategory, setGoogleProductCategory] = useState('')
  const [itemGroupId, setItemGroupId] = useState('')
  const [salePrice, setSalePrice] = useState<string | number>('')
  const [saleStartsAt, setSaleStartsAt] = useState('')
  const [saleEndsAt, setSaleEndsAt] = useState('')

  // Characteristics (Attributes) State
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([])

  // Error / Loading State
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form when opening/editing
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null)
      setActiveTab('general')

      if (product) {
        setSku(product.sku)
        setSlug(product.slug)
        const uTrans = product.translations.find((t) => t.locale === 'uk')
        const rTrans = product.translations.find((t) => t.locale === 'ru')
        setNameUk(uTrans?.name ?? '')
        setNameRu(rTrans?.name ?? '')
        setDescriptionUk(uTrans?.description ?? '')
        setDescriptionRu(rTrans?.description ?? '')
        setMetaTitleUk(uTrans?.metaTitle ?? '')
        setMetaDescUk(uTrans?.metaDesc ?? '')
        setMetaTitleRu(rTrans?.metaTitle ?? '')
        setMetaDescRu(rTrans?.metaDesc ?? '')
        setPrice(Number(product.price))
        setComparePrice(product.comparePrice ? Number(product.comparePrice) : '')
        setCostPrice(product.costPrice ? Number(product.costPrice) : '')
        setStock(product.stock)
        setCategoryId(product.categoryId)
        setBrandId(product.brandId ?? '')
        setIsActive(product.isActive)
        setIsFeatured(product.isFeatured)
        setSortOrder(product.sortOrder)
        setGtin(product.gtin ?? '')
        setMpn(product.mpn ?? '')
        setCondition((product.condition as 'NEW' | 'USED' | 'REFURBISHED') ?? 'NEW')
        setGoogleProductCategory(product.googleProductCategory ?? '')
        setItemGroupId(product.itemGroupId ?? '')
        setSalePrice(product.salePrice ? Number(product.salePrice) : '')
        setSaleStartsAt(product.saleStartsAt ? (new Date(product.saleStartsAt).toISOString().split('T')[0] ?? '') : '')
        setSaleEndsAt(product.saleEndsAt ? (new Date(product.saleEndsAt).toISOString().split('T')[0] ?? '') : '')
        setImages(
          product.images.map((img) => ({
            id: img.id,
            url: img.url,
            processedUrl: img.processedUrl,
            originalUrl: img.originalUrl,
            provider: img.provider as 'LOCAL' | 'CLOUDINARY' | 'EXTERNAL',
            publicId: img.publicId,
            width: img.width,
            height: img.height,
            format: img.format,
            size: img.size,
            alt: img.alt,
            sortOrder: img.sortOrder,
          }))
        )

        // Parse characteristics from dynamic Product.attributes Json
        const rawAttrs = (product.attributes as Record<string, unknown>) || {}
        setAttributes(
          Object.entries(rawAttrs).map(([k, v]) => ({
            key: k,
            value: String(v),
          }))
        )
      } else {
        // Defaults for Create mode
        setSku('')
        setSlug('')
        setNameUk('')
        setNameRu('')
        setDescriptionUk('')
        setDescriptionRu('')
        setMetaTitleUk('')
        setMetaDescUk('')
        setMetaTitleRu('')
        setMetaDescRu('')
        setPrice(0)
        setComparePrice('')
        setCostPrice('')
        setStock(0)
        setCategoryId(categories[0]?.id ?? '')
        setBrandId('')
        setIsActive(true)
        setIsFeatured(false)
        setSortOrder(0)
        setGtin('')
        setMpn('')
        setCondition('NEW')
        setGoogleProductCategory('')
        setItemGroupId('')
        setSalePrice('')
        setSaleStartsAt('')
        setSaleEndsAt('')
        setImages([])
        setAttributes([])
      }
    }
  }, [isOpen, product, categories])

  if (!isOpen) return null

  // Attributes operations
  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: '', value: '' }])
  };

  const handleUpdateAttribute = (
    index: number,
    field: 'key' | 'value',
    val: string
  ) => {
    const updated = [...attributes]
    const item = updated[index]
    if (item) {
      item[field] = val
      setAttributes(updated)
    }
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index))
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsSaving(true)

    // Form attributes array to record conversion
    const attrsRecord: Record<string, string> = {}
    attributes.forEach((attr) => {
      if (attr.key.trim()) {
        attrsRecord[attr.key.trim()] = attr.value
      }
    })

    const payload = {
      id: product?.id,
      sku,
      slug,
      categoryId,
      brandId: brandId || null,
      price,
      comparePrice: comparePrice !== '' ? Number(comparePrice) : null,
      costPrice: costPrice !== '' ? Number(costPrice) : null,
      stock,
      isActive,
      isFeatured,
      sortOrder,
      nameUk,
      descriptionUk,
      metaTitleUk: metaTitleUk || null,
      metaDescUk: metaDescUk || null,
      nameRu,
      descriptionRu,
      metaTitleRu: metaTitleRu || null,
      metaDescRu: metaDescRu || null,
      images,
      attributes: attrsRecord,
      gtin: gtin || null,
      mpn: mpn || null,
      condition,
      googleProductCategory: googleProductCategory || null,
      itemGroupId: itemGroupId || null,
      salePrice: salePrice !== '' ? Number(salePrice) : null,
      saleStartsAt: saleStartsAt ? new Date(saleStartsAt) : null,
      saleEndsAt: saleEndsAt ? new Date(saleEndsAt) : null,
    }

    try {
      const res = await onSave(payload)
      if (res.success) {
        onClose()
      } else {
        setErrorMsg(res.error || 'Failed to save product')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error occurred during save'
      setErrorMsg(msg)
    } finally {
      setIsSaving(false)
    }
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: 'general', label: t('tabGeneral') },
    { key: 'info', label: t('tabInfo') },
    { key: 'prices', label: t('tabPrices') },
    { key: 'stock', label: t('tabStock') },
    { key: 'media', label: t('tabMedia') },
    { key: 'characteristics', label: t('tabCharacteristics') },
    { key: 'seo', label: 'SEO' },
    { key: 'shopping', label: 'Google Shopping' },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-zoom-in">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white shrink-0">
          <h3 className="text-base font-black text-slate-950">
            {product
              ? `${t('titleEdit')}: ${product.sku}`
              : t('titleCreate')}
          </h3>
          <button
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Horizontal scrollable Tab Buttons */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 px-6 overflow-x-auto shrink-0 select-none scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`h-11 px-4 text-xs font-black border-b-2 transition-all cursor-pointer whitespace-nowrap -mb-px flex items-center ${
                activeTab === tab.key
                  ? 'border-accent text-accent'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="bg-rose-50 border-b border-rose-100 px-6 py-3 text-xs font-bold text-rose-700 shrink-0">
            {errorMsg}
          </div>
        )}

        {/* Scrollable Form Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 min-h-0"
        >
          {/* TAB: GENERAL */}
          {activeTab === 'general' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    {t('labelSku')}
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold focus:border-accent bg-slate-50/50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    {t('labelSlug')}
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold focus:border-accent bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  {t('labelNameUk')}
                </label>
                <input
                  type="text"
                  required
                  value={nameUk}
                  onChange={(e) => setNameUk(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold focus:border-accent bg-slate-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  {t('labelNameRu')}
                </label>
                <input
                  type="text"
                  required
                  value={nameRu}
                  onChange={(e) => setNameRu(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold focus:border-accent bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB: INFO */}
          {activeTab === 'info' && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  {t('labelDescUk')}
                </label>
                <textarea
                  value={descriptionUk}
                  onChange={(e) => setDescriptionUk(e.target.value)}
                  rows={6}
                  className="w-full p-3 border border-slate-200 rounded-lg outline-none text-xs font-semibold resize-none focus:border-accent bg-slate-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  {t('labelDescRu')}
                </label>
                <textarea
                  value={descriptionRu}
                  onChange={(e) => setDescriptionRu(e.target.value)}
                  rows={6}
                  className="w-full p-3 border border-slate-200 rounded-lg outline-none text-xs font-semibold resize-none focus:border-accent bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB: PRICES */}
          {activeTab === 'prices' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    {t('labelPrice')}
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold focus:border-accent bg-slate-50/50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    {t('labelComparePrice')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold focus:border-accent bg-slate-50/50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    {t('labelCostPrice')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold focus:border-accent bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: STOCK */}
          {activeTab === 'stock' && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    {t('labelCategory')}
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg bg-slate-50/50 outline-none text-xs font-bold focus:border-accent"
                  >
                    {categories.map((c) => {
                      const tr = c.translations?.find((t) => t.locale === locale)
                      return (
                        <option key={c.id} value={c.id}>
                          {tr?.name ?? c.slug}
                        </option>
                      )
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    {t('labelBrand')}
                  </label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg bg-slate-50/50 outline-none text-xs font-bold focus:border-accent"
                  >
                    <option value="">—</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    {t('labelStock')}
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold focus:border-accent bg-slate-50/50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    {t('labelSortOrder')}
                  </label>
                  <input
                    type="number"
                    required
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold focus:border-accent bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-6 border-t border-slate-100 pt-4">
                <label className="flex items-center gap-2 text-xs font-bold select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="size-4 rounded border-slate-350 accent-accent"
                  />
                  {t('labelActive')}
                </label>
                <label className="flex items-center gap-2 text-xs font-bold select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="size-4 rounded border-slate-350 accent-accent"
                  />
                  {t('labelFeatured')}
                </label>
              </div>
            </div>
          )}

          {/* TAB: MEDIA */}
          {activeTab === 'media' && (
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                {t('labelMedia')}
              </label>
              <ImageUploader
                images={images}
                onChange={(newImages: ProductImageInput[]) => setImages(newImages)}
              />
            </div>
          )}

          {/* TAB: CHARACTERISTICS */}
          {activeTab === 'characteristics' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {t('labelAttrs')}
                </span>
                <button
                  type="button"
                  onClick={handleAddAttribute}
                  className="inline-flex items-center gap-1 h-7 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  <Plus className="size-3.5" />
                  {t('btnAddRow')}
                </button>
              </div>

              <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto pr-1">
                {attributes.map((attr, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder={t('placeholderAttrKey')}
                      value={attr.key}
                      onChange={(e) =>
                        handleUpdateAttribute(index, 'key', e.target.value)
                      }
                      className="flex-1 h-9 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold focus:border-accent"
                    />
                    <input
                      type="text"
                      placeholder={t('placeholderAttrVal')}
                      value={attr.value}
                      onChange={(e) =>
                        handleUpdateAttribute(index, 'value', e.target.value)
                      }
                      className="flex-1 h-9 px-3 border border-slate-200 rounded-lg outline-none text-xs font-semibold focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(index)}
                      className="size-9 rounded-lg hover:bg-rose-50 border border-slate-100 hover:border-rose-200 text-rose-500 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}

                {attributes.length === 0 && (
                  <div className="py-8 text-center text-slate-400 font-bold border border-dashed border-slate-200 rounded-xl">
                    {t('noAttrs')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: SEO */}
          {activeTab === 'seo' && (
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wider">
                Українська версія (UK)
              </h4>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  Meta Title (UK)
                </label>
                <input
                  type="text"
                  value={metaTitleUk}
                  onChange={(e) => setMetaTitleUk(e.target.value)}
                  placeholder="Введіть заголовок для пошукових систем"
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-semibold focus:border-accent bg-slate-50/50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  Meta Description (UK)
                </label>
                <textarea
                  value={metaDescUk}
                  onChange={(e) => setMetaDescUk(e.target.value)}
                  placeholder="Введіть опис для пошукових систем"
                  rows={3}
                  className="w-full p-3 border border-slate-200 rounded-lg outline-none text-xs font-semibold resize-none focus:border-accent bg-slate-50/50 focus:bg-white"
                />
              </div>

              <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wider mt-4">
                Русская версия (RU)
              </h4>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  Meta Title (RU)
                </label>
                <input
                  type="text"
                  value={metaTitleRu}
                  onChange={(e) => setMetaTitleRu(e.target.value)}
                  placeholder="Введите заголовок для поисковых систем"
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-semibold focus:border-accent bg-slate-50/50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  Meta Description (RU)
                </label>
                <textarea
                  value={metaDescRu}
                  onChange={(e) => setMetaDescRu(e.target.value)}
                  placeholder="Введите описание для поисковых систем"
                  rows={3}
                  className="w-full p-3 border border-slate-200 rounded-lg outline-none text-xs font-semibold resize-none focus:border-accent bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB: GOOGLE SHOPPING */}
          {activeTab === 'shopping' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    GTIN (EAN/UPC)
                  </label>
                  <input
                    type="text"
                    value={gtin}
                    onChange={(e) => setGtin(e.target.value)}
                    placeholder="EAN-13, UPC, etc."
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-semibold focus:border-accent bg-slate-50/50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    MPN (Manufacturer Part Number)
                  </label>
                  <input
                    type="text"
                    value={mpn}
                    onChange={(e) => setMpn(e.target.value)}
                    placeholder="Артикул виробника"
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-semibold focus:border-accent bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    Condition (Стан)
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as 'NEW' | 'USED' | 'REFURBISHED')}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg bg-slate-50/50 outline-none text-xs font-bold focus:border-accent"
                  >
                    <option value="NEW">New (Новий)</option>
                    <option value="USED">Used (Вживаний)</option>
                    <option value="REFURBISHED">Refurbished (Відновлений)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    Google Product Category
                  </label>
                  <input
                    type="text"
                    value={googleProductCategory}
                    onChange={(e) => setGoogleProductCategory(e.target.value)}
                    placeholder="ID або шлях (напр. 604 або Аппаратура)"
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-semibold focus:border-accent bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    Item Group ID (Група товарів)
                  </label>
                  <input
                    type="text"
                    value={itemGroupId}
                    onChange={(e) => setItemGroupId(e.target.value)}
                    placeholder="ID для зв'язку кольорів/варіантів"
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-semibold focus:border-accent bg-slate-50/50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    Sale Price (Акційна ціна)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="Ціна під час акції"
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-bold focus:border-accent bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    Sale Starts At (Початок акції)
                  </label>
                  <input
                    type="date"
                    value={saleStartsAt}
                    onChange={(e) => setSaleStartsAt(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-semibold focus:border-accent bg-slate-50/50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                    Sale Ends At (Кінець акції)
                  </label>
                  <input
                    type="date"
                    value={saleEndsAt}
                    onChange={(e) => setSaleEndsAt(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg outline-none text-xs font-semibold focus:border-accent bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sticky footer buttons inside dialog */}
          <div className="border-t border-slate-100 pt-4 flex justify-end gap-3 bg-white mt-auto sticky bottom-0 z-10 py-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer transition-colors"
            >
              {t('btnCancel')}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-10 px-6 rounded-xl bg-accent hover:bg-accent-hover text-white font-extrabold text-xs cursor-pointer transition-colors shadow-sm disabled:opacity-50"
            >
              {isSaving ? t('btnSaving') : t('btnSave')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
