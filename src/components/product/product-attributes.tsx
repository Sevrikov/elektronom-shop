// components/product/product-attributes.tsx
// Server Component — таблица характеристик из JSONB attributes

interface ProductAttributesProps {
  attributes: Record<string, unknown>
  locale?: string
}

// Словарь читаемых названий атрибутов (uk)
const ATTR_LABELS_UK: Record<string, string> = {
  poles: 'Кількість полюсів',
  rating_a: 'Номінальний струм, А',
  breaking_ka: 'Відключна здатність, кА',
  voltage_v: 'Номінальна напруга, В',
  curve: 'Характеристика спрацювання',
  color: 'Колір',
  size: 'Розмір',
  weight_kg: 'Маса, кг',
  material: 'Матеріал',
  ip_class: 'Ступінь захисту IP',
  power_w: 'Потужність, Вт',
  frequency_hz: 'Частота, Гц',
  phase: 'Кількість фаз',
  mounting: 'Спосіб монтажу',
  cross_section_mm2: 'Переріз, мм²',
  length_m: 'Довжина, м',
  qty_breaks: 'Оптові ціни',
}

const ATTR_LABELS_RU: Record<string, string> = {
  poles: 'Количество полюсов',
  rating_a: 'Номинальный ток, А',
  breaking_ka: 'Отключающая способность, кА',
  voltage_v: 'Номинальное напряжение, В',
  curve: 'Характеристика срабатывания',
  color: 'Цвет',
  size: 'Размер',
  weight_kg: 'Масса, кг',
  material: 'Материал',
  ip_class: 'Степень защиты IP',
  power_w: 'Мощность, Вт',
  frequency_hz: 'Частота, Гц',
  phase: 'Количество фаз',
  mounting: 'Способ монтажа',
  cross_section_mm2: 'Сечение, мм²',
  length_m: 'Длина, м',
  qty_breaks: 'Оптовые цены',
}

function getLabel(key: string, locale?: string): string {
  const dict = locale === 'ru' ? ATTR_LABELS_RU : ATTR_LABELS_UK
  if (dict[key]) return dict[key]
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
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
  return String(value)
}

export function ProductAttributes({ attributes, locale }: ProductAttributesProps) {
  // Фильтруем только простые атрибуты (не служебные)
  const entries = Object.entries(attributes).filter(
    ([, value]) => value !== null && value !== undefined && value !== ''
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
                <td className="px-4 py-2.5 font-medium w-1/2 text-text-muted">
                  {getLabel(key, locale)}
                </td>
                <td className="px-4 py-2.5 num text-text-primary">
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
