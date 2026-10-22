/** Returns the stored image URL without changing its storage account. */
export function getImageUrl(urlOrPath: string): string {
  return urlOrPath || ''
}

/**
 * Generates a transformed Cloudinary URL with specified width, height, crop, format, and quality.
 * Returns the original URL if not hosted on Cloudinary.
 * Designed to be safe for both client-side and server-side usage.
 */
export function getTransformedImageUrl(
  image: { url: string; provider?: string | null; publicId?: string | null; processedUrl?: string | null } | string,
  options: {
    width?: number
    height?: number
    crop?: 'fill' | 'scale' | 'thumb' | 'fit' | 'limit'
    quality?: string | number
    format?: string
    removeBg?: boolean
  }
): string {
  const originalUrl = typeof image === 'string' ? image : image?.url
  const processedUrl = typeof image === 'string' ? null : image?.processedUrl
  const temporaryPhotoBase = process.env.NEXT_PUBLIC_PRODUCT_PHOTO_BASE_URL
  const cloudinarySource = processedUrl?.includes('res.cloudinary.com/')
    ? processedUrl
    : originalUrl?.includes('res.cloudinary.com/') ? originalUrl : null

  // The temporary local photo server keeps the same WebP filenames as Cloudinary.
  if (temporaryPhotoBase && cloudinarySource) {
    try {
      const filename = decodeURIComponent(new URL(cloudinarySource).pathname.split('/').pop() || '')
      if (filename.toLowerCase().endsWith('.webp')) {
        return `${temporaryPhotoBase.replace(/\/$/, '')}/images/${encodeURIComponent(filename)}`
      }
    } catch {
      // Keep the normal source if a stored URL is malformed.
    }
  }

  // Keep external originals visible while the processed Cloudinary storage is unavailable.
  // Set the public flag to "false" after a working image CDN has been configured.
  const preferExternalOriginal = process.env.NEXT_PUBLIC_PREFER_ORIGINAL_IMAGES !== 'false'
    && !!originalUrl
    && /^https?:\/\//.test(originalUrl)
    && !originalUrl.includes('res.cloudinary.com/')
    && !!processedUrl?.includes('res.cloudinary.com/')
  const url = preferExternalOriginal ? originalUrl : (processedUrl || originalUrl)
  const isProcessed = !!processedUrl && url === processedUrl
  const provider = typeof image === 'string' ? null : image?.provider

  if (!url) return ''

  // Check if it's Cloudinary, either via provider or URL domain
  const isCloudinary = provider === 'CLOUDINARY' || url.includes('res.cloudinary.com')

  if (isCloudinary) {
    // We want to insert transformations after "/image/upload/"
    const target = '/image/upload'
    const index = url.indexOf(target)
    if (index !== -1) {
      const parts = []
      
      // Enable AI background removal if env variable is set or option is passed,
      // but only if it has not already been processed and the URL doesn't contain it.
      const enableBgRemoval = !isProcessed && (process.env.NEXT_PUBLIC_CLOUDINARY_BG_REMOVAL === 'true' || options.removeBg)
      if (enableBgRemoval && !url.includes('e_bgremoval')) {
        parts.push('e_bgremoval')
      }

      if (options.width) parts.push(`w_${options.width}`)
      if (options.height) parts.push(`h_${options.height}`)
      if (options.crop) parts.push(`c_${options.crop}`)
      else if (options.width || options.height) parts.push('c_fill')
      
      parts.push(`q_${options.quality || 'auto'}`)
      parts.push(`f_${options.format || 'auto'}`)

      const transformStr = parts.join(',')
      const insertPosition = index + target.length
      
      return url.slice(0, insertPosition) + '/' + transformStr + url.slice(insertPosition)
    }
  }

  return url
}

