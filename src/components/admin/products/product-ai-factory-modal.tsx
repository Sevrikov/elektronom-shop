import { useState } from 'react'
import { Bot, Loader2, X } from 'lucide-react'
import type {
  AdminProductItem,
  ContentFactoryActionType,
  ContentFactoryProviderMode,
  launchContentFactoryForProductAdmin,
} from '@/actions/admin'

type FactoryLaunchInput = Parameters<typeof launchContentFactoryForProductAdmin>[0]

interface ProductAiFactoryModalProps {
  product: AdminProductItem | null
  locale: string
  onClose: () => void
  onLaunch: (payload: FactoryLaunchInput) => Promise<{ success: boolean; error?: string }>
}

const labels = {
  uk: {
    title: 'AI Content Factory',
    subtitle: 'Запустити генерацію для товару',
    action: 'Що створюємо',
    provider: 'Режим провайдера',
    automation: 'Автоматизація',
    safe: 'Безпечний режим: зупинка на перевірці людиною',
    fullAuto: 'Full-auto smoke: згенерувати, затвердити і експортувати CMS draft',
    notes: 'Коментар оператору',
    cancel: 'Скасувати',
    launch: 'Запустити фабрику',
    launching: 'Запуск...',
    confirmFullAuto: 'Full-auto режим сам затвердить asset і зробить CMS draft. Продовжити?',
  },
  ru: {
    title: 'AI Content Factory',
    subtitle: 'Запустить генерацию для товара',
    action: 'Что создаем',
    provider: 'Режим провайдера',
    automation: 'Автоматизация',
    safe: 'Безопасный режим: остановка на проверке человеком',
    fullAuto: 'Full-auto smoke: сгенерировать, утвердить и экспортировать CMS draft',
    notes: 'Комментарий оператору',
    cancel: 'Отмена',
    launch: 'Запустить фабрику',
    launching: 'Запуск...',
    confirmFullAuto: 'Full-auto режим сам утвердит asset и сделает CMS draft. Продолжить?',
  },
}

const actionOptions: { value: ContentFactoryActionType; labelUk: string; labelRu: string }[] = [
  { value: 'product_description', labelUk: 'Опис товару', labelRu: 'Описание товара' },
  { value: 'main_image_infographic', labelUk: 'Головне інфографічне зображення', labelRu: 'Главное инфографическое изображение' },
  { value: 'description_infographic', labelUk: 'Інфографіка в опис', labelRu: 'Инфографика в описание' },
  { value: 'article', labelUk: 'Стаття про товар', labelRu: 'Статья о товаре' },
  { value: 'video', labelUk: 'Відео-бриф', labelRu: 'Видео-бриф' },
  { value: 'shorts', labelUk: 'Shorts-інфографіка', labelRu: 'Shorts-инфографика' },
]

export function ProductAiFactoryModal({
  product,
  locale,
  onClose,
  onLaunch,
}: ProductAiFactoryModalProps) {
  const t = locale === 'ru' ? labels.ru : labels.uk
  const [actionType, setActionType] = useState<ContentFactoryActionType>('main_image_infographic')
  const [providerMode, setProviderMode] = useState<ContentFactoryProviderMode>('mock')
  const [fullAuto, setFullAuto] = useState(false)
  const [operatorNotes, setOperatorNotes] = useState(
    locale === 'ru'
      ? 'Использовать реальные фото товара. Не добавлять цену в изображение. Найти боль покупателя и закрыть ее короткой инфографикой.'
      : 'Використати реальні фото товару. Не додавати ціну в зображення. Знайти біль покупця і закрити його короткою інфографікою.'
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!product) return null

  const productName =
    product.translations.find((item) => item.locale === locale)?.name ||
    product.translations[0]?.name ||
    product.slug

  const submit = async () => {
    setError(null)
    if (fullAuto && !window.confirm(t.confirmFullAuto)) return

    setIsSubmitting(true)
    try {
      const result = await onLaunch({
        productId: product.id,
        actionType,
        providerMode,
        language: locale === 'ru' ? 'ru' : 'uk-UA',
        operatorNotes,
        autoApproveBrief: true,
        generateAsset: true,
        autoApproveAsset: fullAuto,
        exportCms: fullAuto,
      })
      if (result.success) {
        onClose()
      } else {
        setError(result.error || 'Content Factory launch failed')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 flex flex-col gap-5 animate-zoom-in">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent mb-1">
              <Bot className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">{t.title}</span>
            </div>
            <h3 className="text-base font-black text-slate-950">{t.subtitle}</h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">{productName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.action}</span>
            <select
              value={actionType}
              onChange={(event) => setActionType(event.target.value as ContentFactoryActionType)}
              className="h-10 px-3 border border-slate-200 rounded-lg bg-slate-50/50 outline-none text-xs font-bold focus:border-accent"
            >
              {actionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {locale === 'ru' ? option.labelRu : option.labelUk}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.provider}</span>
            <select
              value={providerMode}
              onChange={(event) => setProviderMode(event.target.value as ContentFactoryProviderMode)}
              className="h-10 px-3 border border-slate-200 rounded-lg bg-slate-50/50 outline-none text-xs font-bold focus:border-accent"
            >
              <option value="mock">mock</option>
              <option value="manual">manual</option>
              <option value="cheap">cheap</option>
              <option value="quality">quality</option>
            </select>
          </label>

          <label className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3 cursor-pointer">
            <input
              type="checkbox"
              checked={fullAuto}
              onChange={(event) => setFullAuto(event.target.checked)}
              className="mt-0.5 size-4 rounded border-slate-300 accent-accent"
            />
            <span className="flex flex-col gap-0.5">
              <span className="text-xs font-black text-slate-800">{t.automation}</span>
              <span className="text-[11px] font-semibold text-slate-500">{fullAuto ? t.fullAuto : t.safe}</span>
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{t.notes}</span>
            <textarea
              value={operatorNotes}
              onChange={(event) => setOperatorNotes(event.target.value)}
              rows={4}
              className="w-full p-3 border border-slate-200 rounded-lg outline-none text-xs font-semibold resize-none focus:border-accent bg-slate-50/50 focus:bg-white"
            />
          </label>
        </div>

        {error && <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{error}</div>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer transition-colors"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={isSubmitting}
            className="h-9 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-extrabold text-xs cursor-pointer transition-colors shadow-sm disabled:opacity-60 inline-flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
            {isSubmitting ? t.launching : t.launch}
          </button>
        </div>
      </div>
    </div>
  )
}
