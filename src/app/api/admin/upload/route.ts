import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { uploadProductImage, deleteProductImage } from '@/lib/storage'
import { z } from 'zod'

const DeleteQuerySchema = z.discriminatedUnion('provider', [
  z.object({
    provider: z.literal('CLOUDINARY'),
    publicId: z.string().min(1),
    url: z.string().optional(),
  }),
  z.object({
    provider: z.literal('LOCAL'),
    publicId: z.string().nullable().optional(),
    url: z.string().min(1),
  }),
])

export async function POST(req: NextRequest) {
  try {
    // Authenticate as Admin
    await requireAdmin()

    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded or invalid file format' },
        { status: 400 }
      )
    }

    // Format and Size Validation
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    const MAX_SIZE = 10 * 1024 * 1024 // 10MB

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only JPEG, PNG, WEBP, and AVIF images are allowed.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds the 10 MB limit.' },
        { status: 400 }
      )
    }

    const result = await uploadProductImage(file)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, image: result })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Upload failed'
    const status = msg === 'UNAUTHORIZED' ? 401 : msg === 'FORBIDDEN' ? 403 : 500
    return NextResponse.json({ success: false, error: msg }, { status })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Authenticate as Admin
    await requireAdmin()

    const searchParams = Object.fromEntries(new URL(req.url).searchParams.entries())

    // Zod validation for parameters
    const parsed = DeleteQuerySchema.safeParse(searchParams)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters: ' + parsed.error.issues.map(i => i.message).join(', ') },
        { status: 400 }
      )
    }

    const { provider, publicId, url } = parsed.data

    if (provider === 'LOCAL') {
      const cleanUrl = url.replace(/^\//, '')
      if (!cleanUrl.startsWith('uploads/')) {
        return NextResponse.json(
          { success: false, error: 'Access denied: can only delete files inside the uploads directory.' },
          { status: 403 }
        )
      }
      if (cleanUrl.includes('..') || cleanUrl.includes('\\') || cleanUrl.includes('\0')) {
        return NextResponse.json(
          { success: false, error: 'Invalid file path.' },
          { status: 400 }
        )
      }
    }

    const result = await deleteProductImage(publicId || null, provider, url || undefined)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Deletion failed'
    const status = msg === 'UNAUTHORIZED' ? 401 : msg === 'FORBIDDEN' ? 403 : 500
    return NextResponse.json({ success: false, error: msg }, { status })
  }
}
