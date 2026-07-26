import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import * as fs from 'fs'

const MANIFEST_PATH = 'D:/elektronom_photos/cloudinary_uploads_new.jsonl'
const OLD_MANIFEST_PATH = 'D:/elektronom_photos/cloudinary_uploads.jsonl'

async function main() {
  console.log('Linking all new Cloudinary URLs to Prisma DB...')

  const skuToUrl = new Map<string, string>()
  const oldImageIdToSku = new Map<string, string>()

  if (fs.existsSync(OLD_MANIFEST_PATH)) {
    const lines = fs.readFileSync(OLD_MANIFEST_PATH, 'utf-8').split('\n')
    for (const line of lines) {
      if (!line.trim()) continue
      try {
        const r = JSON.parse(line)
        if (r.imageId && r.sku) {
          oldImageIdToSku.set(r.imageId, r.sku)
        }
      } catch {}
    }
  }

  if (fs.existsSync(MANIFEST_PATH)) {
    const lines = fs.readFileSync(MANIFEST_PATH, 'utf-8').split('\n')
    for (const line of lines) {
      if (!line.trim()) continue
      try {
        const r = JSON.parse(line)
        if (r.sku && r.url) {
          skuToUrl.set(r.sku, r.url)
        }
      } catch {}
    }
  }

  console.log(`Found ${skuToUrl.size} new Cloudinary URLs in manifest.`)

  const entries = [...oldImageIdToSku.entries()]
  console.log(`Processing up to ${entries.length} ProductImage DB records...`)

  let updatedCount = 0
  let skippedCount = 0
  let errCount = 0

  const BATCH_SIZE = 25
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE)
    await Promise.all(
      batch.map(async ([imageId, sku]) => {
        const newUrl = skuToUrl.get(sku)
        if (!newUrl) {
          skippedCount++
          return
        }
        try {
          await prisma.productImage.update({
            where: { id: imageId },
            data: {
              processedUrl: newUrl,
              provider: 'CLOUDINARY',
            },
          })
          updatedCount++
        } catch {
          errCount++
        }
      })
    )
    if (i % 2500 === 0) {
      console.log(`DB Update progress: ${updatedCount} updated | ${skippedCount} not yet uploaded | ${errCount} err`)
    }
  }

  console.log(`Finished batch DB sync! Total updated: ${updatedCount}, Pending uploads: ${skippedCount}, Errors: ${errCount}`)
}

main().finally(() => process.exit(0))
