'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

interface PriceRangeFilterProps {
  min: number
  max: number
  availableMin?: number | undefined
  availableMax?: number | undefined
  currentMin?: number | undefined
  currentMax?: number | undefined
  onChange: (min: number, max: number) => void
  buckets?: number[] | undefined
}

const getHistogramHeightClass = (pct: number): string => {
  if (pct <= 0) return 'h-0'
  if (pct <= 10) return 'h-[10%]'
  if (pct <= 15) return 'h-[15%]'
  if (pct <= 20) return 'h-[20%]'
  if (pct <= 25) return 'h-[25%]'
  if (pct <= 30) return 'h-[30%]'
  if (pct <= 35) return 'h-[35%]'
  if (pct <= 40) return 'h-[40%]'
  if (pct <= 45) return 'h-[45%]'
  if (pct <= 50) return 'h-[50%]'
  if (pct <= 55) return 'h-[55%]'
  if (pct <= 60) return 'h-[60%]'
  if (pct <= 65) return 'h-[65%]'
  if (pct <= 70) return 'h-[70%]'
  if (pct <= 75) return 'h-[75%]'
  if (pct <= 80) return 'h-[80%]'
  if (pct <= 85) return 'h-[85%]'
  if (pct <= 90) return 'h-[90%]'
  if (pct <= 95) return 'h-[95%]'
  return 'h-full'
}

export default function PriceRangeFilter({
  min,
  max,
  availableMin,
  availableMax,
  currentMin,
  currentMax,
  onChange,
  buckets
}: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState(currentMin ?? min)
  const [localMax, setLocalMax] = useState(currentMax ?? max)
  const trackRef = useRef<HTMLDivElement>(null)
  const availTrackRef = useRef<HTMLDivElement>(null)

  const handleApply = useCallback(() => {
    const validMin = Math.max(min, Math.min(localMin, localMax))
    const validMax = Math.min(max, Math.max(localMin, localMax))
    onChange(validMin, validMax)
  }, [localMin, localMax, min, max, onChange])

  const handleMinBlur = () => {
    let nextMin = localMin
    if (localMin < min) nextMin = min
    if (localMin > localMax) nextMin = localMax
    
    setLocalMin(nextMin)
    onChange(nextMin, localMax)
  }

  const handleMaxBlur = () => {
    let nextMax = localMax
    if (localMax > max) nextMax = max
    if (localMax < localMin) nextMax = localMin
    
    setLocalMax(nextMax)
    onChange(localMin, nextMax)
  }

  // Calculate slider positions (0-100%)
  const range = max - min || 1
  const leftPct = ((localMin - min) / range) * 100
  const rightPct = ((localMax - min) / range) * 100

  // Calculate available corridor bounds
  const availLeftPct = availableMin !== undefined ? Math.max(0, Math.min(100, ((availableMin - min) / range) * 100)) : 0
  const availRightPct = availableMax !== undefined ? Math.max(0, Math.min(100, ((availableMax - min) / range) * 100)) : 100

  // Update track positions dynamically on DOM refs to avoid inline styles in JSX
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.left = `${leftPct}%`
      trackRef.current.style.right = `${100 - rightPct}%`
    }
  }, [leftPct, rightPct])

  useEffect(() => {
    if (availTrackRef.current) {
      availTrackRef.current.style.left = `${availLeftPct}%`
      availTrackRef.current.style.right = `${100 - availRightPct}%`
    }
  }, [availLeftPct, availRightPct])

  // Calculate max count for histogram normalization
  const maxBucketCount = buckets && buckets.length > 0 ? Math.max(...buckets) : 0

  return (
    <div className="flex flex-col gap-3">
      {/* Histogram buckets */}
      {buckets && buckets.length > 0 && maxBucketCount > 0 && (
        <div className="flex items-end justify-between h-5 gap-[1px] px-1 select-none">
          {buckets.map((count, index) => {
            const bucketMin = min + (index / buckets.length) * range
            const bucketMax = min + ((index + 1) / buckets.length) * range
            const isSelected = bucketMax >= localMin && bucketMin <= localMax
            const heightPct = count > 0 ? Math.max(15, Math.round((count / maxBucketCount) * 100)) : 0

            return (
              <div
                key={index}
                className="flex-1 flex items-end h-full animate-fade-in"
                title={`${Math.round(bucketMin)} - ${Math.round(bucketMax)} ₴: ${count}`}
              >
                <div
                  className={[
                    'w-full rounded-t-[1px] transition-all duration-300',
                    getHistogramHeightClass(heightPct),
                    count === 0
                      ? 'bg-transparent'
                      : isSelected
                        ? 'bg-accent'
                        : 'bg-text-muted/30 hover:bg-text-muted/50',
                  ].join(' ')}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* Min/Max inputs */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <input
            type="number"
            value={localMin}
            onChange={(e) => setLocalMin(Number(e.target.value))}
            onBlur={handleMinBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            className="w-full h-8 px-3 rounded-md text-[13px] num outline-none transition-colors border border-border bg-surface-alt text-text-primary focus:border-accent"
            min={min}
            max={max}
            aria-label="Мін. ціна"
          />
        </div>
        <span className="text-[12px] shrink-0 text-text-muted">—</span>
        <div className="flex-1">
          <input
            type="number"
            value={localMax}
            onChange={(e) => setLocalMax(Number(e.target.value))}
            onBlur={handleMaxBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            className="w-full h-8 px-3 rounded-md text-[13px] num outline-none transition-colors border border-border bg-surface-alt text-text-primary focus:border-accent"
            min={min}
            max={max}
            aria-label="Макс. ціна"
          />
        </div>
      </div>

      {/* Range slider (pure CSS) */}
      <div className="relative h-5 flex items-center">
        {/* Track background */}
        <div className="absolute left-0 right-0 h-1 rounded-full bg-border/40" />
        
        {/* Available corridor highlight */}
        <div
          ref={availTrackRef}
          className="absolute h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"
        />

        {/* Selected active range */}
        <div
          ref={trackRef}
          className="absolute h-1 rounded-full bg-accent"
        />

        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={localMin}
          onChange={(e) => {
            const v = Number(e.target.value)
            setLocalMin(Math.min(v, localMax))
          }}
          onMouseUp={handleApply}
          onTouchEnd={handleApply}
          className={[
            'range-thumb',
            localMin > max - (max - min) * 0.1 ? 'z-[5]' : 'z-[3]'
          ].join(' ')}
          aria-label="Мін. ціна повзунок"
        />
        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={localMax}
          onChange={(e) => {
            const v = Number(e.target.value)
            setLocalMax(Math.max(v, localMin))
          }}
          onMouseUp={handleApply}
          onTouchEnd={handleApply}
          className="range-thumb z-[4]"
          aria-label="Макс. ціна повзунок"
        />
      </div>
    </div>
  )
}
