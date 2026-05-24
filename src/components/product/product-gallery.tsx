'use client'

import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, X, ImageIcon } from 'lucide-react'
import { getTransformedImageUrl } from '@/lib/images'

interface ProductImage {
  id?: string
  url: string
  alt?: string | null
  sortOrder?: number
  provider?: string
  publicId?: string | null
}

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
  locale?: string
}

export function ProductGallery({ images, productName, locale }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const hasImages = images.length > 0
  const activeImage = hasImages ? images[activeIndex] : null

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const next = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  // Keyboard navigation window listener
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setLightboxOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen, activeIndex, prev, next])

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      touchStartX.current = e.touches[0].clientX
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      touchEndX.current = e.touches[0].clientX
    }
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const diff = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50 // px

    if (diff > minSwipeDistance) {
      // Swipe Left -> Next
      next()
    } else if (diff < -minSwipeDistance) {
      // Swipe Right -> Prev
      prev()
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div className="relative overflow-hidden rounded-lg bg-surface-alt border border-border aspect-square group">
          {activeImage ? (
            <>
              <div
                className="relative w-full h-full cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
              >
                <Image
                  src={getTransformedImageUrl(activeImage, { width: 800, height: 800, crop: 'limit' })}
                  alt={activeImage.alt ?? productName}
                  fill
                  className={`object-contain p-4 transition-transform duration-300 ${
                    zoomed ? 'scale-105' : 'scale-100'
                  }`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  onMouseEnter={() => setZoomed(true)}
                  onMouseLeave={() => setZoomed(false)}
                  unoptimized={activeImage.url.startsWith('https://placehold.co')}
                />
                <div className="absolute top-3 right-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 border border-border">
                  <ZoomIn className="size-4 text-text-muted" />
                </div>
              </div>

              {/* Prev / Next arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      prev()
                    }}
                    aria-label="Попереднє фото"
                    className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 hover:opacity-100 focus-visible:opacity-100 bg-white/90 border border-border cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      next()
                    }}
                    aria-label="Наступне фото"
                    className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 hover:opacity-100 focus-visible:opacity-100 bg-white/90 border border-border cursor-pointer"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <ImageIcon className="size-12 text-border-strong" strokeWidth={1.5} />
              <span className="text-[11px] text-text-muted">
                {locale === 'ru' ? 'Нет фото' : 'Немає фото'}
              </span>
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {images.map((img, index) => (
              <button
                key={img.id ?? index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Фото ${index + 1}`}
                className={`relative shrink-0 rounded-lg overflow-hidden transition-all w-16 h-16 bg-surface-alt border cursor-pointer ${
                  index === activeIndex ? 'border-2 border-accent shadow-sm' : 'border-border hover:border-border-strong'
                }`}
              >
                <Image
                  src={getTransformedImageUrl(img, { width: 150, height: 150, crop: 'fill' })}
                  alt={img.alt ?? `${productName} ${index + 1}`}
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                  unoptimized={img.url.startsWith('https://placehold.co')}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-square max-h-[85vh] select-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={getTransformedImageUrl(activeImage, { width: 1600, height: 1600, crop: 'limit' })}
              alt={activeImage.alt ?? productName}
              fill
              className="object-contain"
              sizes="90vw"
              priority
              unoptimized={activeImage.url.startsWith('https://placehold.co')}
            />
          </div>

          {/* Close */}
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Закрити"
            className="absolute top-4 right-4 size-10 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
                aria-label="Попереднє"
                className="absolute left-4 top-1/2 -translate-y-1/2 size-12 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                aria-label="Наступне"
                className="absolute right-4 top-1/2 -translate-y-1/2 size-12 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white select-none">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}

