import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'
import fs from 'fs'
import path from 'path'
import { env } from '@/lib/env'

// Configure Cloudinary if environment variables are available
const cloudName = env.CLOUDINARY_CLOUD_NAME
const apiKey = env.CLOUDINARY_API_KEY
const apiSecret = env.CLOUDINARY_API_SECRET

const isCloudinaryConfigured = !!(cloudName && apiKey && apiSecret)

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })
}

export interface UploadedImageResult {
  success: boolean
  provider: 'CLOUDINARY' | 'LOCAL'
  publicId: string | null
  url: string
  processedUrl?: string | null
  width: number | null
  height: number | null
  format: string | null
  size: number | null
  error?: string
}

/**
 * Uploads a file (either File object or base64 data string) to the configured storage provider.
 * Falls back to local storage in development if Cloudinary is not configured.
 */
export async function uploadProductImage(
  file: File | string,
  folder = 'elektronom/products'
): Promise<UploadedImageResult> {
  try {
    let buffer: Buffer
    let filename = 'image.png'
    let format = 'png'
    let mimeType = 'image/png'
    let size = 0

    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
      filename = file.name
      mimeType = file.type
      size = file.size
      const ext = path.extname(filename).toLowerCase().replace('.', '')
      format = ext || 'png'
    } else if (typeof file === 'string' && file.startsWith('data:')) {
      // Base64 string
      const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string format')
      }
      const mime = matches[1]
      const base64Data = matches[2]
      if (!mime || !base64Data) {
        throw new Error('Invalid base64 string structure')
      }
      mimeType = mime
      format = mimeType.split('/')[1] || 'png'
      buffer = Buffer.from(base64Data, 'base64')
      filename = `upload-${Date.now()}.${format}`
      size = buffer.length
    } else {
      throw new Error('Unsupported file input type')
    }

    // Determine target provider
    const isDev = env.NODE_ENV === 'development'
    if (isCloudinaryConfigured) {
      // Upload to Cloudinary using upload_stream
      const uploadOptions = {
        folder,
        resource_type: 'image' as const,
        format: format === 'jpeg' ? 'jpg' : format,
        eager: [{ effect: 'bgremoval' }],
      }

      const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
          if (error || !result) reject(error || new Error('Upload failed'))
          else resolve(result)
        })
        stream.end(buffer)
      })

      return {
        success: true,
        provider: 'CLOUDINARY',
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
        processedUrl: uploadResult.eager?.[0]?.secure_url || null,
        width: uploadResult.width || null,
        height: uploadResult.height || null,
        format: uploadResult.format || format,
        size: uploadResult.bytes || size,
      }
    } else {
      // Local fallback (only allowed in development)
      if (!isDev) {
        throw new Error('Cloudinary credentials missing in production environment.')
      }

      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      // Generate unique name
      const fileExt = path.extname(filename) || `.${format}`
      const baseName = path.basename(filename, fileExt).replace(/[^a-zA-Z0-9]/g, '-')
      const uniqueName = `${baseName}-${Date.now()}${fileExt}`
      const filePath = path.join(uploadDir, uniqueName)

      await fs.promises.writeFile(filePath, buffer)

      const relativeUrl = `/uploads/${uniqueName}`

      return {
        success: true,
        provider: 'LOCAL',
        publicId: null,
        url: relativeUrl,
        width: null, // Width/height could be loaded via size/image-size library if needed, leaving null for simplicity
        height: null,
        format,
        size,
      }
    }
  } catch (error) {
    return {
      success: false,
      provider: isCloudinaryConfigured ? 'CLOUDINARY' : 'LOCAL',
      publicId: null,
      url: '',
      width: null,
      height: null,
      format: null,
      size: null,
      error: error instanceof Error ? error.message : 'Unknown upload error',
    }
  }
}

/**
 * Deletes a product image from the specified storage provider.
 */
export async function deleteProductImage(
  publicId: string | null,
  provider: 'CLOUDINARY' | 'LOCAL',
  url?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (provider === 'CLOUDINARY') {
      if (!isCloudinaryConfigured) {
        throw new Error('Cloudinary not configured')
      }
      if (!publicId) {
        throw new Error('No publicId provided for Cloudinary delete')
      }

      const result = await cloudinary.uploader.destroy(publicId)
      return { success: result.result === 'ok' }
    } else {
      // Local deletion
      if (!url) {
        throw new Error('No URL provided for local file deletion')
      }

      const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads')
      const cleanUrl = url.replace(/^\//, '')
      
      // Early protection checks
      if (!cleanUrl.startsWith('uploads/') || cleanUrl.includes('..') || cleanUrl.includes('\\') || cleanUrl.includes('\0')) {
        throw new Error('Invalid local image path')
      }

      const fullPath = path.resolve(process.cwd(), 'public', cleanUrl)
      if (!fullPath.startsWith(uploadsDir + path.sep)) {
        throw new Error('Invalid local image path')
      }

      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath)
      }
      return { success: true }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown deletion error',
    }
  }
}

/**
 * Standardizes image URLs, prepending CDN domains if necessary.
 */
import { getImageUrl as clientGetImageUrl, getTransformedImageUrl as clientGetTransformedImageUrl } from './images'

export { clientGetImageUrl as getImageUrl, clientGetTransformedImageUrl as getTransformedImageUrl }

