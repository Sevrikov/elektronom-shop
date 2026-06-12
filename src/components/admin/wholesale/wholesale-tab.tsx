'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { saveWholesaleRule, deleteWholesaleRule } from '@/actions/wholesale'

interface SimpleOption {
  id: string
  name: string
}
interface Tier {
  min: number
  discount: number
}
export interface WholesaleRuleItem {
  id: string
  brandId: string | null
  categoryId: string | null
  maxDiscount: number
  tiers: Tier[]
  isActive: boolean
}

interface WholesaleTabProps {
  brands: SimpleOption[]
  categories: SimpleOption[]
  initialRules: WholesaleRuleItem[]
  uk: boolean
}

const DEFAULT_TIERS: Tier[] = [
  { min: 3, discount: 5 },
  { min: 5, discount: 15 },
  { min: 20, discount: 25 },
]

export function WholesaleTab({ brands, categories, initialRules, uk }: WholesaleTabProps) {
  const [rules, setRules] = useState<WholesaleRuleItem[]>(initialRules)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [scopeType, setScopeType] = useState<'brand' | 'category'>('brand')
  const [brandId, setBrandId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [maxDiscount, setMaxDiscount] = useState(25)
  const [tiers, setTiers] = useState<Tier[]>(DEFAULT_TIERS)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const brandName = (id: string | null) => brands.find((b) => b.id === id)?.name ?? '—'
  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? '—'

  function resetForm() {
    setEditingId(null)
    setScopeType('brand')
    setBrandId('')
    setCategoryId('')
    setMaxDiscount(25)
    setTiers(DEFAULT_TIERS)
    setError(null)
  }

  function loadRule(r: WholesaleRuleItem) {
    setEditingId(r.id)
    setScopeType(r.brandId ? 'brand' : 'category')
    setBrandId(r.brandId ?? '')
    setCategoryId(r.categoryId ?? '')
    setMaxDiscount(r.maxDiscount)
    setTiers(r.tiers.length ? r.tiers : DEFAULT_TIERS)
    setError(null)
  }

  function setTier(i: number, patch: Partial<Tier>) {
    setTiers((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)))
  }

  function save() {
    const cleanTiers = tiers
      .filter((t) => t.min >= 2 && t.discount >= 1)
      .sort((a, b) => a.min - b.min)
    if (cleanTiers.length === 0) {
      setError(uk ? 'Додайте хоча б один поріг' : 'Добавьте хотя бы один порог')
      return
    }
    const scopedBrand = scopeType === 'brand' ? brandId || null : null
    const scopedCat = scopeType === 'category' ? categoryId || null : null
    if (!scopedBrand && !scopedCat) {
      setError(uk ? 'Оберіть марку або категорію' : 'Выберите марку или категорию')
      return
    }
    startTransition(async () => {
      const res = await saveWholesaleRule({
        id: editingId ?? undefined,
        brandId: scopedBrand,
        categoryId: scopedCat,
        maxDiscount,
        tiers: cleanTiers,
        isActive: true,
      })
      if (res.success && res.rule) {
        const saved: WholesaleRuleItem = {
          id: res.rule.id,
          brandId: res.rule.brandId,
          categoryId: res.rule.categoryId,
          maxDiscount: res.rule.maxDiscount,
          tiers: cleanTiers,
          isActive: res.rule.isActive,
        }
        setRules((prev) => (editingId ? prev.map((r) => (r.id === saved.id ? saved : r)) : [saved, ...prev]))
        resetForm()
      } else {
        setError(res.error ?? 'Помилка')
      }
    })
  }

  function remove(id: string) {
    startTransition(async () => {
      const res = await deleteWholesaleRule(id)
      if (res.success) setRules((prev) => prev.filter((r) => r.id !== id))
    })
  }

  const inputCls = 'h-9 px-2.5 rounded-md border border-slate-200 bg-white text-sm outline-none focus:border-accent'

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
      {/* Rules list */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 text-sm font-bold text-slate-700">
          {uk ? 'Правила опту' : 'Правила опта'} ({rules.length})
        </div>
        {rules.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-400">
            {uk ? 'Ще немає правил' : 'Пока нет правил'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {rules.map((r) => (
              <div key={r.id} className="flex items-start gap-3 p-3.5 hover:bg-slate-50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {r.brandId ? brandName(r.brandId) : categoryName(r.categoryId)}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                      {r.brandId ? (uk ? 'марка' : 'марка') : uk ? 'категорія' : 'категория'}
                    </span>
                    {!r.isActive && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">off</span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    {r.tiers.map((t) => `${t.min}+ → −${t.discount}%`).join(' · ')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => loadRule(r)}
                  className="shrink-0 p-1.5 rounded text-slate-400 hover:text-accent hover:bg-slate-100 cursor-pointer"
                  title={uk ? 'Редагувати' : 'Редактировать'}
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(r.id)}
                  disabled={isPending}
                  className="shrink-0 p-1.5 rounded text-slate-400 hover:text-destructive hover:bg-slate-100 cursor-pointer disabled:opacity-40"
                  title={uk ? 'Видалити' : 'Удалить'}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 h-fit">
        <h3 className="text-sm font-bold text-slate-800 mb-3">
          {editingId ? (uk ? 'Редагувати правило' : 'Редактировать правило') : uk ? 'Нове правило' : 'Новое правило'}
        </h3>

        <div className="flex gap-2 mb-3">
          {(['brand', 'category'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setScopeType(st)}
              className={`flex-1 h-9 rounded-md text-sm font-semibold cursor-pointer transition-colors ${
                scopeType === st ? 'bg-accent text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'brand' ? (uk ? 'Марка' : 'Марка') : uk ? 'Категорія' : 'Категория'}
            </button>
          ))}
        </div>

        {scopeType === 'brand' ? (
          <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className={`${inputCls} w-full mb-3`}>
            <option value="">{uk ? '— оберіть марку —' : '— выберите марку —'}</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        ) : (
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={`${inputCls} w-full mb-3`}>
            <option value="">{uk ? '— оберіть категорію —' : '— выберите категорию —'}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}

        <label className="block text-xs font-semibold text-slate-500 mb-1">
          {uk ? 'Стеля знижки, %' : 'Потолок скидки, %'}
        </label>
        <input
          type="number"
          min={0}
          max={99}
          value={maxDiscount}
          onChange={(e) => setMaxDiscount(Number(e.target.value))}
          className={`${inputCls} w-full mb-3`}
        />

        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
          {uk ? 'Пороги (від шт → знижка %)' : 'Пороги (от шт → скидка %)'}
        </label>
        <div className="flex flex-col gap-2 mb-3">
          {tiers.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="number"
                min={2}
                value={t.min}
                onChange={(e) => setTier(i, { min: Number(e.target.value) })}
                className={`${inputCls} w-20`}
                placeholder={uk ? 'від' : 'от'}
              />
              <span className="text-slate-400">→</span>
              <input
                type="number"
                min={1}
                max={99}
                value={t.discount}
                onChange={(e) => setTier(i, { discount: Number(e.target.value) })}
                className={`${inputCls} w-20`}
                placeholder="%"
              />
              <span className="text-slate-400 text-sm">%</span>
              <button
                type="button"
                onClick={() => setTiers((prev) => prev.filter((_, idx) => idx !== i))}
                className="ml-auto p-1.5 rounded text-slate-400 hover:text-destructive cursor-pointer"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setTiers((prev) => [...prev, { min: 0, discount: 0 }])}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline cursor-pointer"
          >
            <Plus className="size-3.5" /> {uk ? 'Додати поріг' : 'Добавить порог'}
          </button>
        </div>

        {error && <p className="text-sm text-destructive mb-2">{error}</p>}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={save}
            disabled={isPending}
            className="flex-1 h-10 rounded-md bg-accent text-white font-bold text-sm cursor-pointer hover:bg-accent-hover disabled:opacity-50"
          >
            {isPending ? '…' : editingId ? (uk ? 'Зберегти' : 'Сохранить') : uk ? 'Створити' : 'Создать'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="h-10 px-4 rounded-md bg-slate-100 text-slate-600 font-semibold text-sm cursor-pointer hover:bg-slate-200"
            >
              {uk ? 'Скасувати' : 'Отмена'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
