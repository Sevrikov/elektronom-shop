'use client'

import { useEffect, useRef, useState } from 'react'

interface TransparentImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  threshold?: number // Whiteness threshold (0-255). Default is 250.
}

export function TransparentImage({
  src,
  alt,
  threshold = 250,
  className,
  ...props
}: TransparentImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!src) return

    setLoaded(false)
    setError(false)

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src as string

    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        setError(true)
        return
      }

      // Match canvas dimensions to the image source size
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      // Clear any previous draws
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)

      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imgData.data

        // Process pixels to remove solid white background
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i] ?? 0
          const g = data[i + 1] ?? 0
          const b = data[i + 2] ?? 0

          // Check if pixel is white or near-white
          if (r >= threshold && g >= threshold && b >= threshold) {
            data[i + 3] = 0 // Transparent
          }
        }

        ctx.putImageData(imgData, 0, 0)
        setLoaded(true)
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
  }, [src, threshold])

  // Render a fallback image if canvas processing fails or isn't supported
  if (error || !src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} {...props} />
  }

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {/* Hidden image for accessibility / screen readers */}
      <span className="sr-only">{alt}</span>

      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full object-contain"
        style={{ display: loaded ? 'block' : 'none' }}
      />

      {/* Loading state spinner */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <div className="size-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  )
}
