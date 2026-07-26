import { v2 as cloudinary } from 'cloudinary'
import * as fs from 'fs'
import * as path from 'path'

cloudinary.config({
  cloud_name: 'bzzecoeb',
  api_key: '227326675718179',
  api_secret: '4llIVU1_VBoeFPFf5-QexyPLVz8',
})

const PROCESSED_DIR = 'D:/elektronom_photos/processed'
const MANIFEST_PATH = 'D:/elektronom_photos/cloudinary_uploads_new.jsonl'
const STATUS_PATH = 'D:/elektronom_photos/_upload_new_status.json'
const CONCURRENCY = 10

async function main() {
  console.log('Starting bulk upload to Cloudinary (bzzecoeb)...')
  
  const uploaded = new Set<string>()
  if (fs.existsSync(MANIFEST_PATH)) {
    const lines = fs.readFileSync(MANIFEST_PATH, 'utf-8').split('\n')
    for (const line of lines) {
      if (!line.trim()) continue
      try {
        const parsed = JSON.parse(line)
        if (parsed.filename) uploaded.add(parsed.filename)
      } catch {}
    }
  }
  console.log(`Already uploaded ${uploaded.size} files previously.`)

  const allFiles = fs.readdirSync(PROCESSED_DIR).filter(f => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png'))
  const pendingFiles = allFiles.filter(f => !uploaded.has(f))
  
  console.log(`Total files: ${allFiles.length}, Pending: ${pendingFiles.length}`)

  let doneCount = uploaded.size
  let errCount = 0

  const outStream = fs.createWriteStream(MANIFEST_PATH, { flags: 'a' })

  for (let i = 0; i < pendingFiles.length; i += CONCURRENCY) {
    const batch = pendingFiles.slice(i, i + CONCURRENCY)
    await Promise.all(
      batch.map(async (filename) => {
        const filePath = path.join(PROCESSED_DIR, filename)
        const nameWithoutExt = path.parse(filename).name
        const publicId = `elektronom/products/${nameWithoutExt}`
        
        try {
          const res = await cloudinary.uploader.upload(filePath, {
            public_id: publicId,
            overwrite: true,
            resource_type: 'image',
          })
          
          const record = {
            filename,
            sku: nameWithoutExt,
            url: res.secure_url,
            uploadedAt: new Date().toISOString(),
          }
          outStream.write(JSON.stringify(record) + '\n')
          doneCount++
        } catch (err) {
          errCount++
          console.error(`Failed ${filename}:`, (err as any)?.message || err)
        }
      })
    )

    if ((i / CONCURRENCY) % 10 === 0 || i + CONCURRENCY >= pendingFiles.length) {
      const percent = Math.round((doneCount / allFiles.length) * 100)
      console.log(`Progress: ${doneCount}/${allFiles.length} (${percent}%) | Errors: ${errCount}`)
      fs.writeFileSync(
        STATUS_PATH,
        JSON.stringify({ total: allFiles.length, done: doneCount, err: errCount, percent, ts: Date.now() })
      )
    }
  }

  outStream.end()
  console.log(`ALL DONE! Successfully uploaded ${doneCount}/${allFiles.length} images.`)
}

main().catch(console.error)
