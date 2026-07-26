// components/product/product-attributes.tsx
// Server Component — таблица характеристик из JSONB attributes

interface ProductAttributesProps {
  attributes: Record<string, unknown>
  locale?: string
}

import { translateAttributeKey, translateAttributeValue } from '@/lib/translit-translator'

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
  if (value === null || value === undefined) return '—'
  return translateAttributeValue(value, locale === 'ru' ? 'ru' : 'uk')
}

export function ProductAttributes({ attributes, locale }: ProductAttributesProps) {
  // Фильтруем только технические характеристики (исключаем рекламные переваги и непустые значения)
  const entries = Object.entries(attributes).filter(
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

  return (
    <section className="bg-surface-white border border-border rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">
        {title}
      </h2>
      <div className="rounded-lg overflow-hidden border border-border">
        <table className="w-full text-sm">
          <tbody>
            {entries.map(([key, value]) => (
              <tr
                key={key}
                className="bg-surface-white odd:bg-surface-alt border-b border-border last:border-b-0"
              >
                <td className="px-4 py-2.5 font-medium w-1/3 text-text-muted break-words">
                  {getLabel(key, locale)}
                </td>
                <td className="px-4 py-2.5 num text-text-primary w-2/3 break-words">
                  {formatValue(key, value, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
