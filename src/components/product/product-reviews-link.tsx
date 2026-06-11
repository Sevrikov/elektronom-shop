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
      className="size-4.5 shrink-0"
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

  const formattedRating = Number.isInteger(avgRating) ? avgRating.toString() : avgRating.toFixed(1)

  if (reviewCount > 0) {
    return (
      <div className="flex items-center gap-3 py-1 flex-wrap text-sm select-none">
        {/* Stars group */}
        <div className="flex items-center gap-0.5">
          {stars.map((fillPercent, i) => (
            <StarIcon key={i} fillPercent={fillPercent} />
          ))}
        </div>

        {/* Numeric rating pill */}
        <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-700 font-extrabold px-2 py-0.5 rounded-md text-xs font-mono tracking-tight border border-amber-500/20">
          <span>{formattedRating}</span>
          <span className="text-amber-600/50 text-[10px]">/ 5</span>
        </div>

        <span className="text-border-strong text-xs font-light">|</span>

        {/* Reviews/Votes link */}
        <a
          href="#reviews"
          onClick={handleScrollToReviews}
          className="inline-flex items-center gap-1 text-text-muted hover:text-accent text-xs font-bold transition-colors group"
        >
          <span className="underline decoration-dotted decoration-text-muted/40 group-hover:decoration-accent/60 transition-colors">
            {tReviews}
          </span>
        </a>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 py-1 text-sm select-none">
      {/* 5 empty outline stars */}
      <div className="flex items-center gap-0.5 text-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className="size-4.5 shrink-0 stroke-current"
            viewBox="0 0 20 20"
            fill="none"
            strokeWidth={1.5}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        ))}
      </div>

      <a
        href="#reviews"
        onClick={handleScrollToReviews}
        className="inline-flex items-center gap-1.5 text-accent hover:text-accent-hover text-xs font-bold transition-all group"
      >
        <span className="relative pb-0.5">
          {tLeaveReview}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
        </span>
      </a>
    </div>
  )
}
