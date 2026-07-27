/**
 * Автоматический скрипт парсинга и привязки технической документации (ПДФ паспорта, схемы, габариты)
 * по каждому артикулу (SKU) товаров с сохранением локального бекапа на диск E:\документы_аско\
 * 
 * Запуск: npx ts-node scripts/sync-all-tech-docs.ts
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { prisma } from '../src/lib/prisma'

const E_BACKUP_DIR = 'E:/документы_аско'

function fetchBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location
        if (!redirectUrl.startsWith('http')) redirectUrl = 'https://www.acko.ua' + redirectUrl
        return fetchBuffer(redirectUrl).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
      const chunks: Buffer[] = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    }).on('error', reject)
  })
}

async function searchManufacturerDocs(sku: string) {
  // Поиск по артикулу на сайте производителя
  const searchUrl = `https://www.acko.ua/e-store/xml_catalog/?q=${encodeURIComponent(sku)}`
  try {
    const htmlBuffer = await fetchBuffer(searchUrl)
    const html = htmlBuffer.toString('utf-8')

    // Парсим ссылки на ПДФ и картинки
    const pdfMatches = html.match(/\/upload\/[^\s"']+\.pdf/gi) || []
    const imgMatches = html.match(/\/upload\/[^\s"']+\.(?:jpg|png|jpeg|svg)/gi) || []

    return {
      pdf: pdfMatches[0] ? `https://www.acko.ua${pdfMatches[0]}` : null,
      dimensions: imgMatches[0] ? `https://www.acko.ua${imgMatches[0]}` : null,
      schematics: imgMatches[1] ? `https://www.acko.ua${imgMatches[1]}` : null,
    }
  } catch {
    return null
  }
}

export async function automateTechDocsIngestion() {
  console.log('🚀 Запуск автоматической синхронизации технической документации...')
  
  if (!fs.existsSync(E_BACKUP_DIR)) {
    fs.mkdirSync(E_BACKUP_DIR, { recursive: true })
  }

  const products = await prisma.product.findMany({
    select: { id: true, sku: true, name: true },
    take: 100,
  })

  console.log(`Найдено товаров для проверки: ${products.length}`)

  for (const product of products) {
    if (!product.sku) continue
    console.log(`\n🔍 Обработка артикула [${product.sku}]: ${product.name}`)
    
    const docs = await searchManufacturerDocs(product.sku)
    if (!docs || (!docs.pdf && !docs.dimensions)) {
      console.log(` ⚠️ Документы не найдены на сайте производителя для SKU: ${product.sku}`)
      continue
    }

    const skuBackupDir = path.join(E_BACKUP_DIR, product.sku)
    if (!fs.existsSync(skuBackupDir)) fs.mkdirSync(skuBackupDir, { recursive: true })

    if (docs.pdf) {
      console.log(` 📄 Скачивание ПДФ паспорта: ${docs.pdf}`)
      try {
        const buf = await fetchBuffer(docs.pdf)
        fs.writeFileSync(path.join(skuBackupDir, 'passport.pdf'), buf)
        console.log(`   --> Сохранено на Е: ${path.join(skuBackupDir, 'passport.pdf')}`)
      } catch (e) {
        console.error(`   --> Ошибка скачивания ПДФ:`, e)
      }
    }

    if (docs.dimensions) {
      console.log(` 📐 Скачивание чертежа габаритов: ${docs.dimensions}`)
      try {
        const buf = await fetchBuffer(docs.dimensions)
        fs.writeFileSync(path.join(skuBackupDir, 'dimensions.jpg'), buf)
        console.log(`   --> Сохранено на Е: ${path.join(skuBackupDir, 'dimensions.jpg')}`)
      } catch (e) {
        console.error(`   --> Ошибка скачивания габаритов:`, e)
      }
    }
  }

  console.log('\n✅ Автоматический парсинг документации завершен!')
}
