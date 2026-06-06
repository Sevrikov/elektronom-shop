'use client'

import { useEffect, useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Scale } from 'lucide-react'
import { useCompareStore } from '@/store/compare-store'
import { getCompareData } from '@/actions/compare'
import { CompareTable, type CompareProduct, type CompareColumn } from './compare-table'

interface CompareDrawerProps {
  locale: 'uk' | 'ru'
}

export function CompareDrawer({ locale }: CompareDrawerProps) {
  const isOpen = useCompareStore((s) => s.isOpen)
  const items = useCompareStore((s) => s.items)
  const close = useCompareStore((s) => s.close)
  const clear = useCompareStore((s) => s.clear)

  const [data, setData] = useState<{ products: CompareProduct[]; columns: CompareColumn[] } | null>(null)
  const [isPending, startTransition] = useTransition()

  // Track the product IDs currently in comparison
  const productIds = items.map((i) => i.id)
  const productIdsKey = productIds.join(',')

  useEffect(() => {
    if (!isOpen) return

    if (productIds.length === 0) {
      setData({ products: [], columns: [] })
      return
    }

    startTransition(async () => {
      try {
        const result = await getCompareData(productIds, locale)
        setData(result)
      } catch (err) {
        console.error('Failed to load comparison data:', err)
      }
    })
  }, [productIdsKey, isOpen, locale])

  // Prevent scroll on body when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[100] cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 h-full w-full sm:w-[500px] md:w-[700px] lg:w-[800px] xl:w-[900px] bg-surface-white z-[101] shadow-2xl flex flex-col border-l border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Scale className="size-5 text-accent" />
                <h2 className="text-base font-bold text-text-primary">
                  {locale === 'uk' ? 'Порівняння товарів' : 'Сравнение товаров'}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-surface-alt font-semibold text-text-muted">
                  {items.length}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <button
                    onClick={clear}
                    className="text-xs font-semibold text-destructive hover:underline cursor-pointer"
                  >
                    {locale === 'uk' ? 'Очистити все' : 'Очистить всё'}
                  </button>
                )}
                <button
                  onClick={close}
                  className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-alt transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0 flex flex-col">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="size-16 rounded-full bg-surface-alt flex items-center justify-center text-text-muted mb-4 border border-border">
                    <Scale className="size-8" />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">
                    {locale === 'uk' ? 'Список порівняння порожній' : 'Список сравнения пуст'}
                  </h3>
                  <p className="text-xs text-text-muted max-w-xs mb-4">
                    {locale === 'uk'
                      ? 'Додайте товари зі сторінки каталогу, наводячи мишкою та натискаючи на іконку терезів.'
                      : 'Добавьте товары со страницы каталога, наводя мышку и нажимая на иконку весов.'}
                  </p>
                  <button
                    onClick={close}
                    className="px-4 py-2 text-xs font-semibold bg-accent text-white rounded-md hover:bg-accent-strong transition-colors cursor-pointer"
                  >
                    {locale === 'uk' ? 'Повернутися до покупок' : 'Вернуться к покупкам'}
                  </button>
                </div>
              ) : isPending || !data ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <div className="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-xs text-text-muted">
                    {locale === 'uk' ? 'Завантаження характеристик...' : 'Загрузка характеристик...'}
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-0">
                  <CompareTable products={data.products} columns={data.columns} locale={locale} />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
