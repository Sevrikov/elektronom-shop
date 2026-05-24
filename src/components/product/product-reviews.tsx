'use client'

import { useState, useTransition } from 'react'
import { Star, X, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { submitProductReview } from '@/actions/user'

interface ReviewUser {
  name: string | null
  avatar: string | null
}

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: Date | string
  user: ReviewUser
  advantages?: string | null
  disadvantages?: string | null
  verifiedPurchase?: boolean
}

interface CurrentUser {
  name: string
  email: string
}

interface ProductReviewsProps {
  productId: string
  initialReviews: Review[]
  locale: string
  productName: string
  currentUser: CurrentUser | null
}

export function ProductReviews({
  productId,
  initialReviews,
  locale,
  productName,
  currentUser,
}: ProductReviewsProps) {
  const loc = locale === 'ru' ? 'ru' : 'uk'
  const reviews = initialReviews
  const showWriteButton = true

  const [activeFilter, setActiveFilter] = useState<'all' | 'positive' | 'negative'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [newName, setNewName] = useState(currentUser?.name ?? '')
  const [newComment, setNewComment] = useState('')
  const [newAdv, setNewAdv] = useState('')
  const [newDisadv, setNewDisadv] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Translation helpers
  const t = {
    title: loc === 'ru' ? 'Отзывы покупателей' : 'Відгуки покупців',
    writeBtn: loc === 'ru' ? 'Написать отзыв' : 'Написати відгук',
    basedOn: loc === 'ru' ? 'на основе {n} отзывов' : 'на основі {n} відгуків',
    emptyState: loc === 'ru' ? 'Пока нет отзывов' : 'Поки немає відгуків',
    beFirst: loc === 'ru' ? 'Будьте первым, кто оставит отзыв' : 'Будьте першим, хто залишить відгук',
    all: loc === 'ru' ? 'Все' : 'Всі',
    positive: loc === 'ru' ? 'Положительные' : 'Позитивні',
    critical: loc === 'ru' ? 'Критические' : 'Критичні',
    advantages: loc === 'ru' ? 'Преимущества:' : 'Переваги:',
    disadvantages: loc === 'ru' ? 'Недостатки:' : 'Недоліки:',
    verified: loc === 'ru' ? 'Подтвержденная покупка' : 'Підтверджена покупка',
    modalTitle: loc === 'ru' ? 'Написать отзыв' : 'Написати відгук',
    nameLabel: loc === 'ru' ? 'Ваше имя' : 'Ваше ім\'я',
    ratingLabel: loc === 'ru' ? 'Ваша оценка' : 'Ваша оцінка',
    commentLabel: loc === 'ru' ? 'Отзыв' : 'Відгук',
    submitBtn: loc === 'ru' ? 'Отправить' : 'Надіслати',
    successMsg:
      loc === 'ru'
        ? 'Спасибо! Ваш отзыв отправлен на модерацию.'
        : 'Дякуємо! Ваш відгук надіслано на модерацію.',
    loginPrompt:
      loc === 'ru'
        ? 'Чтобы оставить отзыв, пожалуйста, войдите в аккаунт.'
        : 'Щоб залишити відгук, будь ласка, увійдіть в акаунт.',
    loginBtn: loc === 'ru' ? 'Войти' : 'Увійти',
  }

  // Filter logic
  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === 'positive') return r.rating >= 4
    if (activeFilter === 'negative') return r.rating <= 3
    return true
  })

  // Calculate summary metrics
  const totalCount = reviews.length
  const averageRating =
    totalCount > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1))
      : 0

  const starsBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length
    const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0
    return { stars, count, percentage }
  })

  const handleResetAndClose = () => {
    setModalOpen(false)
    setFormSubmitted(false)
    setNewName(currentUser?.name ?? '')
    setNewComment('')
    setNewAdv('')
    setNewDisadv('')
    setNewRating(5)
    setSubmitError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    startTransition(async () => {
      const res = await submitProductReview({
        productId,
        rating: newRating,
        comment: newComment,
        advantages: newAdv || null,
        disadvantages: newDisadv || null,
      })

      if (res.success) {
        setFormSubmitted(true)
      } else {
        setSubmitError(
          res.error ||
            (loc === 'ru' ? 'Ошибка при отправке отзыва' : 'Помилка при відправці відгуку')
        )
      }
    })
  }

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

  return (
    <section className="bg-surface-white border border-border rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
        <h2 className="text-[20px] font-extrabold text-text-primary tracking-tight">
          {t.title}{' '}
          {totalCount > 0 && <span className="text-sm font-normal text-text-muted">({totalCount})</span>}
        </h2>
        {showWriteButton && (
          <button
            onClick={() => setModalOpen(true)}
            className="h-9 px-4 rounded-lg bg-surface-alt hover:bg-surface-raised border border-border text-xs font-bold text-text-primary transition-colors cursor-pointer"
          >
            {t.writeBtn}
          </button>
        )}
      </div>

      {totalCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-sm font-semibold text-text-primary mb-1">{t.emptyState}</p>
          <p className="text-xs text-text-muted mb-4">{t.beFirst}</p>
          {showWriteButton && (
            <button
              onClick={() => setModalOpen(true)}
              className="h-9 px-4 rounded-lg bg-accent text-white hover:bg-accent/90 text-xs font-bold transition-colors cursor-pointer"
            >
              {t.writeBtn}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
          {/* Left Rating Card */}
          <div className="border border-border rounded-xl p-4 bg-surface-alt/40">
            <div className="text-center mb-4">
              <span className="text-[44px] font-black text-text-primary leading-none num">
                {averageRating}
              </span>
              <div className="flex justify-center gap-0.5 my-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < Math.round(averageRating)
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-border-strong'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-text-muted">
                {t.basedOn.replace('{n}', String(totalCount))}
              </span>
            </div>

            {/* Breakdown Bars */}
            <div className="flex flex-col gap-2 mb-5">
              {starsBreakdown.map((row) => (
                <div key={row.stars} className="flex items-center gap-2 text-xs">
                  <span className="w-6 text-text-muted shrink-0 text-right">{row.stars} ★</span>
                  <div className="flex-1 h-2 rounded bg-surface-raised overflow-hidden">
                    <div className="h-full bg-amber-500 rounded" style={{ width: `${row.percentage}%` }} />
                  </div>
                  <span className="w-4 text-text-muted shrink-0 text-right">{row.count}</span>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-1.5 pt-3 border-t border-border">
              <button
                onClick={() => setActiveFilter('all')}
                className={`w-full text-left h-8 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-accent text-white'
                    : 'bg-surface-white hover:bg-surface-raised border border-border text-text-primary'
                }`}
              >
                {t.all}
              </button>
              <button
                onClick={() => setActiveFilter('positive')}
                className={`w-full text-left h-8 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeFilter === 'positive'
                    ? 'bg-accent text-white'
                    : 'bg-surface-white hover:bg-surface-raised border border-border text-text-primary'
                }`}
              >
                {t.positive}
              </button>
              <button
                onClick={() => setActiveFilter('negative')}
                className={`w-full text-left h-8 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeFilter === 'negative'
                    ? 'bg-accent text-white'
                    : 'bg-surface-white hover:bg-surface-raised border border-border text-text-primary'
                }`}
              >
                {t.critical}
              </button>
            </div>
          </div>

          {/* Right Reviews List */}
          <div className="flex flex-col gap-5">
            {filteredReviews.length === 0 ? (
              <p className="text-xs text-text-muted py-4 text-center">
                {loc === 'ru' ? 'Нет отзывов для выбранного фильтра.' : 'Немає відгуків для обраного фільтра.'}
              </p>
            ) : (
              filteredReviews.map((r) => (
                <div key={r.id} className="pb-5 border-b border-border last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-extrabold shrink-0 select-none">
                        {(r.user.name ?? 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-extrabold text-text-primary">
                            {r.user.name}
                          </span>
                          {r.verifiedPurchase && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-success bg-success-subtle px-1.5 py-0.5 rounded-full select-none">
                              <Check className="size-2.5" strokeWidth={3} />
                              {t.verified}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`size-3 ${
                                  i < r.rating ? 'text-amber-500 fill-amber-500' : 'text-border-strong'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-text-muted font-medium">
                            {new Intl.DateTimeFormat(loc === 'ru' ? 'ru-UA' : 'uk-UA').format(
                              new Date(r.createdAt)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {r.comment && (
                    <p className="text-[13px] text-text-primary leading-relaxed mt-3 whitespace-pre-line">
                      {r.comment}
                    </p>
                  )}

                  {r.advantages && (
                    <div className="mt-2 text-[12px] leading-relaxed">
                      <span className="font-extrabold text-text-primary block sm:inline mr-1">
                        {t.advantages}
                      </span>
                      <span className="text-text-muted">{r.advantages}</span>
                    </div>
                  )}

                  {r.disadvantages && (
                    <div className="mt-1 text-[12px] leading-relaxed">
                      <span className="font-extrabold text-text-primary block sm:inline mr-1">
                        {t.disadvantages}
                      </span>
                      <span className="text-text-muted">{r.disadvantages}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
          <div className="bg-surface-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-border">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-alt">
              <h3 className="text-sm font-extrabold text-text-primary uppercase tracking-wider">
                {t.modalTitle}
              </h3>
              <button
                onClick={handleResetAndClose}
                className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {!currentUser ? (
              <div className="p-8 text-center flex flex-col items-center">
                <p className="text-sm font-semibold text-text-primary mb-5">{t.loginPrompt}</p>
                <Link
                  href={`/${locale}/login?callbackUrl=${encodeURIComponent(currentPath)}`}
                  className="h-10 px-5 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/95 flex items-center justify-center cursor-pointer transition-colors"
                >
                  {t.loginBtn}
                </Link>
              </div>
            ) : formSubmitted ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="size-12 rounded-full bg-success-subtle text-success flex items-center justify-center mb-3">
                  <Check className="size-6" strokeWidth={2.5} />
                </div>
                <p className="text-sm font-bold text-text-primary mb-5">{t.successMsg}</p>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="h-10 px-5 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 cursor-pointer"
                >
                  OK
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                {submitError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-xs font-semibold">
                    {submitError}
                  </div>
                )}

                <p className="text-xs font-semibold text-text-muted">{productName}</p>

                {/* Rating selection */}
                <div>
                  <label className="block text-xs font-extrabold text-text-primary mb-1.5 uppercase tracking-wider">
                    {t.ratingLabel}
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        key={stars}
                        type="button"
                        onClick={() => setNewRating(stars)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`size-6 ${
                            stars <= newRating ? 'text-amber-500 fill-amber-500' : 'text-border-strong'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-extrabold text-text-primary mb-1 uppercase tracking-wider">
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    disabled={true}
                    value={newName}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-surface-alt text-text-muted text-sm cursor-not-allowed"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-extrabold text-text-primary mb-1 uppercase tracking-wider">
                    {t.commentLabel}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-3 rounded-lg border border-border bg-surface-white focus:outline-none focus:border-accent text-sm resize-none"
                  />
                </div>

                {/* Adv & Disadv */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-text-primary mb-1 uppercase tracking-wider">
                      {t.advantages}
                    </label>
                    <input
                      type="text"
                      value={newAdv}
                      onChange={(e) => setNewAdv(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-surface-white focus:outline-none focus:border-accent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-text-primary mb-1 uppercase tracking-wider">
                      {t.disadvantages}
                    </label>
                    <input
                      type="text"
                      value={newDisadv}
                      onChange={(e) => setNewDisadv(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-surface-white focus:outline-none focus:border-accent text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="h-10 mt-2 w-full rounded-lg bg-accent text-white hover:bg-accent/90 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    t.submitBtn
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
