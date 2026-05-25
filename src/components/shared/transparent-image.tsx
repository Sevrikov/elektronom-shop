'use client'

import { useState } from 'react'

interface TransparentImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  threshold?: number // Left for backward compatibility
}

export function TransparentImage({
  src,
  alt,
  threshold,
  className,
  ...props
}: TransparentImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (error || !src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} {...props} />
  }

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {/* Hidden text for accessibility */}
      <span className="sr-only">{alt}</span>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
        className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
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
