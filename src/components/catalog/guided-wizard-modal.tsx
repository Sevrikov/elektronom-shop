'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Zap, 
  BatteryCharging, 
  Building2, 
  ShieldCheck, 
  HelpCircle, 
  ShoppingCart, 
  RefreshCw, 
  FileText,
  Sliders,
  Check
} from 'lucide-react'
import { useUIStore } from '@/store/ui-store'
import { useCartUIStore } from '@/store/cart-store'
import { addMultipleToCart } from '@/actions/cart'
import type { Locale } from '@/types'

export default function GuidedWizardModal() {
  const locale = useLocale() as Locale
  const isOpen = useUIStore((s) => s.isGuidedWizardOpen)
  const close = useUIStore((s) => s.closeGuidedWizard)
  const openCartDrawer = useCartUIStore((s) => s.openDrawer)
  const triggerCartUpdate = useCartUIStore((s) => s.triggerCartUpdate)

  const isUk = locale === 'uk'

  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [scenario, setScenario] = useState<'home' | 'ups' | 'office' | 'protection'>('home')
  const [phase, setPhase] = useState<'1phase' | '3phase'>('1phase')
  const [rating, setRating] = useState<number>(25) // Ampere
  const [groups, setGroups] = useState<'small' | 'medium' | 'large'>('medium')
  const [segment, setSegment] = useState<'premium' | 'optimum' | 'budget'>('optimum')
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  // Calculation multipliers for Assembly Spec
  const basePriceMultiplier = segment === 'premium' ? 1.6 : segment === 'optimum' ? 1.0 : 0.65
  const phaseMultiplier = phase === '3phase' ? 1.8 : 1.0

  // Estimated Assembly Items
  const assemblyItems = [
    {
      category: isUk ? 'Вхідна група & Захист' : 'Вводная группа & Защита',
      icon: ShieldCheck,
      skus: [
        {
          name: isUk ? `Ввідний автомат ${phase === '1phase' ? '2P' : '4P'} ${rating}A (Крива C)` : `Вводной автомат ${phase === '1phase' ? '2P' : '4P'} ${rating}A (Кривая C)`,
          qty: 1,
          price: Math.round(180 * basePriceMultiplier * phaseMultiplier)
        },
        {
          name: isUk ? `Реле напруги ZUBR ${phase === '1phase' ? '40A (1-Ф)' : '3-Фазний захист'}` : `Реле напряжения ZUBR ${phase === '1phase' ? '40A (1-Ф)' : '3-Фазная защита'}`,
          qty: phase === '1phase' ? 1 : 3,
          price: Math.round(750 * (phase === '1phase' ? 1 : 2.5))
        },
        {
          name: isUk ? `Головне УЗО / ПЗВ ${phase === '1phase' ? '40A 30mA' : '63A 300mA'}` : `Главное УЗО / ПЗВ ${phase === '1phase' ? '40A 30mA' : '63A 300mA'}`,
          qty: 1,
          price: Math.round(920 * basePriceMultiplier)
        }
      ]
    },
    {
      category: isUk ? 'Лінійна автоматика' : 'Линейная автоматика',
      icon: Zap,
      skus: [
        {
          name: isUk ? 'Автомати 16A (Розетки, Крива B)' : 'Автоматы 16A (Розетки, Кривая B)',
          qty: groups === 'small' ? 4 : groups === 'medium' ? 8 : 14,
          price: Math.round(140 * basePriceMultiplier)
        },
        {
          name: isUk ? 'Автомати 10A (Освітлення, Крива B)' : 'Автоматы 10A (Освещение, Кривая B)',
          qty: groups === 'small' ? 2 : groups === 'medium' ? 4 : 8,
          price: Math.round(135 * basePriceMultiplier)
        },
        {
          name: isUk ? 'Дифавтомати 16A 10mA (Мокрі зони)' : 'Дифавтоматы 16A 10mA (Мокрые зоны)',
          qty: groups === 'small' ? 1 : 2,
          price: Math.round(580 * basePriceMultiplier)
        }
      ]
    },
    {
      category: isUk ? 'Корпус щита & Аксесуари' : 'Корпус щита & Аксессуары',
      icon: Sliders,
      skus: [
        {
          name: isUk ? `Модульний щит вбудований (${groups === 'small' ? '12M' : groups === 'medium' ? '24M' : '36M'})` : `Модульный щит встраиваемый (${groups === 'small' ? '12M' : groups === 'medium' ? '24M' : '36M'})`,
          qty: 1,
          price: Math.round(650 * basePriceMultiplier)
        },
        {
          name: isUk ? 'З’єднувальна гребінка PnL 100A + Нульові шины' : 'Соединительная гребенка PnL 100A + Нулевые шины',
          qty: 1,
          price: 240
        }
      ]
    }
  ]

  const totalSum = assemblyItems.reduce((acc, cat) => {
    return acc + cat.skus.reduce((s, item) => s + item.price * item.qty, 0)
  }, 0)

  const handleAddToCart = async () => {
    setIsSubmitting(true)
    try {
      // Mock dummy SKU IDs for fast batch addition demo
      const mockItems = [
        { productId: 'clp1001avtomat', quantity: 1 },
        { productId: 'clp1002zubr', quantity: 1 }
      ]
      await addMultipleToCart(mockItems)
      triggerCartUpdate()
      close()
      openCartDrawer()
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-surface-white border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top Header ── */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-raised/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
              <Zap className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-text-primary">
                {isUk ? 'Майстер підбору обладнання в 3 кроки' : 'Мастер подбора оборудования в 3 шага'}
              </h3>
              <p className="text-xs text-text-muted">
                {isUk ? 'Формування специфікації (BOM) за 45 секунд' : 'Формирование спецификации (BOM) за 45 секунд'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={close}
            className="size-8 rounded-lg border border-border flex items-center justify-center hover:bg-surface-raised transition-colors text-text-muted hover:text-text-primary"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ── Progress Bar ── */}
        <div className="h-1.5 w-full bg-surface-raised overflow-hidden shrink-0">
          <div 
            className="h-full bg-gradient-to-r from-accent to-accent-strong transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* ── Step Content Area (Scrollable) ── */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">

          {/* ════════════ STEP 1: CONTEXT & SCENARIO ════════════ */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-200">
              <div>
                <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
                  {isUk ? 'Крок 1 з 3' : 'Шаг 1 из 3'}
                </span>
                <h4 className="text-lg font-bold text-text-primary">
                  {isUk ? 'Оберіть тип об’єкта та завдання' : 'Выберите тип объекта и задачу'}
                </h4>
              </div>

              {/* Grid 4 Scenario Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    id: 'home',
                    icon: Building2,
                    title: isUk ? 'Квартира / Котедж (Электрощит)' : 'Квартира / Коттедж (Электрощит)',
                    desc: isUk ? 'Ввідний автомат, реле напруги, УЗО та лінійний захист' : 'Вводной автомат, реле напряжения, УЗО и линейная защита',
                  },
                  {
                    id: 'ups',
                    icon: BatteryCharging,
                    title: isUk ? 'Резервне живлення (ДБЖ + АКБ)' : 'Резервное питание (ИБП + АКБ)',
                    desc: isUk ? 'Розрахунок автономної роботи інвертора під відключення' : 'Расчет автономной работы инвертора под отключения',
                  },
                  {
                    id: 'office',
                    icon: Building2,
                    title: isUk ? 'Офіс / Комерційний об’єкт' : 'Офис / Коммерческий объект',
                    desc: isUk ? 'Трифазний ввід, облік та групові щити розведення' : 'Трехфазный ввод, учет и групповые щиты разводки',
                  },
                  {
                    id: 'protection',
                    icon: ShieldCheck,
                    title: isUk ? 'Захисна автоматика (Экспрес)' : 'Защитная автоматика (Экспресс)',
                    desc: isUk ? 'Точковий підбір автоматів під відоме навантаження' : 'Точечный подбор автоматов под известную нагрузку',
                  },
                ].map((item) => {
                  const isSelected = scenario === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setScenario(item.id as typeof scenario)}
                      className={`relative flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all group ${
                        isSelected
                          ? 'border-accent bg-accent/5 ring-2 ring-accent/30 shadow-xs'
                          : 'border-border bg-surface-white hover:border-accent/40 hover:bg-surface-raised/50'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 text-accent animate-in zoom-in-50 duration-150">
                          <CheckCircle2 className="size-5" />
                        </span>
                      )}
                      <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                        isSelected ? 'bg-accent text-white border-accent' : 'bg-surface-raised border-border text-text-muted'
                      }`}>
                        <item.icon className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <p className={`font-bold text-sm leading-tight ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                          {item.title}
                        </p>
                        <p className="text-xs text-text-muted leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Network Phase Selection */}
              <div className="pt-3 border-t border-border/60">
                <label className="block text-xs font-bold text-text-primary mb-2">
                  {isUk ? 'Тип електромережі ввідного кабеля:' : 'Тип электросети вводного кабеля:'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: '1phase', label: isUk ? '1 Фаза (220V)' : '1 Фаза (220V)', desc: '2 провода (L, N) — Квартиры, малые дома' },
                    { id: '3phase', label: isUk ? '3 Фази (380V)' : '3 Фазы (380V)', desc: '4-5 проводов — Коттеджи, коммерция, насосы' },
                  ].map((p) => {
                    const isSel = phase === p.id
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPhase(p.id as typeof phase)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSel
                            ? 'border-accent bg-accent/10 font-bold text-accent shadow-xs'
                            : 'border-border bg-surface-white hover:bg-surface-raised text-text-primary'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-extrabold">{p.label}</span>
                          {isSel && <Check className="size-4 text-accent" />}
                        </div>
                        <p className="text-[11px] text-text-muted font-normal mt-0.5">{p.desc}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ════════════ STEP 2: TECHNICAL INPUTS & SEGMENTS ════════════ */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-200">
              <div>
                <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
                  {isUk ? 'Крок 2 з 3' : 'Шаг 2 из 3'}
                </span>
                <h4 className="text-lg font-bold text-text-primary">
                  {isUk ? 'Параметри навантаження та бренд' : 'Параметры нагрузки и бренд'}
                </h4>
              </div>

              {/* Rating Amperes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-text-primary">
                    {isUk ? 'Ввідний автомат (Номінальний струм А):' : 'Вводной автомат (Номинальный ток А):'}
                  </label>
                  <span className="text-xs font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                    {rating}A (~{Math.round(rating * (phase === '1phase' ? 0.22 : 0.66))} кВт)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[16, 25, 32, 40, 50, 63].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRating(r)}
                      className={`flex-1 py-2.5 rounded-lg border text-xs font-bold transition-all ${
                        rating === r
                          ? 'border-accent bg-accent text-white shadow-xs'
                          : 'border-border bg-surface-white hover:bg-surface-raised text-text-primary'
                      }`}
                    >
                      {r}A
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Groups / Rooms */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-2">
                  {isUk ? 'Масштаб об’єкта (Кількість розеточних/світлових груп):' : 'Масштаб объекта (Количество розеточных/световых групп):'}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'small', label: isUk ? '1-2 Кімнати' : '1-2 Комнаты', sub: 'До 8 групп' },
                    { id: 'medium', label: isUk ? '3-4 Кімнати' : '3-4 Комнаты', sub: '8–16 групп' },
                    { id: 'large', label: isUk ? 'Коттедж / Дім' : 'Коттедж / Дом', sub: '16–32 группы' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGroups(g.id as typeof groups)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        groups === g.id
                          ? 'border-accent bg-accent/10 font-bold text-accent shadow-xs'
                          : 'border-border bg-surface-white hover:bg-surface-raised text-text-primary'
                      }`}
                    >
                      <p className="text-xs font-extrabold">{g.label}</p>
                      <p className="text-[10px] text-text-muted">{g.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Segment Selection & Interactive ℹ️ Tooltips */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text-primary">
                    {isUk ? 'Брендовий сегмент обладнання:' : 'Брендовый сегмент оборудования:'}
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'premium',
                      badge: '🥇 PREMIUM',
                      title: 'Schneider / Hager',
                      desc: isUk ? 'Електромеханічні УЗО, максимальна надійність' : 'Электромеханические УЗО, максимальная надежность',
                      tooltipKey: 'premium_info',
                      tooltipText: 'Используются немецкие и французские комплектующие высшего класса с серебряными контактами.'
                    },
                    {
                      id: 'optimum',
                      badge: '⚖️ OPTIMUM',
                      title: 'ETI / EKF / IEK',
                      desc: isUk ? 'Найкраще співвідношення ціна / якість' : 'Лучшее соотношение цена / качество',
                      tooltipKey: 'optimum_info',
                      tooltipText: 'Проверенное заводское европейское и азиатское производство с гарантией 5 лет.'
                    },
                    {
                      id: 'budget',
                      badge: '💰 BUDGET',
                      title: 'АсКО-УКРЕМ',
                      desc: isUk ? 'Базовий захист за мінімальною ціною' : 'Базовая защита по минимальной цене',
                      tooltipKey: 'budget_info',
                      tooltipText: 'Надежная сертифицированная автоматика для бюджета без переплат.'
                    },
                  ].map((s) => {
                    const isSel = segment === s.id
                    return (
                      <div key={s.id} className="relative">
                        <button
                          type="button"
                          onClick={() => setSegment(s.id as typeof segment)}
                          className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                            isSel
                              ? 'border-accent bg-accent/5 ring-2 ring-accent/30 shadow-xs'
                              : 'border-border bg-surface-white hover:border-accent/40 hover:bg-surface-raised'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-extrabold text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                              {s.badge}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveTooltip(activeTooltip === s.tooltipKey ? null : s.tooltipKey)
                              }}
                              className="text-text-muted hover:text-accent p-0.5"
                            >
                              <HelpCircle className="size-4" />
                            </button>
                          </div>
                          <p className="text-xs font-bold text-text-primary mt-1">{s.title}</p>
                          <p className="text-[11px] text-text-muted leading-tight mt-0.5">{s.desc}</p>
                        </button>

                        {/* Interactive Tooltip Popover */}
                        {activeTooltip === s.tooltipKey && (
                          <div className="absolute left-0 right-0 bottom-full mb-2 p-3 bg-surface-primary text-text-inverse text-xs rounded-xl shadow-xl z-20 animate-in fade-in zoom-in-95 duration-150">
                            <p className="font-semibold">{s.tooltipText}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ════════════ STEP 3: GENERATED ASSEMBLY & ACTIONS ════════════ */}
          {step === 3 && (
            <div className="space-y-5 animate-in slide-in-from-right-4 duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
                    {isUk ? 'Крок 3 з 3 — Готова специфікація (BOM)' : 'Шаг 3 из 3 — Готовая спецификация (BOM)'}
                  </span>
                  <h4 className="text-lg font-bold text-text-primary">
                    {isUk ? 'Сформований комплект обладнання' : 'Сформированный комплект оборудования'}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-text-muted block">Ориентировочная сумма:</span>
                  <span className="text-xl font-black text-accent">{totalSum.toLocaleString()} ₴</span>
                </div>
              </div>

              {/* Assembly Blueprint Table */}
              <div className="border border-border rounded-xl bg-surface-white overflow-hidden divide-y divide-border">
                {assemblyItems.map((cat, idx) => (
                  <div key={idx} className="p-3.5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider">
                      <cat.icon className="size-4" />
                      <span>{cat.category}</span>
                    </div>

                    <div className="space-y-1.5 pl-6">
                      {cat.skus.map((sku, sIdx) => (
                        <div key={sIdx} className="flex items-center justify-between text-xs text-text-primary">
                          <span className="font-medium">{sku.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-text-muted font-mono">{sku.qty} шт.</span>
                            <span className="font-bold w-16 text-right">{(sku.price * sku.qty).toLocaleString()} ₴</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Assembly Summary & Action Bar */}
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <RefreshCw className="size-4 text-accent" />
                  <span>
                    {isUk ? 'Сегмент:' : 'Сегмент:'}{' '}
                    <strong className="text-text-primary uppercase font-bold">{segment}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSegment(segment === 'premium' ? 'optimum' : segment === 'optimum' ? 'budget' : 'premium')}
                    className="px-3 py-2 rounded-lg border border-border bg-surface-white hover:bg-surface-raised text-xs font-bold text-text-primary transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="size-3.5" />
                    {isUk ? 'Змінити бренд' : 'Сменить бренд'}
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-accent text-white hover:bg-accent-strong transition-all font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                  >
                    <ShoppingCart className="size-4" />
                    {isUk ? 'Додати весь комплект в кошик' : 'Добавить весь комплект в корзину'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ── Bottom Navigation Footer ── */}
        <div className="px-5 py-3.5 border-t border-border bg-surface-raised/50 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as typeof step)}
              className="px-4 py-2 rounded-lg border border-border bg-surface-white hover:bg-surface-raised text-xs font-bold text-text-primary transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="size-4" />
              {isUk ? 'Назад' : 'Назад'}
            </button>
          ) : (
            <div />
          )}

          {step < 3 && (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as typeof step)}
              className="px-6 py-2 rounded-lg bg-accent text-white hover:bg-accent-strong transition-colors text-xs font-bold flex items-center gap-1.5 shadow-xs ml-auto"
            >
              {isUk ? 'Далі крок' : 'Далее шаг'} {step + 1}
              <ChevronRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
