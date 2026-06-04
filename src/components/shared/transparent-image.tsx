import Image from 'next/image'

interface TransparentImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | unknown // Override to accept any type safely
  threshold?: number // Unused, kept for API compatibility
}

export function TransparentImage({
  src,
  alt,
  threshold: _threshold,
  className,
  ...props
}: TransparentImageProps) {
  const imgSrc = typeof src === 'string' ? src : ''

  // Next.js <Image> needs a fallback if src is an empty string
  const finalSrc = imgSrc || '/images/products/bosch_filter.png'

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className || ''}`}>
      <Image
        src={finalSrc}
        alt={alt || ''}
        fill
        sizes="(max-width: 768px) 100vw, 320px"
        className="object-contain"
        {...(props as Record<string, unknown>)}
      />
    </div>
  )
}
