/**
 * Standardizes image URLs, prepending CDN domains if necessary.
 */
export function getImageUrl(urlOrPath: string): string {
  if (!urlOrPath) return ''
  const activeCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'bzzecoeb'
  if (urlOrPath.includes('res.cloudinary.com/')) {
    return urlOrPath.replace(/res\.cloudinary\.com\/[^\/]+\//, `res.cloudinary.com/${activeCloudName}/`)
  }
  return urlOrPath
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
  const isProcessed = typeof image !== 'string' && !!image?.processedUrl
  let url = typeof image === 'string' ? image : (image?.processedUrl || image?.url)
  const provider = typeof image === 'string' ? null : image?.provider

  if (!url) return ''

  // Fix legacy Cloudinary cloud_name (dpfye2xce -> bzzecoeb)
  const activeCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'bzzecoeb'
  if (url.includes('res.cloudinary.com/')) {
    url = url.replace(/res\.cloudinary\.com\/[^\/]+\//, `res.cloudinary.com/${activeCloudName}/`)
  }

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

