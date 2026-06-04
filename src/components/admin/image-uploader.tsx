'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

export interface ProductImageInput {
  id?: string
  url: string
  processedUrl?: string | null
  originalUrl?: string | null
  provider: 'LOCAL' | 'CLOUDINARY' | 'EXTERNAL'
  publicId?: string | null
  width?: number | null
  height?: number | null
  format?: string | null
  size?: number | null
  alt?: string | null
  sortOrder: number
}

interface ImageUploaderProps {
  images: ProductImageInput[]
  onChange: (images: ProductImageInput[]) => void
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const t = useTranslations('admin.imageUploader')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Trigger file selection
  const handleSelectClick = () => {
    fileInputRef.current?.click()
  }

  // Upload file to the API
  const uploadFile = async (file: File): Promise<ProductImageInput | null> => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Upload failed')
    }

    const data = await res.json()
    if (data.success && data.image) {
      const img = data.image
      return {
        url: img.url,
        processedUrl: img.processedUrl || null,
        originalUrl: img.originalUrl || null,
        provider: img.provider as 'LOCAL' | 'CLOUDINARY' | 'EXTERNAL',
        publicId: img.publicId,
        width: img.width,
        height: img.height,
        format: img.format,
        size: img.size,
        sortOrder: images.length,
      }
    }
    return null
  }

  // Handle files input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setError(null)

    const MAX_FILES = 15
    const MAX_SIZE = 10 * 1024 * 1024 // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

    if (images.length + files.length > MAX_FILES) {
      setError(t('maxFilesError', { max: MAX_FILES }))
      return
    }

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      if (!file) continue
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(t('allowedTypesError'))
        return
      }
      if (file.size > MAX_SIZE) {
        setError(t('maxSizeError'))
        return
      }
    }

    setUploading(true)

    try {
      const newImages: ProductImageInput[] = [...images]
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i)
        if (!file) continue
        const img = await uploadFile(file)
        if (img) {
          img.sortOrder = newImages.length
          newImages.push(img)
        }
      }
      onChange(newImages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    setError(null)

    const MAX_FILES = 15
    const MAX_SIZE = 10 * 1024 * 1024 // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

    if (images.length + files.length > MAX_FILES) {
      setError(t('maxFilesError', { max: MAX_FILES }))
      return
    }

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      if (!file) continue
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(t('allowedTypesError'))
        return
      }
      if (file.size > MAX_SIZE) {
        setError(t('maxSizeError'))
        return
      }
    }

    setUploading(true)

    try {
      const newImages: ProductImageInput[] = [...images]
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i)
        if (!file) continue
        const img = await uploadFile(file)
        if (img) {
          img.sortOrder = newImages.length
          newImages.push(img)
        }
      }
      onChange(newImages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // Delete image
  const handleDelete = (index: number) => {
    const remaining = images.filter((_, idx) => idx !== index).map((img, idx) => ({
      ...img,
      sortOrder: idx,
    }))
    onChange(remaining)
  }

  // Move image (reorder)
  const moveImage = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return
    if (direction === 'right' && index === images.length - 1) return

    const targetIndex = direction === 'left' ? index - 1 : index + 1
    const newImages = [...images]

    // Swap elements
    const temp = newImages[index]
    const target = newImages[targetIndex]
    if (temp && target) {
      newImages[index] = target
      newImages[targetIndex] = temp
    }

    // Update sortOrder values
    const updated = newImages.map((img, idx) => ({
      ...img,
      sortOrder: idx,
    }))

    onChange(updated)
  }

  // Render format size in KB
  const formatSize = (bytes: number | null | undefined) => {
    if (!bytes) return ''
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Thumbnail List */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((img, index) => (
          <div
            key={index}
            className="group relative aspect-square border border-slate-100 rounded-xl bg-slate-50 overflow-hidden flex flex-col items-center justify-center transition-all hover:shadow-md hover:border-slate-200"
          >
            {/* Image Preview */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.alt || 'Product thumbnail'}
              className="w-full h-full object-cover"
            />

            {/* Hover details badge */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] font-mono px-2 py-1 translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-between">
              <span>{img.provider}</span>
              {img.size && <span>{formatSize(img.size)}</span>}
            </div>

            {/* Controls overlay */}
            <div className="absolute top-1 right-1 flex gap-1">
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="size-6 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-sm transition-colors cursor-pointer"
                title={t('deleteTitle')}
              >
                <X className="size-3.5" />
              </button>
            </div>

            {/* Left/Right movement buttons */}
            <div className="absolute inset-x-0 bottom-1 px-1.5 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveImage(index, 'left')}
                className={`size-6 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-sm pointer-events-auto transition-colors cursor-pointer text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                disabled={index === images.length - 1}
                onClick={() => moveImage(index, 'right')}
                className={`size-6 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-sm pointer-events-auto transition-colors cursor-pointer text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            {/* Main cover marker for 1st image */}
            {index === 0 && (
              <div className="absolute top-1 left-1 bg-accent text-white text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded shadow-sm">
                {t('mainCover')}
              </div>
            )}
          </div>
        ))}

        {/* Upload box placeholder */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleSelectClick}
          className={`aspect-square border-2 border-dashed border-slate-200 hover:border-accent rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-all ${
            uploading ? 'pointer-events-none' : ''
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="size-6 text-accent animate-spin" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t('uploading')}
              </span>
            </>
          ) : (
            <>
              <Upload className="size-6 text-slate-300" />
              <div className="text-center px-2">
                <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  {t('uploadButton')}
                </span>
                <span className="block text-[8px] text-slate-400 mt-0.5">
                  {t('dragDropPrompt')}
                </span>
              </div>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {error && (
        <span className="text-[11px] font-semibold text-rose-500 mt-1 block">
          {error}
        </span>
      )}
    </div>
  )
}
