'use client'

import { useState, useEffect, useCallback } from 'react'

interface PriceRangeFilterProps {
  min: number
  max: number
  currentMin?: number | undefined
  currentMax?: number | undefined
  onChange: (min: number, max: number) => void
}

export default function PriceRangeFilter({ min, max, currentMin, currentMax, onChange }: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState(currentMin ?? min)
  const [localMax, setLocalMax] = useState(currentMax ?? max)

  // Sync with external props
  useEffect(() => {
    setLocalMin(currentMin ?? min)
    setLocalMax(currentMax ?? max)
  }, [currentMin, currentMax, min, max])

  const handleApply = useCallback(() => {
    const validMin = Math.max(min, Math.min(localMin, localMax))
    const validMax = Math.min(max, Math.max(localMin, localMax))
    onChange(validMin, validMax)
  }, [localMin, localMax, min, max, onChange])

  const handleMinBlur = () => {
    if (localMin < min) setLocalMin(min)
    if (localMin > localMax) setLocalMin(localMax)
    handleApply()
  }

  const handleMaxBlur = () => {
    if (localMax > max) setLocalMax(max)
    if (localMax < localMin) setLocalMax(localMin)
    handleApply()
  }

  // Calculate slider positions (0-100%)
  const range = max - min || 1
  const leftPct = ((localMin - min) / range) * 100
  const rightPct = ((localMax - min) / range) * 100

  return (
    <div className="flex flex-col gap-3">
      {/* Min/Max inputs */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <input
            type="number"
            value={localMin}
            onChange={(e) => setLocalMin(Number(e.target.value))}
            onBlur={handleMinBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            className="w-full h-8 px-3 rounded-md text-[13px] num outline-none transition-colors"
            style={{
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface-alt)',
              color: 'var(--color-text-primary)',
            }}
            min={min}
            max={max}
            aria-label="Мін. ціна"
          />
        </div>
        <span className="text-[12px] shrink-0" style={{ color: 'var(--color-text-muted)' }}>—</span>
        <div className="flex-1">
          <input
            type="number"
            value={localMax}
            onChange={(e) => setLocalMax(Number(e.target.value))}
            onBlur={handleMaxBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            className="w-full h-8 px-3 rounded-md text-[13px] num outline-none transition-colors"
            style={{
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface-alt)',
              color: 'var(--color-text-primary)',
            }}
            min={min}
            max={max}
            aria-label="Макс. ціна"
          />
        </div>
      </div>

      {/* Range slider (pure CSS) */}
      <div className="relative h-5 flex items-center">
        {/* Track background */}
        <div
          className="absolute left-0 right-0 h-1 rounded-full"
          style={{ background: 'var(--color-border)' }}
        />
        {/* Active range */}
        <div
          className="absolute h-1 rounded-full"
          style={{
            background: 'var(--color-accent)',
            left: `${leftPct}%`,
            right: `${100 - rightPct}%`,
          }}
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
          className="range-thumb"
          style={{ zIndex: localMin > max - (max - min) * 0.1 ? 5 : 3 }}
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
          className="range-thumb"
          style={{ zIndex: 4 }}
          aria-label="Макс. ціна повзунок"
        />
      </div>
    </div>
  )
}
