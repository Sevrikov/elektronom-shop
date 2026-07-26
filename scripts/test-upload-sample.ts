import { v2 as cloudinary } from 'cloudinary'
import * as fs from 'fs'
import * as path from 'path'

cloudinary.config({
  cloud_name: 'bzzecoeb',
  api_key: '227326675718179',
  api_secret: '4llIVU1_VBoeFPFf5-QexyPLVz8',
})

async function main() {
  const dir = 'D:/elektronom_photos/processed'
  const files = fs.readdirSync(dir).slice(0, 3)
  
  console.log('Testing upload for 3 files:', files)
  for (const f of files) {
    const filePath = path.join(dir, f)
    const publicId = `elektronom/products/${path.parse(f).name}`
    try {
      const res = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
      })
      console.log(`Uploaded ${f} -> ${res.secure_url}`)
    } catch (err) {
      console.error(`Error uploading ${f}:`, err)
    }
  }
}

main()
