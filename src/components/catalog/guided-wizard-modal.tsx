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
  Sliders,
  Check,
  Sparkles,
  Search,
  Loader2,
  ArrowRight,
  Printer,
  FileCheck
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

  // AI RAG Search state
  const [aiQuery, setAiQuery] = useState('')
  const [isSearchingAi, setIsSearchingAi] = useState(false)
  const [aiResult, setAiResult] = useState<{
    answer: string
    standard: string
    region: string
    suggestedRating: number
    suggestedPhase: '1phase' | '3phase'
    mandatoryComponents: string[]
  } | null>(null)

  if (!isOpen) return null

  const runRagSearchQuery = async (queryText: string) => {
    if (!queryText.trim()) return
    setIsSearchingAi(true)
    try {
      const res = await fetch('/api/wizard/rag-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, step }),
      })
      const data = await res.json()
      if (data.success) {
        setAiResult({
          answer: data.answer,
          standard: data.standard,
          region: data.region,
          suggestedRating: data.suggestedRating || 25,
          suggestedPhase: (data.suggestedPhase === '3phase' ? '3phase' : '1phase'),
          mandatoryComponents: data.mandatoryComponents || [],
        })
      }
    } catch {
      // ignore
    } finally {
      setIsSearchingAi(false)
    }
  }

  const handleRagSearch = (e: React.FormEvent) => {
    e.preventDefault()
    void runRagSearchQuery(aiQuery)
  }

  const applyAiConfig = () => {
    if (!aiResult) return
    setRating(aiResult.suggestedRating)
    setPhase(aiResult.suggestedPhase)
    setStep(2)
  }

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

  // Printable Stickers Generator Handler
  const handlePrintStickers = () => {
    const printWin = window.open('', '_blank', 'width=800,height=600')
    if (!printWin) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Маркировочная полоса для щита - Electronom</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #fff; color: #000; }
            h2 { margin-bottom: 5px; }
            p { font-size: 12px; color: #666; margin-top: 0; }
            .strip-container { display: flex; flex-wrap: wrap; gap: 4px; border: 2px solid #000; padding: 6px; margin-top: 20px; border-radius: 4px; }
            .sticker-item { border: 1px dashed #333; padding: 8px 12px; min-width: 70px; text-align: center; font-size: 11px; font-weight: bold; border-radius: 3px; background: #f9f9f9; }
            .sticker-icon { font-size: 16px; display: block; margin-bottom: 2px; }
            .danger { background: #ffebee; border-color: #f44336; color: #c62828; }
            .zubr { background: #e3f2fd; border-color: #2196f3; color: #1565c0; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h2>⚡ Маркировочная полоса для электрощита</h2>
          <p>Распечатайте на самоклеящейся бумаге и наклейте под DIN-рейку автоматов</p>
          <button onclick="window.print()" style="padding: 10px 20px; background: #ff6b00; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">🖨️ Печать маркировки</button>
          
          <div class="strip-container">
            <div class="sticker-item danger"><span class="sticker-icon">⚡</span>ВВОД ${phase === '1phase' ? '220V' : '380V'}<br>${rating}A</div>
            <div class="sticker-item zubr"><span class="sticker-icon">🛡️</span>ZUBR 380V<br>Защита</div>
            <div class="sticker-item"><span class="sticker-icon">💧</span>УЗО 30mA<br>Главное</div>
            <div class="sticker-item"><span class="sticker-icon">🍳</span>Кухня<br>Розетки</div>
            <div class="sticker-item"><span class="sticker-icon">🔌</span>Спальня<br>Розетки</div>
            <div class="sticker-item"><span class="sticker-icon">🚿</span>Ванная 10mA<br>Дифавтомат</div>
            <div class="sticker-item"><span class="sticker-icon">💡</span>Свет<br>Комнаты</div>
            <div class="sticker-item"><span class="sticker-icon">❄️</span>Кондиционер<br>16A</div>
          </div>
        </body>
      </html>
    `
    printWin.document.write(htmlContent)
    printWin.document.close()
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-surface-white border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top Header ── */}
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-surface-raised/40 shrink-0">
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

        {/* ── AI Search Bar with 3D Mascot Peeking ── */}
        <div className="relative px-5 py-3 bg-gradient-to-r from-accent/5 via-accent/10 to-surface-raised border-b border-border/80 shrink-0">
          
          {/* 3D Mascot Character - Programmatically Cropped & Positioned Directly on Top Border Edge */}
          <div className="absolute -top-[76px] sm:-top-[98px] right-6 sm:right-10 pointer-events-none hidden sm:block z-30 transition-transform hover:scale-105">
            <div className="relative overflow-hidden flex items-start justify-center">
              <img 
                src="/images/ai-mascot-peeking.png" 
                alt="AI Electrician Mascot" 
                className="h-28 sm:h-36 w-auto object-contain drop-shadow-[0_8px_10px_rgba(0,0,0,0.35)]"
                style={{
                  clipPath: 'inset(0 0 26% 0)', // Programmatically crops the bottom 26% (baked white/grey wall plate)
                }}
              />
            </div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="size-4 text-accent animate-pulse" />
              <span className="text-xs font-bold text-text-primary">
                {isUk ? 'ИИ-Помощник подбора (RAG База знаний ПУЭ / NEC / GB):' : 'ИИ-Помощник подбора (RAG База знаний ПУЭ / NEC / GB):'}
              </span>
            </div>

            <form onSubmit={handleRagSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder={isUk ? 'Например: деревянный дом с защитой от молний и узо...' : 'Например: деревянный дом с защитой от молний и узо...'}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-accent/30 bg-surface-white text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 shadow-xs"
                />
                <Search className="size-4 text-accent absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <button
                type="submit"
                disabled={isSearchingAi || !aiQuery.trim()}
                className="px-4 py-2 rounded-xl bg-accent text-white hover:bg-accent-strong text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                {isSearchingAi ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                {isUk ? 'Найти ИИ' : 'Найти ИИ'}
              </button>
            </form>

            {/* Quick Prompt Chips */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[10px]">
              <span className="text-text-muted font-bold">{isUk ? 'Быстрый поиск:' : 'Быстрый поиск:'}</span>
              {[
                { label: '🌲 Деревянный дом (AFCI)', query: 'деревянный дом afci защита' },
                { label: '💧 Ванная комната (10mA)', query: 'ванная 10mA дифавтомат' },
                { label: '🔋 Котел 12ч (LiFePO4)', query: 'дбж котел автономия 12 часов' },
                { label: '⚡ 3 Фазы 380V (ZUBR)', query: '3 фазы перенапряжение zubr' },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setAiQuery(chip.query)
                    void runRagSearchQuery(chip.query)
                  }}
                  className="px-2 py-0.5 rounded-md border border-accent/20 bg-surface-white hover:bg-accent/10 text-accent font-semibold transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* AI Result Banner */}
            {aiResult && (
              <div className="mt-3 p-3 rounded-xl bg-surface-white border border-accent/30 shadow-md animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-accent text-white">
                      {aiResult.region} [{aiResult.standard}]
                    </span>
                    <span className="text-xs font-bold text-text-primary">
                      Рекомендация экспертного ИИ:
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAiResult(null)}
                    className="text-text-muted hover:text-text-primary text-[10px]"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-text-primary leading-relaxed font-medium">
                  {aiResult.answer}
                </p>

                <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-text-muted">
                    <CheckCircle2 className="size-3.5 text-success" />
                    <span>Обязательно: {aiResult.mandatoryComponents.join(', ')}</span>
                  </div>

                  <button
                    type="button"
                    onClick={applyAiConfig}
                    className="px-3 py-1 rounded-lg bg-success text-white hover:bg-success/90 text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                  >
                    <span>Применить в расчет</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
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

          {/* ════════════ LIVE SELECTION PICTOGRAMS & COMPONENTS STRIP ════════════ */}
          {step < 3 && (
            <div className="p-3.5 rounded-xl bg-accent/5 border border-accent/20 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="size-4" />
                  {isUk ? 'Жива специфікація комплекту (Оновлюється на льоту):' : 'Живая спецификация комплекта (Обновляется на лету):'}
                </span>
                <span className="text-xs font-black text-accent font-mono">{totalSum.toLocaleString()} ₴</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                {assemblyItems.flatMap((cat) => cat.skus).map((sku, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-white border border-border shrink-0 shadow-2xs hover:border-accent/40 transition-all">
                    <span className="size-2 rounded-full bg-accent animate-pulse" />
                    <span className="font-semibold text-text-primary text-[11px]">{sku.name}</span>
                    <span className="text-[10px] font-bold text-accent bg-accent/10 px-1 py-0.2 rounded font-mono">{sku.qty}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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

              {/* Printable DIN Sticker Banner */}
              <div className="p-3.5 rounded-xl bg-surface-raised border border-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Printer className="size-5 text-accent shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-text-primary">
                      {isUk ? 'Маркувальна полоса для наклейки на щит' : 'Маркировочная полоса для наклейки на щит'}
                    </p>
                    <p className="text-[11px] text-text-muted">
                      {isUk ? 'Сформовані стікери з піктограмами під DIN-рейку' : 'Сформированные стикеры с пиктограммами под DIN-рейку'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePrintStickers}
                  className="px-3 py-1.5 rounded-lg border border-accent text-accent hover:bg-accent/10 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Printer className="size-3.5" />
                  {isUk ? 'Друк наклейок' : 'Печать наклеек'}
                </button>
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
