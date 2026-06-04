'use server'

import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { syncProductIndex, removeProductFromIndex } from '@/actions/search'
import { deleteProductImage } from '@/lib/storage'
import { sanitizeHtml } from '@/lib/sanitize'
import { env } from '@/lib/env'
import type { OrderStatus, Prisma } from '@/generated/prisma/client'

export interface CustomerData {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  city?: string
  street?: string
  building?: string
  apartment?: string
}

export interface OrderItemSnapshot {
  name?: string
  sku?: string
  nameUk?: string
  nameRu?: string
  image?: string
}

export interface AdminProductItem {
  id: string
  sku: string
  slug: string
  categoryId: string
  brandId: string | null
  price: Prisma.Decimal | number
  comparePrice: Prisma.Decimal | number | null
  costPrice: Prisma.Decimal | number | null
  stock: number
  isActive: boolean
  isFeatured: boolean
  attributes: Prisma.JsonValue
  sortOrder: number
  gtin?: string | null
  mpn?: string | null
  condition?: string
  googleProductCategory?: string | null
  itemGroupId?: string | null
  salePrice?: Prisma.Decimal | number | null
  saleStartsAt?: Date | null
  saleEndsAt?: Date | null
  translations: {
    locale: string
    name: string
    description: string | null
    metaTitle: string | null
    metaDesc: string | null
  }[]
  category: {
    id: string
    translations: {
      name: string
    }[]
  } | null
  brand: {
    id: string
    name: string
  } | null
  images: {
    id: string
    provider: string
    publicId: string | null
    url: string
    processedUrl: string | null
    originalUrl: string | null
    width: number | null
    height: number | null
    format: string | null
    size: number | null
    alt: string | null
    sortOrder: number
  }[]
}

export type ContentFactoryActionType =
  | 'product_description'
  | 'main_image_infographic'
  | 'description_infographic'
  | 'article'
  | 'group_article'
  | 'video'
  | 'shorts'
  | 'factory_run'

export type ContentFactoryProviderMode = 'mock' | 'manual' | 'cheap' | 'quality'

export interface ContentFactoryLaunchResult {
  success: boolean
  error?: string
  factoryRunId?: string
  localAgentJobId?: string
  factoryRunStatus?: string
  localAgentJobStatus?: string
}

export interface ContentFactoryProductStatus {
  productId: string
  sourceId: string
  factoryRunId: string
  factoryRunStatus: string
  factoryRunGate: string | null
  actionType: string
  updatedAt: string
  localAgentJobId: string | null
  localAgentJobStatus: string | null
  localAgentNextAction: string | null
}

export interface ContentFactoryStatusListResult {
  success: boolean
  error?: string
  statuses?: Record<string, ContentFactoryProductStatus>
}

export interface ContentFactoryRunResult {
  success: boolean
  error?: string
  run?: ContentFactoryRunApi
  jobs?: ContentFactoryLocalAgentJobApi[]
}

interface ContentFactoryRunApi {
  id: string
  source_type: string
  source_id: string
  action_type: string
  status: string
  language: string
  provider_mode: string
  operator_notes: string | null
  result_json: Record<string, unknown>
  created_at: string
  updated_at: string
  steps: {
    id: string
    step_type: string
    status: string
    output_json: Record<string, unknown>
    error_message: string | null
    created_at: string
    updated_at: string
  }[]
  reviews: {
    id: string
    decision: string
    comment: string | null
    created_by: string | null
    created_at: string
  }[]
}

interface ContentFactoryLocalAgentJobApi {
  id: string
  job_type: string
  status: string
  target_type: string | null
  target_id: string | null
  payload_json: Record<string, unknown>
  result_json: Record<string, unknown> | null
  error_message: string | null
  requested_by: string | null
  assigned_agent_id: string | null
  created_at: string
  updated_at: string
}

export interface AdminOrderItem {
  id: string
  number: string
  status: OrderStatus
  paymentStatus: string
  paymentMethod: string
  total: Prisma.Decimal | number
  createdAt: Date
  customerData: Prisma.JsonValue
  notes: string | null
  items: {
    id: string
    quantity: number
    price: Prisma.Decimal | number
    snapshot: Prisma.JsonValue
  }[]
}

export interface AdminReviewItem {
  id: string
  rating: number
  comment: string | null
  advantages: string | null
  disadvantages: string | null
  verifiedPurchase: boolean
  isVisible: boolean
  createdAt: Date
  user: {
    name: string | null
    email: string
  }
  product: {
    id: string
    slug: string
    translations: {
      name: string
    }[]
  }
}

export interface AdminCategoryItem {
  id: string
  slug: string
  parentId: string | null
  isActive: boolean
  sortOrder: number
  translations: {
    locale: string
    name: string
    description: string | null
  }[]
}

export interface AdminBrandItem {
  id: string
  slug: string
  name: string
  logo: string | null
  isActive: boolean
}

// Zod validations
const ProductImageInputSchema = z.object({
  id: z.string().optional(),
  url: z.string(),
  processedUrl: z.string().nullable().optional(),
  originalUrl: z.string().nullable().optional(),
  provider: z.enum(['LOCAL', 'CLOUDINARY', 'EXTERNAL']).default('LOCAL'),
  publicId: z.string().nullable().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  format: z.string().nullable().optional(),
  size: z.number().nullable().optional(),
  alt: z.string().nullable().optional(),
  sortOrder: z.number().default(0),
})

const SaveProductSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(1),
  slug: z.string().min(1),
  categoryId: z.string().min(1),
  brandId: z.string().nullable().optional(),
  price: z.number().positive(),
  comparePrice: z.number().nullable().optional(),
  costPrice: z.number().nullable().optional(),
  stock: z.number().int().nonnegative(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  sortOrder: z.number().default(0),
  nameUk: z.string().min(1),
  descriptionUk: z.string().optional(),
  metaTitleUk: z.string().nullable().optional(),
  metaDescUk: z.string().nullable().optional(),
  nameRu: z.string().min(1),
  descriptionRu: z.string().optional(),
  metaTitleRu: z.string().nullable().optional(),
  metaDescRu: z.string().nullable().optional(),
  images: z.array(ProductImageInputSchema).default([]),
  attributes: z.record(z.string(), z.string()).optional(),
  gtin: z.string().nullable().optional(),
  mpn: z.string().nullable().optional(),
  condition: z.enum(['NEW', 'USED', 'REFURBISHED']).default('NEW'),
  googleProductCategory: z.string().nullable().optional(),
  itemGroupId: z.string().nullable().optional(),
  salePrice: z.number().nullable().optional(),
  saleStartsAt: z.preprocess((val) => val === '' || val === null ? null : typeof val === 'string' ? new Date(val) : val, z.date().nullable().optional()),
  saleEndsAt: z.preprocess((val) => val === '' || val === null ? null : typeof val === 'string' ? new Date(val) : val, z.date().nullable().optional()),
})

const ContentFactoryLaunchSchema = z.object({
  productId: z.string().min(1),
  actionType: z.enum([
    'product_description',
    'main_image_infographic',
    'description_infographic',
    'article',
    'group_article',
    'video',
    'shorts',
    'factory_run',
  ]),
  providerMode: z.enum(['mock', 'manual', 'cheap', 'quality']).default('mock'),
  language: z.string().min(2).default('uk-UA'),
  operatorNotes: z.string().optional(),
  autoApproveBrief: z.boolean().default(true),
  generateAsset: z.boolean().default(true),
  autoApproveAsset: z.boolean().default(false),
  exportCms: z.boolean().default(false),
})

const ContentFactoryProductIdsSchema = z.array(z.string().min(1)).max(100)

const SaveCategorySchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  nameUk: z.string().min(1),
  descriptionUk: z.string().optional(),
  nameRu: z.string().min(1),
  descriptionRu: z.string().optional(),
})

const SaveBrandSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  logo: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
})

export async function getProductsAdmin(params: {
  page?: number | undefined
  limit?: number | undefined
  search?: string | undefined
  categoryId?: string | undefined
  brandId?: string | undefined
  status?: string | undefined // 'all' | 'active' | 'hidden'
  stock?: string | undefined // 'all' | 'inStock' | 'outOfStock'
  quality?: string | undefined // 'all' | 'no-photo' | 'no-price' | 'no-brand' | 'no-desc-uk' | 'no-desc-ru'
  featured?: string | undefined // 'all' | 'featured' | 'regular'
  sort?: string | undefined
} = {}) {
  try {
    await requireAdmin()

    const page = params.page ?? 1
    const limit = params.limit ?? 20
    const skip = (page - 1) * limit
    const { search, categoryId, brandId, status, stock, quality, featured, sort } = params

    const where: Prisma.ProductWhereInput = {}
    const conditions: Prisma.ProductWhereInput[] = []

    if (search) {
      conditions.push({
        OR: [
          { sku: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
          { translations: { some: { name: { contains: search, mode: 'insensitive' } } } },
        ],
      })
    }

    if (categoryId && categoryId !== 'all') {
      conditions.push({ categoryId })
    }

    if (brandId && brandId !== 'all') {
      conditions.push({ brandId: brandId === 'none' ? null : brandId })
    }

    if (status === 'active') {
      conditions.push({ isActive: true })
    } else if (status === 'hidden') {
      conditions.push({ isActive: false })
    }

    if (stock === 'inStock') {
      conditions.push({ stock: { gt: 0 } })
    } else if (stock === 'outOfStock') {
      conditions.push({ stock: 0 })
    }

    if (featured === 'featured') {
      conditions.push({ isFeatured: true })
    } else if (featured === 'regular') {
      conditions.push({ isFeatured: false })
    }

    if (quality === 'no-photo') {
      conditions.push({ images: { none: {} } })
    } else if (quality === 'no-price') {
      conditions.push({ price: { lte: 0 } })
    } else if (quality === 'no-brand') {
      conditions.push({ brandId: null })
    } else if (quality === 'no-desc-uk') {
      conditions.push({
        OR: [
          { translations: { none: { locale: 'uk' } } },
          { translations: { some: { locale: 'uk', OR: [{ description: null }, { description: '' }] } } },
        ],
      })
    } else if (quality === 'no-desc-ru') {
      conditions.push({
        OR: [
          { translations: { none: { locale: 'ru' } } },
          { translations: { some: { locale: 'ru', OR: [{ description: null }, { description: '' }] } } },
        ],
      })
    }

    if (conditions.length > 0) {
      where.AND = conditions
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }
    if (sort === 'createdAt_asc') {
      orderBy = { createdAt: 'asc' }
    } else if (sort === 'createdAt_desc') {
      orderBy = { createdAt: 'desc' }
    } else if (sort === 'updatedAt_asc') {
      orderBy = { updatedAt: 'asc' }
    } else if (sort === 'updatedAt_desc') {
      orderBy = { updatedAt: 'desc' }
    } else if (sort === 'price_asc') {
      orderBy = { price: 'asc' }
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' }
    } else if (sort === 'stock_asc') {
      orderBy = { stock: 'asc' }
    } else if (sort === 'stock_desc') {
      orderBy = { stock: 'desc' }
    } else if (sort === 'name_asc') {
      orderBy = { slug: 'asc' }
    } else if (sort === 'name_desc') {
      orderBy = { slug: 'desc' }
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: limit,
        skip,
        orderBy,
        select: {
          id: true,
          sku: true,
          slug: true,
          categoryId: true,
          brandId: true,
          price: true,
          comparePrice: true,
          costPrice: true,
          stock: true,
          isActive: true,
          isFeatured: true,
          attributes: true,
          sortOrder: true,
          gtin: true,
          mpn: true,
          condition: true,
          googleProductCategory: true,
          itemGroupId: true,
          salePrice: true,
          saleStartsAt: true,
          saleEndsAt: true,
          translations: {
            select: { locale: true, name: true, description: true, metaTitle: true, metaDesc: true },
          },
          category: {
            select: {
              id: true,
              translations: {
                where: { locale: 'uk' },
                select: { name: true },
              },
            },
          },
          brand: {
            select: { id: true, name: true },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
            select: {
              id: true,
              provider: true,
              publicId: true,
              url: true,
              processedUrl: true,
              originalUrl: true,
              width: true,
              height: true,
              format: true,
              size: true,
              alt: true,
              sortOrder: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    const parsedItems = items.map((item) => ({
      ...item,
      price: Number(item.price),
      comparePrice: item.comparePrice ? Number(item.comparePrice) : null,
      costPrice: item.costPrice ? Number(item.costPrice) : null,
      salePrice: item.salePrice ? Number(item.salePrice) : null,
    }))

    return { success: true, items: parsedItems, total, totalPages: Math.ceil(total / limit) }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error loading products' }
  }
}

export async function getProductAdminStats() {
  try {
    await requireAdmin()
    const [
      total,
      active,
      inStock,
      withoutImages,
      withoutPrice,
      withoutBrand,
      withoutDescUk,
      withoutDescRu,
      featured,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { stock: { gt: 0 } } }),
      prisma.product.count({ where: { images: { none: {} } } }),
      prisma.product.count({ where: { price: { lte: 0 } } }),
      prisma.product.count({ where: { brandId: null } }),
      prisma.product.count({
        where: {
          OR: [
            { translations: { none: { locale: 'uk' } } },
            { translations: { some: { locale: 'uk', OR: [{ description: null }, { description: '' }] } } },
          ],
        },
      }),
      prisma.product.count({
        where: {
          OR: [
            { translations: { none: { locale: 'ru' } } },
            { translations: { some: { locale: 'ru', OR: [{ description: null }, { description: '' }] } } },
          ],
        },
      }),
      prisma.product.count({ where: { isFeatured: true } }),
    ])

    return {
      success: true,
      stats: {
        total,
        active,
        inactive: total - active,
        inStock,
        outOfStock: total - inStock,
        withoutImages,
        withoutPrice,
        withoutBrand,
        withoutDescUk,
        withoutDescRu,
        featured,
      },
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error loading stats' }
  }
}

export async function launchContentFactoryForProductAdmin(
  input: z.infer<typeof ContentFactoryLaunchSchema>
): Promise<ContentFactoryLaunchResult> {
  try {
    await requireAdmin()
    const parsed = ContentFactoryLaunchSchema.safeParse(input)
    if (!parsed.success) return { success: false, error: 'Validation failed' }

    const val = parsed.data
    const product = await loadContentFactoryProduct(val.productId)

    if (!product) return { success: false, error: 'Product not found' }
    const shouldGenerateAsset = val.generateAsset && isContentFactoryAssetAction(val.actionType)

    const factoryRun = await contentFactoryRequest<{ id: string; status: string }>('/api/cms-admin/factory-runs', {
      method: 'POST',
      body: JSON.stringify({
        source_type: 'custom',
        source_id: `electronom:${product.id}`,
        action_type: val.actionType,
        language: val.language,
        provider_mode: val.providerMode,
        operator_notes: buildContentFactoryProductContext(product, val.operatorNotes, val.actionType),
        created_by: 'electronom-admin',
      }),
    })

    const localAgentJob = await contentFactoryRequest<{ id: string; status: string }>('/api/local-agent/jobs', {
      method: 'POST',
      body: JSON.stringify({
        job_type: 'factory_run.execute',
        target_type: 'factory_run',
        target_id: factoryRun.id,
        priority: val.autoApproveAsset || val.exportCms ? 20 : 50,
        payload_json: {
          run_id: factoryRun.id,
          auto_approve_brief: val.autoApproveBrief,
          generate_asset: shouldGenerateAsset,
          auto_approve_asset: shouldGenerateAsset && val.autoApproveAsset,
          export_cms: val.exportCms,
        },
        requested_by: val.exportCms ? 'electronom_admin_full_auto' : 'electronom_admin_safe_queue',
      }),
    })

    return {
      success: true,
      factoryRunId: factoryRun.id,
      localAgentJobId: localAgentJob.id,
      factoryRunStatus: factoryRun.status,
      localAgentJobStatus: localAgentJob.status,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Content Factory launch failed',
    }
  }
}

export async function getContentFactoryProductStatusesAdmin(
  productIds: string[]
): Promise<ContentFactoryStatusListResult> {
  try {
    await requireAdmin()
    const parsedIds = ContentFactoryProductIdsSchema.safeParse(productIds)
    if (!parsedIds.success) return { success: false, error: 'Invalid product IDs' }

    const [runs, jobs] = await Promise.all([
      contentFactoryRequest<ContentFactoryRunApi[]>('/api/cms-admin/factory-runs?limit=100', { method: 'GET' }),
      contentFactoryRequest<ContentFactoryLocalAgentJobApi[]>('/api/local-agent/jobs?limit=100', { method: 'GET' }),
    ])

    const statuses: Record<string, ContentFactoryProductStatus> = {}
    for (const productId of parsedIds.data) {
      const sourceId = `electronom:${productId}`
      const run = runs.find((item) => item.source_id === sourceId)
      if (!run) continue
      const job = jobs.find((item) => item.target_type === 'factory_run' && item.target_id === run.id)
      statuses[productId] = buildContentFactoryProductStatus(productId, run, job)
    }

    return { success: true, statuses }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Content Factory status check failed',
    }
  }
}

export async function getContentFactoryRunResultAdmin(runId: string): Promise<ContentFactoryRunResult> {
  try {
    await requireAdmin()
    const parsedRunId = z.string().min(1).safeParse(runId)
    if (!parsedRunId.success) return { success: false, error: 'Invalid factory run ID' }

    const [run, jobs] = await Promise.all([
      contentFactoryRequest<ContentFactoryRunApi>(`/api/cms-admin/factory-runs/${parsedRunId.data}`, {
        method: 'GET',
      }),
      contentFactoryRequest<ContentFactoryLocalAgentJobApi[]>('/api/local-agent/jobs?limit=100', {
        method: 'GET',
      }),
    ])

    return {
      success: true,
      run,
      jobs: jobs.filter((item) => item.target_type === 'factory_run' && item.target_id === run.id),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Content Factory result load failed',
    }
  }
}

function buildContentFactoryProductStatus(
  productId: string,
  run: ContentFactoryRunApi,
  job: ContentFactoryLocalAgentJobApi | undefined
): ContentFactoryProductStatus {
  const result = job?.result_json || {}
  const nextAction = typeof result.next_action === 'string' ? result.next_action : null
  const gate = typeof run.result_json?.current_gate === 'string' ? run.result_json.current_gate : null
  return {
    productId,
    sourceId: run.source_id,
    factoryRunId: run.id,
    factoryRunStatus: run.status,
    factoryRunGate: gate,
    actionType: run.action_type,
    updatedAt: run.updated_at,
    localAgentJobId: job?.id || null,
    localAgentJobStatus: job?.status || null,
    localAgentNextAction: nextAction,
  }
}

function isContentFactoryAssetAction(actionType: ContentFactoryActionType): boolean {
  return actionType === 'main_image_infographic' || actionType === 'description_infographic'
}

async function contentFactoryRequest<T>(path: string, init: RequestInit): Promise<T> {
  const baseUrl = (env.CONTENT_FACTORY_API_URL || 'http://127.0.0.1:8028').replace(/\/$/, '')
  const token = env.CONTENT_FACTORY_TOKEN?.trim()
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Content Factory ${response.status}: ${message || response.statusText}`)
  }

  return (await response.json()) as T
}

function buildContentFactoryProductContext(
  product: NonNullable<Awaited<ReturnType<typeof loadContentFactoryProduct>>>,
  operatorNotes: string | undefined,
  actionType: ContentFactoryActionType
): string {
  const uk = product.translations.find((item) => item.locale === 'uk')
  const ru = product.translations.find((item) => item.locale === 'ru')
  const imageRefs = product.images.map((image, index) => {
    return `${index + 1}. ${image.url} (${image.provider}${image.publicId ? `, publicId=${image.publicId}` : ''})`
  })
  const storefrontUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/uk/product/${product.slug}`
  const visualRules = ['main_image_infographic', 'description_infographic', 'video', 'shorts', 'factory_run'].includes(actionType)
    ? [
        '',
        '## Visual generation rules',
        '- Use real product photo references. Do not replace the product with a rendered substitute.',
        '- Do not add price badges unless the operator explicitly asks for them.',
        '- Exact numbers must come only from product facts or reviewed research.',
        '- The design must answer the buyer question: why should I buy this product, what pain does it close?',
      ].join('\n')
    : ''

  return [
    '# Electronom product context',
    '',
    `Product ID: ${product.id}`,
    `SKU: ${product.sku}`,
    `Slug: ${product.slug}`,
    `Storefront URL: ${storefrontUrl}`,
    `Action type: ${actionType}`,
    '',
    '## Names',
    `UK: ${uk?.name || '-'}`,
    `RU: ${ru?.name || '-'}`,
    '',
    '## Commercial facts',
    `Price: ${product.price}`,
    `Compare price: ${product.comparePrice || '-'}`,
    `Cost price: ${product.costPrice || '-'}`,
    `Stock: ${product.stock}`,
    `Active: ${product.isActive ? 'yes' : 'no'}`,
    `Featured: ${product.isFeatured ? 'yes' : 'no'}`,
    `Category: ${product.category?.translations.find((item) => item.locale === 'uk')?.name || product.category?.slug || product.category?.id || '-'}`,
    `Brand: ${product.brand?.name || '-'}`,
    '',
    '## Descriptions',
    `UK description: ${uk?.description || '-'}`,
    `RU description: ${ru?.description || '-'}`,
    '',
    '## Images',
    imageRefs.length ? imageRefs.join('\n') : 'No product images found.',
    '',
    '## Attributes',
    JSON.stringify(product.attributes || {}, null, 2),
    visualRules,
    '',
    '## Operator notes',
    operatorNotes || '-',
  ].join('\n')
}

async function loadContentFactoryProduct(productId: string) {
  return prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      sku: true,
      slug: true,
      price: true,
      comparePrice: true,
      costPrice: true,
      stock: true,
      isActive: true,
      isFeatured: true,
      attributes: true,
      translations: {
        select: { locale: true, name: true, description: true, metaTitle: true, metaDesc: true },
      },
      category: {
        select: {
          id: true,
          slug: true,
          translations: { select: { locale: true, name: true } },
        },
      },
      brand: { select: { id: true, name: true } },
      images: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          provider: true,
          publicId: true,
          url: true,
          processedUrl: true,
          width: true,
          height: true,
          format: true,
          size: true,
          alt: true,
          sortOrder: true,
        },
      },
    },
  })
}

const BulkIdsSchema = z.array(z.string().min(1)).min(1).max(100)

export async function bulkToggleProductsActiveAdmin(ids: string[], isActive: boolean) {
  try {
    await requireAdmin()
    const parsedIds = BulkIdsSchema.safeParse(ids)
    if (!parsedIds.success) return { success: false, error: 'Invalid IDs' }
    const parsedIsActive = z.boolean().safeParse(isActive)
    if (!parsedIsActive.success) return { success: false, error: 'Invalid active state' }

    await prisma.product.updateMany({
      where: { id: { in: parsedIds.data } },
      data: { isActive: parsedIsActive.data },
    })

    for (const id of parsedIds.data) {
      await syncProductIndex(id)
    }

    revalidateTag('products', 'max')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error in bulk update' }
  }
}

export async function bulkSyncProductsAlgoliaAdmin(ids: string[]) {
  try {
    await requireAdmin()
    const parsedIds = BulkIdsSchema.safeParse(ids)
    if (!parsedIds.success) return { success: false, error: 'Invalid IDs' }

    for (const id of parsedIds.data) {
      await syncProductIndex(id)
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error in bulk sync' }
  }
}

export async function bulkUpdateProductsCategoryAdmin(ids: string[], categoryId: string) {
  try {
    await requireAdmin()
    const parsedIds = BulkIdsSchema.safeParse(ids)
    if (!parsedIds.success) return { success: false, error: 'Invalid IDs' }
    const parsedCategoryId = z.string().min(1).safeParse(categoryId)
    if (!parsedCategoryId.success) return { success: false, error: 'Invalid Category ID' }

    await prisma.product.updateMany({
      where: { id: { in: parsedIds.data } },
      data: { categoryId: parsedCategoryId.data },
    })

    for (const id of parsedIds.data) {
      await syncProductIndex(id)
    }

    revalidateTag('products', 'max')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error in bulk update' }
  }
}

export async function bulkUpdateProductsBrandAdmin(ids: string[], brandId: string | null) {
  try {
    await requireAdmin()
    const parsedIds = BulkIdsSchema.safeParse(ids)
    if (!parsedIds.success) return { success: false, error: 'Invalid IDs' }
    const parsedBrandId = z.string().min(1).nullable().optional().safeParse(brandId)
    if (!parsedBrandId.success) return { success: false, error: 'Invalid Brand ID' }

    await prisma.product.updateMany({
      where: { id: { in: parsedIds.data } },
      data: { brandId: parsedBrandId.data || null },
    })

    for (const id of parsedIds.data) {
      await syncProductIndex(id)
    }

    revalidateTag('products', 'max')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error in bulk update' }
  }
}

export async function duplicateProductAdmin(productId: string) {
  try {
    await requireAdmin()
    const parsedId = z.string().min(1).safeParse(productId)
    if (!parsedId.success) return { success: false, error: 'Invalid Product ID' }

    const valId = parsedId.data
    const existing = await prisma.product.findUnique({
      where: { id: valId },
      select: {
        sku: true,
        slug: true,
        categoryId: true,
        brandId: true,
        price: true,
        comparePrice: true,
        costPrice: true,
        stock: true,
        isActive: true,
        isFeatured: true,
        attributes: true,
        sortOrder: true,
        gtin: true,
        mpn: true,
        condition: true,
        googleProductCategory: true,
        itemGroupId: true,
        salePrice: true,
        saleStartsAt: true,
        saleEndsAt: true,
        translations: {
          select: { locale: true, name: true, description: true },
        },
        images: {
          select: { url: true, processedUrl: true, originalUrl: true, provider: true, publicId: true, width: true, height: true, format: true, size: true, alt: true, sortOrder: true },
        },
      },
    })

    if (!existing) return { success: false, error: 'Product not found' }

    const suffix = Math.floor(1000 + Math.random() * 9000).toString()
    const newSku = `${existing.sku}-COPY-${suffix}`
    const newSlug = `${existing.slug}-copy-${suffix}`

    const newProduct = await prisma.product.create({
      data: {
        sku: newSku,
        slug: newSlug,
        categoryId: existing.categoryId,
        brandId: existing.brandId,
        price: existing.price,
        comparePrice: existing.comparePrice,
        costPrice: existing.costPrice,
        stock: existing.stock,
        isActive: false, // Hidden by default when duplicated
        isFeatured: existing.isFeatured,
        attributes: existing.attributes || {},
        sortOrder: existing.sortOrder,
        gtin: existing.gtin,
        mpn: existing.mpn,
        condition: existing.condition,
        googleProductCategory: existing.googleProductCategory,
        itemGroupId: existing.itemGroupId,
        salePrice: existing.salePrice,
        saleStartsAt: existing.saleStartsAt,
        saleEndsAt: existing.saleEndsAt,
        translations: {
          create: existing.translations.map((t) => ({
            locale: t.locale,
            name: `${t.name} (Copy)`,
            description: t.description,
          })),
        },
        images: {
          create: existing.images.map((img) => ({
            url: img.url,
            processedUrl: img.processedUrl,
            originalUrl: img.originalUrl,
            provider: 'EXTERNAL', // Cloned images use EXTERNAL provider to break shared ownership
            publicId: null,      // Cloned images clear publicId to break shared ownership
            width: img.width,
            height: img.height,
            format: img.format,
            size: img.size,
            alt: img.alt,
            sortOrder: img.sortOrder,
          })),
        },
      },
      select: { id: true },
    })

    await syncProductIndex(newProduct.id)
    revalidateTag('products', 'max')

    return { success: true, productId: newProduct.id }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error duplicating product' }
  }
}

export async function saveProductAdmin(data: z.infer<typeof SaveProductSchema>) {
  try {
    await requireAdmin()
    const parsed = SaveProductSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: 'Validation failed' }
    }

    const val = parsed.data
    const {
      id, nameUk, metaTitleUk, metaDescUk,
      nameRu, metaTitleRu, metaDescRu, images,
    } = val
    // A-2: Sanitize HTML descriptions on write (prevents stored XSS)
    const descriptionUk = val.descriptionUk ? sanitizeHtml(val.descriptionUk) : null
    const descriptionRu = val.descriptionRu ? sanitizeHtml(val.descriptionRu) : null

    // Explicit mapping to prevent undefined in exactOptionalPropertyTypes
    const fields = {
      sku: val.sku,
      slug: val.slug,
      categoryId: val.categoryId,
      brandId: val.brandId || null,
      price: val.price,
      comparePrice: val.comparePrice !== undefined && val.comparePrice !== null ? val.comparePrice : null,
      costPrice: val.costPrice !== undefined && val.costPrice !== null ? val.costPrice : null,
      stock: val.stock,
      isActive: val.isActive,
      isFeatured: val.isFeatured,
      attributes: (val.attributes || {}) as Prisma.InputJsonValue,
      sortOrder: val.sortOrder,
      gtin: val.gtin || null,
      mpn: val.mpn || null,
      condition: val.condition,
      googleProductCategory: val.googleProductCategory || null,
      itemGroupId: val.itemGroupId || null,
      salePrice: val.salePrice !== undefined && val.salePrice !== null ? val.salePrice : null,
      saleStartsAt: val.saleStartsAt || null,
      saleEndsAt: val.saleEndsAt || null,
    }

    let product
    if (id) {
      // Fetch existing images to identify deleted ones before DB update
      const existingImages = await prisma.productImage.findMany({
        where: { productId: id },
        select: { id: true, url: true, provider: true, publicId: true },
      })

      const newUrls = new Set(images.map((img) => img.url))
      const imagesToDelete = existingImages.filter((img) => !newUrls.has(img.url))

      // Execute all DB modifications inside a transaction
      product = await prisma.$transaction(async (tx) => {
        const updatedProduct = await tx.product.update({
          where: { id },
          data: {
            ...fields,
            translations: {
              upsert: [
                {
                  where: { productId_locale: { productId: id, locale: 'uk' } },
                  update: { name: nameUk, description: descriptionUk ?? null, metaTitle: metaTitleUk ?? null, metaDesc: metaDescUk ?? null },
                  create: { locale: 'uk', name: nameUk, description: descriptionUk ?? null, metaTitle: metaTitleUk ?? null, metaDesc: metaDescUk ?? null },
                },
                {
                  where: { productId_locale: { productId: id, locale: 'ru' } },
                  update: { name: nameRu, description: descriptionRu ?? null, metaTitle: metaTitleRu ?? null, metaDesc: metaDescRu ?? null },
                  create: { locale: 'ru', name: nameRu, description: descriptionRu ?? null, metaTitle: metaTitleRu ?? null, metaDesc: metaDescRu ?? null },
                },
              ],
            },
          },
          select: { id: true },
        })

        await tx.productImage.deleteMany({ where: { productId: id } })
        
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img, idx) => ({
              productId: id,
              url: img.url,
              processedUrl: img.processedUrl || null,
              originalUrl: img.originalUrl || null,
              provider: img.provider,
              publicId: img.publicId || null,
              width: img.width || null,
              height: img.height || null,
              format: img.format || null,
              size: img.size || null,
              alt: img.alt || null,
              sortOrder: img.sortOrder ?? idx,
            })),
          })
        }

        return updatedProduct
      })

      // Safely delete removed files from storage provider after successful DB commit
      for (const img of imagesToDelete) {
        try {
          if (img.provider === 'CLOUDINARY' || img.provider === 'LOCAL') {
            await deleteProductImage(img.publicId, img.provider as 'CLOUDINARY' | 'LOCAL', img.url)
          }
        } catch (storageErr) {
          console.error(`Failed to clean up storage image ${img.url}:`, storageErr)
        }
      }
    } else {
      // Create product
      product = await prisma.product.create({
        data: {
          ...fields,
          translations: {
            create: [
              { locale: 'uk', name: nameUk, description: descriptionUk ?? null, metaTitle: metaTitleUk ?? null, metaDesc: metaDescUk ?? null },
              { locale: 'ru', name: nameRu, description: descriptionRu ?? null, metaTitle: metaTitleRu ?? null, metaDesc: metaDescRu ?? null },
            ],
          },
          images: {
            create: images.map((img, idx) => ({
              url: img.url,
              processedUrl: img.processedUrl || null,
              originalUrl: img.originalUrl || null,
              provider: img.provider,
              publicId: img.publicId || null,
              width: img.width || null,
              height: img.height || null,
              format: img.format || null,
              size: img.size || null,
              alt: img.alt || null,
              sortOrder: img.sortOrder ?? idx,
            })),
          },
        },
        select: { id: true },
      })
    }

    // Sync to Algolia
    await syncProductIndex(product.id)
    revalidateTag('products', 'max')

    return { success: true, productId: product.id }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error saving product' }
  }
}

export async function toggleProductActiveAdmin(productId: string) {
  try {
    await requireAdmin()
    const parsedId = z.string().min(1).safeParse(productId)
    if (!parsedId.success) return { success: false, error: 'Invalid Product ID' }

    const valId = parsedId.data
    const product = await prisma.product.findUnique({
      where: { id: valId },
      select: { id: true, isActive: true },
    })

    if (!product) return { success: false, error: 'Product not found' }

    const updated = await prisma.product.update({
      where: { id: valId },
      data: { isActive: !product.isActive },
      select: { id: true, isActive: true },
    })

    await syncProductIndex(valId)
    revalidateTag('products', 'max')

    return { success: true, isActive: updated.isActive }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error toggling state' }
  }
}

export async function updateProductStockAdmin(productId: string, stock: number) {
  try {
    await requireAdmin()
    const parsed = z.object({
      productId: z.string().min(1),
      stock: z.number().int().nonnegative(),
    }).safeParse({ productId, stock })
    
    if (!parsed.success) return { success: false, error: 'Validation failed' }

    const val = parsed.data
    await prisma.product.update({
      where: { id: val.productId },
      data: { stock: val.stock },
      select: { id: true },
    })

    await syncProductIndex(val.productId)
    revalidateTag('products', 'max')

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error updating stock' }
  }
}

export async function deleteProductAdmin(productId: string) {
  try {
    await requireAdmin()
    const parsedId = z.string().min(1).safeParse(productId)
    if (!parsedId.success) return { success: false, error: 'Invalid Product ID' }

    const valId = parsedId.data

    // 1. Fetch images and details first
    const product = await prisma.product.findUnique({
      where: { id: valId },
      select: {
        id: true,
        images: {
          select: { url: true, provider: true, publicId: true },
        },
      },
    })

    if (!product) return { success: false, error: 'Product not found' }

    // 2. Perform database deletion first (cascade delete or manual transaction of relations and product)
    await prisma.$transaction(async (tx) => {
      // Delete translation relations manually in case cascade is not set up
      await tx.productTranslation.deleteMany({ where: { productId: valId } })
      // Delete image records
      await tx.productImage.deleteMany({ where: { productId: valId } })
      // Delete the product itself
      await tx.product.delete({ where: { id: valId } })
    })

    // 3. Perform storage / search index cleanups as best-effort AFTER database delete succeeds
    for (const img of product.images) {
      try {
        if (img.provider === 'LOCAL' || img.provider === 'CLOUDINARY') {
          await deleteProductImage(img.publicId, img.provider as 'CLOUDINARY' | 'LOCAL', img.url)
        }
      } catch (storageErr) {
        console.error(`Failed to clean up storage image ${img.url}:`, storageErr)
      }
    }

    try {
      await removeProductFromIndex(valId)
    } catch (algoliaErr) {
      console.error(`Failed to remove product ${valId} from search index:`, algoliaErr)
    }

    revalidateTag('products', 'max')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error deleting product' }
  }
}

export async function getOrdersAdmin(page = 1, limit = 20, status?: string) {
  try {
    await requireAdmin()
    const skip = (page - 1) * limit
    const where: Prisma.OrderWhereInput = {}
    if (status) {
      where.status = status as OrderStatus
    }

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          number: true,
          status: true,
          paymentStatus: true,
          paymentMethod: true,
          total: true,
          createdAt: true,
          customerData: true,
          notes: true,
          items: {
            select: {
              id: true,
              quantity: true,
              price: true,
              snapshot: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ])

    return { success: true, items, total, totalPages: Math.ceil(total / limit) }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error loading orders' }
  }
}

export async function updateOrderStatusAdmin(orderId: string, status: OrderStatus) {
  try {
    await requireAdmin()
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
      select: { id: true },
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error updating status' }
  }
}

export async function updateOrderNotesAdmin(orderId: string, notes: string) {
  try {
    await requireAdmin()
    await prisma.order.update({
      where: { id: orderId },
      data: { notes },
      select: { id: true },
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error updating notes' }
  }
}

export async function getCategoriesBrandsAdmin() {
  try {
    await requireAdmin()
    const [categories, brands] = await Promise.all([
      prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
        take: 100,
        select: {
          id: true,
          slug: true,
          parentId: true,
          isActive: true,
          sortOrder: true,
          translations: {
            select: { locale: true, name: true, description: true },
          },
        },
      }),
      prisma.brand.findMany({
        orderBy: { name: 'asc' },
        take: 100,
        select: {
          id: true,
          slug: true,
          name: true,
          logo: true,
          isActive: true,
        },
      }),
    ])

    return { success: true, categories, brands }
  } catch (error) {
    return {
      success: false,
      categories: [],
      brands: [],
      error: error instanceof Error ? error.message : 'Error loading metadata',
    }
  }
}

export async function saveCategoryAdmin(data: z.infer<typeof SaveCategorySchema>) {
  try {
    await requireAdmin()
    const parsed = SaveCategorySchema.safeParse(data)
    if (!parsed.success) return { success: false, error: 'Validation failed' }

    const val = parsed.data
    const { id, nameUk, descriptionUk, nameRu, descriptionRu } = val

    // Explicit mapping to prevent undefined in exactOptionalPropertyTypes
    const fields = {
      slug: val.slug,
      parentId: val.parentId || null,
      sortOrder: val.sortOrder,
      isActive: val.isActive,
    }

    if (id) {
      await prisma.category.update({
        where: { id },
        data: {
          ...fields,
          translations: {
            upsert: [
              {
                where: { categoryId_locale: { categoryId: id, locale: 'uk' } },
                update: { name: nameUk, description: descriptionUk ?? null },
                create: { locale: 'uk', name: nameUk, description: descriptionUk ?? null },
              },
              {
                where: { categoryId_locale: { categoryId: id, locale: 'ru' } },
                update: { name: nameRu, description: descriptionRu ?? null },
                create: { locale: 'ru', name: nameRu, description: descriptionRu ?? null },
              },
            ],
          },
        },
        select: { id: true },
      })
    } else {
      await prisma.category.create({
        data: {
          ...fields,
          translations: {
            create: [
              { locale: 'uk', name: nameUk, description: descriptionUk ?? null },
              { locale: 'ru', name: nameRu, description: descriptionRu ?? null },
            ],
          },
        },
        select: { id: true },
      })
    }

    revalidateTag('categories', 'max')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error saving category' }
  }
}

export async function saveBrandAdmin(data: z.infer<typeof SaveBrandSchema>) {
  try {
    await requireAdmin()
    const parsed = SaveBrandSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: 'Validation failed' }

    const val = parsed.data
    const { id } = val

    // Explicit mapping to prevent undefined in exactOptionalPropertyTypes
    const fields = {
      slug: val.slug,
      name: val.name,
      logo: val.logo || null,
      isActive: val.isActive,
    }

    if (id) {
      await prisma.brand.update({
        where: { id },
        data: fields,
        select: { id: true },
      })
    } else {
      await prisma.brand.create({
        data: fields,
        select: { id: true },
      })
    }

    revalidateTag('brands', 'max')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error saving brand' }
  }
}

// ─── Reviews Management ────────────────────────────────────────────────────────

export async function getReviewsAdmin(page = 1, limit = 20, isVisible?: boolean) {
  try {
    await requireAdmin()
    const skip = (page - 1) * limit
    const where: Prisma.ReviewWhereInput = {}
    if (isVisible !== undefined) {
      where.isVisible = isVisible
    }

    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          rating: true,
          comment: true,
          advantages: true,
          disadvantages: true,
          verifiedPurchase: true,
          isVisible: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          product: {
            select: {
              id: true,
              slug: true,
              translations: {
                where: { locale: 'uk' },
                select: { name: true },
                take: 1,
              },
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ])

    return { success: true, items, total, totalPages: Math.ceil(total / limit) }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error loading reviews' }
  }
}

export async function toggleReviewVisibilityAdmin(reviewId: string) {
  try {
    await requireAdmin()
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, isVisible: true, productId: true, product: { select: { slug: true } } },
    })

    if (!review) return { success: false, error: 'Review not found' }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { isVisible: !review.isVisible },
      select: { id: true, isVisible: true },
    })

    // Revalidate product cache tag when visible reviews change
    revalidateTag(`product-${review.product.slug}`, 'max')
    revalidateTag('products', 'max')

    return { success: true, isVisible: updated.isVisible }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error updating review' }
  }
}

export async function deleteReviewAdmin(reviewId: string) {
  try {
    await requireAdmin()
    const review = await prisma.review.delete({
      where: { id: reviewId },
      select: { product: { select: { slug: true } } },
    })

    // Revalidate product cache tag
    revalidateTag(`product-${review.product.slug}`, 'max')
    revalidateTag('products', 'max')

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Error deleting review' }
  }
}
