'use client'

import { useId } from 'react'

interface ProductReviewsLinkProps {
  reviewCount: number
  avgRating: number
  tReviews: string
  tLeaveReview: string
}

function StarIcon({ fillPercent }: { fillPercent: number }) {
  const uniqueId = useId()
  const gradientId = `star-grad-${uniqueId.replace(/:/g, '')}`
  return (
    <svg
      className="size-4 shrink-0"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId}>
          <stop offset={`${fillPercent}%`} stopColor="#f59e0b" />
          <stop offset={`${fillPercent}%`} stopColor="#e5e7eb" />
        </linearGradient>
      </defs>
      <path
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  )
}

export function ProductReviewsLink({
  reviewCount,
  avgRating,
  tReviews,
  tLeaveReview,
}: ProductReviewsLinkProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const starIndex = i + 1
    if (avgRating >= starIndex) {
      return 100
    } else if (avgRating > starIndex - 1) {
      return Math.round((avgRating - (starIndex - 1)) * 100)
    }
    return 0
  })

  const handleScrollToReviews = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById('reviews')
    if (target) {
      const headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '120'
      )
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 48 - 12
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      })
      window.history.pushState(null, '', '#reviews')
    }
  }

  const formattedRating = avgRating > 0
    ? (Number.isInteger(avgRating) ? `${avgRating}.0` : avgRating.toFixed(1))
    : '0.0'

  return (
    <div className="flex items-center py-1">
      <a
        href="#reviews"
        onClick={handleScrollToReviews}
        className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-surface-white border border-border rounded-full shadow-xs hover:border-accent hover:bg-surface-alt transition-all duration-200 select-none group"
      >
        {/* Rating score number */}
        <span className="font-extrabold text-text-primary text-[13px] font-mono leading-none tracking-tight">
          {formattedRating}
        </span>

        {/* Stars row */}
        <div className="flex items-center gap-0.5">
          {stars.map((fillPercent, i) => (
            <StarIcon key={i} fillPercent={fillPercent} />
          ))}
        </div>

        {/* Separator line */}
        <span className="w-[1px] h-3.5 bg-border-strong" />

        {/* Reviews text label */}
        <span className="text-[12px] font-bold text-text-muted group-hover:text-accent transition-colors underline decoration-dotted decoration-text-muted/40 group-hover:decoration-accent/60 leading-none">
          {reviewCount > 0 ? tReviews : tLeaveReview}
        </span>
      </a>
    </div>
  )
}
