'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { X, BellRing, Check } from 'lucide-react'
import { createReminderRequest } from '@/actions/reminder'

interface ReminderRequestButtonProps {
  type: 'purchase' | 'back_in_stock'
  productId: string
  productName: string
  productSku: string
  variant?: 'primary' | 'secondary'
  className?: string
}

export function ReminderRequestButton({
  type,
  productId,
  productName,
  productSku,
  variant = 'secondary',
  className,
}: ReminderRequestButtonProps) {
  const t = useTranslations('pdp')
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [contact, setContact] = useState('')
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const labelKey = type === 'purchase' ? 'reminder.purchaseCta' : 'reminder.backInStockCta'

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (contact.trim().length < 3) {
      setError(t('reminder.contactRequired'))
      return
    }
    setError(null)
    startTransition(async () => {
      const res = await createReminderRequest({
        type,
        productId,
        productName,
        productSku,
        contact: contact.trim(),
        customerName: name.trim() || undefined,
        note: note.trim() || undefined,
      })
      if (res.success) setDone(true)
      else setError(t('reminder.error'))
    })
  }

  const btnClass =
    variant === 'primary'
      ? 'bg-accent text-white hover:bg-accent-hover border border-accent'
      : 'bg-surface-white text-accent border border-accent hover:bg-accent hover:text-white'

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center gap-2 h-12 px-5 rounded-md font-semibold text-[15px] cursor-pointer transition-colors ${btnClass} ${className ?? ''}`}
      >
        <BellRing className="size-5" strokeWidth={1.8} />
        <span>{t(labelKey)}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md bg-surface-white rounded-2xl shadow-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            {done ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <div className="size-12 rounded-full bg-success-subtle flex items-center justify-center">
                  <Check className="size-6 text-success" strokeWidth={2.5} />
                </div>
                <p className="font-bold text-text-primary">
                  {type === 'purchase' ? t('reminder.thanksPurchase') : t('reminder.thanksBackInStock')}
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-1 h-10 px-5 rounded-md bg-accent text-white font-semibold cursor-pointer hover:bg-accent-hover"
                >
                  {t('reminder.close')}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-text-primary">{t(labelKey)}</h3>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={t('reminder.close')}
                    className="text-text-muted hover:text-text-primary cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                <p className="text-sm text-text-muted line-clamp-2">{productName}</p>
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={t('reminder.contactPlaceholder')}
                  className="h-11 px-3 rounded-lg border border-border bg-surface-alt text-text-primary outline-none focus:border-accent transition-colors"
                />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('reminder.namePlaceholder')}
                  className="h-11 px-3 rounded-lg border border-border bg-surface-alt text-text-primary outline-none focus:border-accent transition-colors"
                />
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t('reminder.notePlaceholder')}
                  rows={2}
                  className="px-3 py-2 rounded-lg border border-border bg-surface-alt text-text-primary outline-none focus:border-accent transition-colors resize-none"
                />
                {error && <p className="text-sm text-error">{error}</p>}
                <button
                  type="submit"
                  disabled={isPending}
                  className="h-11 rounded-md bg-accent text-white font-semibold cursor-pointer hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPending ? '…' : t('reminder.submit')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
