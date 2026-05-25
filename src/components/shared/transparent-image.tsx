'use client'

import { useEffect, useRef, useState } from 'react'

interface TransparentImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | any // Override to accept any type safely
  threshold?: number // Whiteness threshold (0-255). Default is 245.
}

export function TransparentImage({
  src,
  alt,
  threshold = 245,
  className,
  ...props
}: TransparentImageProps) {
  const [processedSrc, setProcessedSrc] = useState<string | null>(null)
  const [error, setError] = useState(false)

  const imgSrc = typeof src === 'string' ? src : ''

  useEffect(() => {
    if (!imgSrc) {
      setProcessedSrc(null)
      return
    }

    // Skip processing if it's a data URL, SVG or already transparent
    if (imgSrc.startsWith('data:') || imgSrc.endsWith('.svg')) {
      setProcessedSrc(imgSrc)
      return
    }

    setProcessedSrc(null)
    setError(false)

    const img = new Image()
    img.crossOrigin = 'anonymous'

    // Add a cache-buster query parameter to bypass the browser CORS cache bug
    let processUrl = imgSrc
    if (imgSrc.startsWith('http') && !imgSrc.includes('localhost')) {
      processUrl += (imgSrc.includes('?') ? '&' : '?') + 'cvs_cb=' + new Date().getTime()
    }
    img.src = processUrl

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        
        // Scale down large images for optimal performance
        let w = img.naturalWidth
        let h = img.naturalHeight
        const maxDim = 800
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w)
            w = maxDim
          } else {
            w = Math.round((w * maxDim) / h)
            h = maxDim
          }
        }
        
        canvas.width = w
        canvas.height = h

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          setError(true)
          return
        }

        ctx.drawImage(img, 0, 0, w, h)
        const imgData = ctx.getImageData(0, 0, w, h)
        const data = imgData.data

        // 0 = unprocessed/product, 1 = background/hole, 2 = processed product/white surface
        const visited = new Uint8Array(w * h)
        
        // Pre-allocate queues for performance
        const queue = new Int32Array(w * h)
        let qHead = 0
        let qTail = 0

        const getIdx = (x: number, y: number) => y * w + x

        const isNearWhite = (x: number, y: number) => {
          const idx = (y * w + x) * 4
          const r = data[idx] ?? 0
          const g = data[idx + 1] ?? 0
          const b = data[idx + 2] ?? 0
          const a = data[idx + 3] ?? 0
          if (a < 10) return true
          return r >= threshold && g >= threshold && b >= threshold
        }

        const enqueue = (x: number, y: number) => {
          const idx = y * w + x
          visited[idx] = 1
          queue[qTail++] = idx
        }

        // Phase 1: BFS for Outer Background starting from all boundary edges
        for (let x = 0; x < w; x++) {
          if (isNearWhite(x, 0)) {
            const idx = getIdx(x, 0)
            if (visited[idx] === 0) enqueue(x, 0)
          }
          if (isNearWhite(x, h - 1)) {
            const idx = getIdx(x, h - 1)
            if (visited[idx] === 0) enqueue(x, h - 1)
          }
        }
        for (let y = 1; y < h - 1; y++) {
          if (isNearWhite(0, y)) {
            const idx = getIdx(0, y)
            if (visited[idx] === 0) enqueue(0, y)
          }
          if (isNearWhite(w - 1, y)) {
            const idx = getIdx(w - 1, y)
            if (visited[idx] === 0) enqueue(w - 1, y)
          }
        }

        while (qHead < qTail) {
          const idx = queue[qHead++]
          if (idx === undefined) continue

          const x = idx % w
          const y = Math.floor(idx / w)

          // 4-neighbors checks
          if (x + 1 < w) {
            const nIdx = idx + 1
            if (visited[nIdx] === 0 && isNearWhite(x + 1, y)) {
              visited[nIdx] = 1
              queue[qTail++] = nIdx
            }
          }
          if (x - 1 >= 0) {
            const nIdx = idx - 1
            if (visited[nIdx] === 0 && isNearWhite(x - 1, y)) {
              visited[nIdx] = 1
              queue[qTail++] = nIdx
            }
          }
          if (y + 1 < h) {
            const nIdx = idx + w
            if (visited[nIdx] === 0 && isNearWhite(x, y + 1)) {
              visited[nIdx] = 1
              queue[qTail++] = nIdx
            }
          }
          if (y - 1 >= 0) {
            const nIdx = idx - w
            if (visited[nIdx] === 0 && isNearWhite(x, y - 1)) {
              visited[nIdx] = 1
              queue[qTail++] = nIdx
            }
          }
        }

        // Phase 2: Topological internal closed white areas/holes detection
        const compQueue = new Int32Array(w * h)

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const startIdx = y * w + x
            if (visited[startIdx] === 0 && isNearWhite(x, y)) {
              let compHead = 0
              let compTail = 0
              let touchesOuter = false

              visited[startIdx] = 4 // Temporary label for the current component
              compQueue[compTail++] = startIdx

              while (compHead < compTail) {
                const idx = compQueue[compHead++]
                if (idx === undefined) continue

                const cx = idx % w
                const cy = Math.floor(idx / w)

                // Check 4-neighbors
                const neighbors = [
                  { nx: cx + 1, ny: cy, nIdx: idx + 1 },
                  { nx: cx - 1, ny: cy, nIdx: idx - 1 },
                  { nx: cx, ny: cy + 1, nIdx: idx + w },
                  { nx: cx, ny: cy - 1, nIdx: idx - w }
                ]

                for (const { nx, ny, nIdx } of neighbors) {
                  if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                    const status = visited[nIdx]
                    if (status === 1) {
                      // Neighbors the outer background -> is an outer surface, not an internal hole
                      touchesOuter = true
                    } else if (status === 0 && isNearWhite(nx, ny)) {
                      visited[nIdx] = 4
                      compQueue[compTail++] = nIdx
                    }
                  }
                }
              }

              // If it doesn't touch the outer background and is large enough (size >= 100), transparentize it
              const isHole = !touchesOuter && compTail >= 100
              const targetLabel = isHole ? 1 : 2

              for (let i = 0; i < compTail; i++) {
                const idx = compQueue[i]
                if (idx !== undefined) {
                  visited[idx] = targetLabel
                }
              }
            }
          }
        }

        // Apply transparency and smooth/feather borders
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = y * w + x
            const status = visited[idx]
            if (status === 1) {
              let productNeighbors = 0

              // Check 8-neighbors to detect proximity to product edges
              for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                  if (dx === 0 && dy === 0) continue
                  const nx = x + dx
                  const ny = y + dy
                  if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                    const nIdx = ny * w + nx
                    const nStatus = visited[nIdx]
                    // If neighbor is solid product (not background/hole)
                    if (nStatus !== 1 && nStatus !== 4) {
                      productNeighbors++
                    }
                  }
                }
              }

              const pixelIdx = idx * 4
              if (productNeighbors > 0) {
                // Blend opacity smoothly at product borders
                data[pixelIdx + 3] = Math.min(255, 32 * productNeighbors)
              } else {
                // Fully transparent background
                data[pixelIdx + 3] = 0
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0)
        setProcessedSrc(canvas.toDataURL())
      } catch (err) {
        console.error('Failed to process image transparency:', err)
        setError(true)
      }
    }

    img.onerror = () => {
      setError(true)
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [imgSrc, threshold])

  const displaySrc = processedSrc || imgSrc

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={displaySrc}
        alt={alt}
        className="max-w-full max-h-full object-contain"
        {...props}
      />
    </div>
  )
}
