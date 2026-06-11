'use client'

interface ProductReviewsLinkProps {
  reviewCount: number
  avgRating: number
  tReviews: string
  tLeaveReview: string
}

export function ProductReviewsLink({
  reviewCount,
  avgRating,
  tReviews,
  tLeaveReview,
}: ProductReviewsLinkProps) {
  return (
    <div className="flex items-center gap-1.5 -mt-1 text-sm font-semibold">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.round(avgRating)
          return (
            <svg
              key={star}
              className={`size-4 ${isFilled ? 'fill-current' : 'text-border fill-surface-white'}`}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )
        })}
      </div>
      <a
        href="#reviews"
        onClick={(e) => {
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
        }}
        className="text-accent hover:underline text-xs"
      >
        {reviewCount > 0 ? tReviews : tLeaveReview}
      </a>
    </div>
  )
}
