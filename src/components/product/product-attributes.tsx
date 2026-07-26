// components/product/product-attributes.tsx
// Server Component — таблица характеристик из JSONB attributes (в два столбика)

interface ProductAttributesProps {
  attributes: Record<string, unknown>
  locale?: string
}

import { sortAttributeEntries, translateAttributeKey, translateAttributeValue } from '@/lib/translit-translator'

function getLabel(key: string, locale?: string): string {
  return translateAttributeKey(key, locale === 'ru' ? 'ru' : 'uk')
}

function formatValue(key: string, value: unknown, locale?: string): string {
  if (key === 'qty_breaks' && Array.isArray(value)) {
    const fromLabel = locale === 'ru' ? 'от' : 'від'
    return value
      .map((tier: { min?: number; discount?: number }) =>
        `${fromLabel} ${tier.min ?? '?'} шт — −${tier.discount ?? '?'}%`
      )
      .join(', ')
  }
  if (typeof value === 'boolean') {
    if (locale === 'ru') return value ? 'Да' : 'Нет'
    return value ? 'Так' : 'Ні'
  }
  return translateAttributeValue(value, locale === 'ru' ? 'ru' : 'uk')
}

export function ProductAttributes({ attributes, locale }: ProductAttributesProps) {
  // 1. Сначала сортируем по приоритету и удаляем дубликаты
  const sortedEntries = sortAttributeEntries(Object.entries(attributes), locale === 'ru' ? 'ru' : 'uk')

  // 2. Фильтруем только технические характеристики (исключаем рекламные переваги и пустые значения)
  const entries = sortedEntries.filter(
    ([key, value]) =>
      !key.toLowerCase().includes('perevaha') &&
      value !== null &&
      value !== undefined &&
      value !== ''
  )

  if (entries.length === 0) return null

  const titleUk = 'Характеристики'
  const titleRu = 'Характеристики'
  const title = locale === 'ru' ? titleRu : titleUk

  // Разделение на 2 столбика при достаточном количестве атрибутов
  const useTwoCols = entries.length >= 4
  const half = useTwoCols ? Math.ceil(entries.length / 2) : entries.length
  const col1 = entries.slice(0, half)
  const col2 = useTwoCols ? entries.slice(half) : []

  const renderTable = (items: typeof entries) => (
    <div className="rounded-lg overflow-hidden border border-border">
      <table className="w-full text-sm">
        <tbody>
          {items.map(([key, value]) => (
            <tr
              key={key}
              className="bg-surface-white odd:bg-surface-alt border-b border-border last:border-b-0"
            >
              <td className="px-3.5 py-2.5 font-medium w-1/2 text-text-muted break-words">
                {getLabel(key, locale)}
              </td>
              <td className="px-3.5 py-2.5 num font-semibold text-text-primary w-1/2 break-words text-right">
                {formatValue(key, value, locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <section id="specs" className="scroll-mt-[120px] bg-surface-white border border-border rounded-2xl p-5 shadow-sm">
      <h2 className="text-xl font-extrabold tracking-tight mb-4 text-text-primary">
        {title}
      </h2>
      
      {useTwoCols ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {renderTable(col1)}
          {col2.length > 0 && renderTable(col2)}
        </div>
      ) : (
        renderTable(col1)
      )}
    </section>
  )
}
