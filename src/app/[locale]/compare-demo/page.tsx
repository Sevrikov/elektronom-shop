// TEMP demo page to preview the animated comparison table interaction.
// Route: /uk/compare-demo  (remove before merge — this is a prototype harness)
import { CompareTable, type CompareColumn, type CompareProduct } from '@/components/compare/compare-table'

const columns: CompareColumn[] = [
  { key: 'price', label: 'Ціна', direction: 'lower', unit: '₴' },
  { key: 'breaking', label: 'Відкл. здатність', direction: 'higher', unit: 'кА' },
  { key: 'ip', label: 'Захист IP', direction: 'higher' },
  { key: 'current', label: 'Ном. струм', direction: 'higher', unit: 'А' },
  { key: 'poles', label: 'Полюси', direction: 'text' },
  { key: 'weight', label: 'Вага', direction: 'lower', unit: 'кг' },
]

const products: CompareProduct[] = [
  { id: '1', name: 'ASKO UTrust 1P+N 40A', image: 'https://res.cloudinary.com/dpfye2xce/image/upload/v1780538820/elektronom/products/A0010260002.webp', values: { price: 884, breaking: 6, ip: 20, current: 40, poles: '2P', weight: 0.25 } },
  { id: '2', name: 'Hager CDA240D 40A', image: 'https://res.cloudinary.com/dpfye2xce/image/upload/v1780542260/elektronom/products/MC332A.webp', values: { price: 1290, breaking: 10, ip: 20, current: 40, poles: '2P', weight: 0.30 } },
  { id: '3', name: 'Schneider Acti9 iID 40A', image: 'https://res.cloudinary.com/dpfye2xce/image/upload/v1780534091/elektronom/products/26-00021.webp', values: { price: 1150, breaking: 6, ip: 40, current: 40, poles: '2P', weight: 0.28 } },
  { id: '4', name: 'ABB FH202 40A', image: 'https://res.cloudinary.com/dpfye2xce/image/upload/v1780534690/elektronom/products/26-00551.webp', values: { price: 1490, breaking: 10, ip: 40, current: 40, poles: '2P', weight: 0.22 } },
]

export default function CompareDemoPage() {
  return (
    <div className="max-w-[760px] mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-text-primary mb-2">Демо: анимированное сравнение</h1>
      <p className="text-sm text-text-muted mb-5 leading-relaxed">
        Тапни по заголовку характеристики — её колонка уедет вперёд, а товары пересортируются (тап ещё раз —
        сменить направление ↑/↓). Зелёным подсвечен лучший в колонке, красным со стрелкой ↓ — худший.
        «Ном. струм» у всех одинаковый и «Полюси» — текст, поэтому они не красятся.
      </p>
      <CompareTable products={products} columns={columns} locale="uk" />
    </div>
  )
}
