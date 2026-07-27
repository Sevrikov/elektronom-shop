const fs = require('fs');
const path = require('path');
const https = require('https');
const { prisma } = require('../src/lib/prisma');
const E_BACKUP_DIR = 'E:/документы_аско';

function getHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) redirectUrl = 'https://www.acko.ua' + redirectUrl;
        return getHtml(redirectUrl).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return resolve('');
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) redirectUrl = 'https://www.acko.ua' + redirectUrl;
        return fetchBuffer(redirectUrl).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function run() {
  console.log('🚀 Автоматический сбор материалов со ВСЕХ 320+ категорий acko.ua...');

  if (!fs.existsSync(E_BACKUP_DIR)) {
    fs.mkdirSync(E_BACKUP_DIR, { recursive: true });
  }

  // 1. Fetch all category links dynamically from acko.ua root catalog
  const rootHtml = await getHtml('https://www.acko.ua/e-store/xml_catalog/');
  const links = Array.from(rootHtml.matchAll(/href="(\/e-store\/xml_catalog\/[^\/"]+\/)"/gi), m => m[1]);
  const categories = Array.from(new Set(links)).filter(l => l !== '/e-store/xml_catalog/');

  console.log(`📌 Обнаружено категорий для сканирования: ${categories.length}`);

  let totalParsed = 0;
  let totalSaved = 0;
  const processedSkus = new Set();

  for (let i = 0; i < categories.length; i++) {
    const catPath = categories[i];
    console.log(`\n📂 [${i + 1}/${categories.length}] Категория: ${catPath}`);

    for (let page = 1; page <= 20; page++) {
      const pageUrl = `https://www.acko.ua${catPath}?PAGEN_1=${page}`;
      const catalogHtml = await getHtml(pageUrl);
      if (!catalogHtml || catalogHtml.length < 500) break;

      // Extract product detail page links (handles any nesting level)
      const rawMatches = catalogHtml.match(/\/e-store\/xml_catalog\/[^\s"']*?\/\d+\//gi) || [];
      const productMatches = Array.from(new Set(rawMatches));
      if (productMatches.length === 0) break;

      for (const relLink of productMatches) {
        const fullUrl = `https://www.acko.ua${relLink}`;
        const detailHtml = await getHtml(fullUrl);
        if (!detailHtml) continue;

        totalParsed++;

        // Extract SKU from span.article or text
        const articleMatch = detailHtml.match(/<span[^>]*class="article"[^>]*>([\s\S]*?)<\/span>/i) ||
                             detailHtml.match(/Артикул:\s*([A-Z0-9.\-_/]+)/i);
        let rawArticle = articleMatch ? articleMatch[1].replace(/Артикул:\s*/i, '').trim() : '';

        if (!rawArticle) continue;
        const sku = rawArticle;

        if (processedSkus.has(sku)) continue;
        processedSkus.add(sku);

        // Extract Schematics tab image (data-tab="4" or tab-wiring-diagrams)
        const schemTabMatch = detailHtml.match(/class="[^"]*tab-wiring-diagrams[^"]*"[\s\S]*?<img[^>]+src="([^"]+)"/i) ||
                              detailHtml.match(/data-tab="4"[\s\S]*?<img[^>]+src="([^"]+)"/i);
        const schemRel = schemTabMatch ? schemTabMatch[1] : null;

        // Extract Dimensions tab image (data-tab="5")
        const dimTabMatch = detailHtml.match(/data-tab="5"[\s\S]*?<img[^>]+src="([^"]+)"/i) ||
                            detailHtml.match(/data-tab="3"[\s\S]*?<img[^>]+src="([^"]+)"/i);
        const dimRel = dimTabMatch ? dimTabMatch[1] : null;

        // Extract PDF documents (passport + catalog page) with spaces & Cyrillic support
        const pdfMatches = Array.from(detailHtml.matchAll(/href="(\/upload\/[^"]+\.pdf)"/gi), m => m[1]);
        const pdfRel1 = pdfMatches[0] ? encodeURI(pdfMatches[0]) : null;
        const pdfRel2 = pdfMatches[1] ? encodeURI(pdfMatches[1]) : null;

        const schemUrl = schemRel ? `https://www.acko.ua${encodeURI(schemRel)}` : null;
        const dimUrl = dimRel ? `https://www.acko.ua${encodeURI(dimRel)}` : null;
        const pdfUrl1 = pdfRel1 ? `https://www.acko.ua${pdfRel1}` : null;
        const pdfUrl2 = pdfRel2 ? `https://www.acko.ua${pdfRel2}` : null;

        if (!schemUrl && !dimUrl && !pdfUrl1) continue;

        console.log(`  --> 🎯 [SKU: ${sku}] Схемы: ${schemUrl ? 'ДА' : 'НЕТ'} | Габариты: ${dimUrl ? 'ДА' : 'НЕТ'} | ПДФ: ${pdfUrl1 ? (pdfUrl2 ? '2 файла' : '1 файл') : 'НЕТ'}`);

        // Safe folder for E:\ drive
        const safeSku = sku.replace(/[/\\?%*:|"<>]/g, '_');
        const skuDir = path.join(E_BACKUP_DIR, safeSku);
        if (!fs.existsSync(skuDir)) fs.mkdirSync(skuDir, { recursive: true });

        let localSchem = null;
        let localDim = null;
        let localPdf1 = null;

        if (schemUrl) {
          try {
            const buf = await fetchBuffer(schemUrl);
            const p = path.join(skuDir, 'schematics.jpg');
            fs.writeFileSync(p, buf);
            localSchem = schemUrl;
          } catch (e) {}
        }

        if (dimUrl) {
          try {
            const buf = await fetchBuffer(dimUrl);
            const p = path.join(skuDir, 'dimensions.jpg');
            fs.writeFileSync(p, buf);
            localDim = dimUrl;
          } catch (e) {}
        }

        if (pdfUrl1) {
          try {
            const buf = await fetchBuffer(pdfUrl1);
            const p = path.join(skuDir, 'passport.pdf');
            fs.writeFileSync(p, buf);
            localPdf1 = pdfUrl1;
          } catch (e) {}
        }

        if (pdfUrl2) {
          try {
            const buf = await fetchBuffer(pdfUrl2);
            const p = path.join(skuDir, 'catalog.pdf');
            fs.writeFileSync(p, buf);
          } catch (e) {}
        }

        // Strict exact SKU matching only — no partial contains matches to avoid wrong assignments
        const cleanSku = sku.replace(/[^A-Z0-9]/gi, '');
        const dbProduct = await prisma.product.findFirst({
          where: {
            OR: [
              { sku: sku },
              { sku: `[${sku}]` },
              { sku: cleanSku }
            ]
          }
        });

        if (dbProduct) {
          await prisma.product.update({
            where: { id: dbProduct.id },
            data: {
              ...(localSchem ? { schematicsUrl: localSchem } : {}),
              ...(localDim ? { dimensionsUrl: localDim } : {}),
              ...(localPdf1 ? { pdfUrl: localPdf1 } : {}),
            }
          });
          console.log(`      ✅ Привязано в БД Neon к товару: ${dbProduct.sku}`);
          totalSaved++;
        }
      }
    }
  }

  console.log(`\n🎉 Сбор материалов со ВСЕХ категорий АСКО завершен! Проверено товаров: ${totalParsed}, Сохранено и привязано в БД: ${totalSaved}`);
  await prisma.$disconnect();
}

run().catch(err => {
  console.error('Fatal error:', err);
  prisma.$disconnect();
});
