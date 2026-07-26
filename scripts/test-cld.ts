import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: 'bzzecoeb',
  api_key: '227326675718179',
  api_secret: '4llIVU1_VBoeFPFf5-QexyPLVz8',
})

async function main() {
  try {
    const res = await cloudinary.api.ping()
    console.log('NEW CLOUDINARY PING SUCCESS:', res)
  } catch (err) {
    console.error('NEW CLOUDINARY PING ERR:', err)
  }
}

main()
