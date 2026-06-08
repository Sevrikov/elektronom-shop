import { prisma } from '@/lib/prisma';
import { getProductTaxonomyCategory } from './taxonomy';
import { FeedItemSchema } from '../validations/product-feed';
import type { FeedItem } from '../validations/product-feed';
import { getSiteUrl } from '@/lib/utils';

/**
 * Generator function that fetches active products in batches and yields validated feed items.
 * Uses a memory-efficient strategy to handle pagination under the hood.
 */
export async function* generateFeedItems(locale: 'uk' | 'ru', batchSize = 100): AsyncGenerator<FeedItem, void, unknown> {
  let skip = 0;
  
  while (true) {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        sku: true,
        slug: true,
        price: true,
        comparePrice: true,
        stock: true,
        gtin: true,
        mpn: true,
        condition: true,
        googleProductCategory: true,
        itemGroupId: true,
        salePrice: true,
        saleStartsAt: true,
        saleEndsAt: true,
        category: {
          select: {
            slug: true,
            translations: {
              where: { locale },
              select: { name: true },
            },
          },
        },
        brand: {
          select: {
            name: true,
          },
        },
        translations: {
          where: { locale },
          select: {
            name: true,
            description: true,
          },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
          select: {
            url: true,
          },
        },
      },
      take: batchSize,
      skip,
    });

    if (products.length === 0) {
      break;
    }

    const skus = products.map((p) => p.sku);
    const supplierStocks = await prisma.supplierInventory.findMany({
      where: {
        sku: { in: skus },
        stock: { gt: 0 },
      },
      select: {
        sku: true,
      },
    });
    
    const supplierSkusInStock = new Set(supplierStocks.map((s) => s.sku));

    for (const product of products) {
      const trans = product.translations[0];
      const title = trans?.name || '';
      const description = trans?.description || title || '';
      
      const cleanDescription = description
        .replace(/<[^>]*>/g, '') // remove HTML tags
        .trim();

      const baseUrl = getSiteUrl();
      const link = `${baseUrl}/${locale}/product/${product.slug}`;
      
      const mainImage = product.images[0]?.url || `${baseUrl}/images/placeholder.jpg`;
      const additionalImages = product.images.slice(1).map((img) => img.url);

      let availability: 'in_stock' | 'out_of_stock' | 'backorder' = 'out_of_stock';
      if (product.stock > 0) {
        availability = 'in_stock';
      } else if (supplierSkusInStock.has(product.sku)) {
        availability = 'backorder';
      }

      const conditionMap = {
        NEW: 'new',
        USED: 'used',
        REFURBISHED: 'refurbished',
      } as const;
      const condition = conditionMap[product.condition] || 'new';

      const googleProductCategory = getProductTaxonomyCategory(
        product.category?.slug,
        product.googleProductCategory
      );

      const priceStr = `${Number(product.price).toFixed(2)} UAH`;
      
      let salePriceStr: string | null = null;
      if (product.salePrice) {
        const now = new Date();
        const start = product.saleStartsAt ? new Date(product.saleStartsAt) : null;
        const end = product.saleEndsAt ? new Date(product.saleEndsAt) : null;
        
        const isStarted = !start || now >= start;
        const isEnded = end && now > end;

        if (isStarted && !isEnded) {
          salePriceStr = `${Number(product.salePrice).toFixed(2)} UAH`;
        }
      }

      const brand = product.brand?.name || 'Electronom';

      const feedItem = {
        id: product.sku,
        title: title || product.slug,
        description: cleanDescription || title || product.slug,
        link,
        imageLink: mainImage,
        additionalImageLinks: additionalImages,
        availability,
        price: priceStr,
        salePrice: salePriceStr,
        brand,
        condition,
        gtin: product.gtin || null,
        mpn: product.mpn || null,
        googleProductCategory,
        itemGroupId: product.itemGroupId || null,
        productType: product.category?.translations[0]?.name || null,
      };

      const parseResult = FeedItemSchema.safeParse(feedItem);
      if (parseResult.success) {
        yield parseResult.data;
      } else {
        console.warn(`Feed validation failed for SKU: ${product.sku}`, parseResult.error.format());
      }
    }

    skip += batchSize;
  }
}

/**
 * Builds the final XML feed string from an array of validated feed items.
 */
export function buildXmlFeed(items: FeedItem[], locale: 'uk' | 'ru'): string {
  const baseUrl = getSiteUrl();
  const esc = (str: string | null | undefined): string => {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n`;
  xml += `  <channel>\n`;
  xml += `    <title>${esc(locale === 'uk' ? 'Electronom' : 'Electronom')}</title>\n`;
  xml += `    <link>${baseUrl}</link>\n`;
  xml += `    <description>${esc(locale === 'uk' ? 'Electronom - інтернет-магазин електроніки та електротехніки' : 'Electronom - интернет-магазин электроники и электротехники')}</description>\n`;

  for (const item of items) {
    xml += `    <item>\n`;
    xml += `      <g:id>${esc(item.id)}</g:id>\n`;
    xml += `      <g:title>${esc(item.title)}</g:title>\n`;
    xml += `      <g:description>${esc(item.description)}</g:description>\n`;
    xml += `      <g:link>${esc(item.link)}</g:link>\n`;
    xml += `      <g:image_link>${esc(item.imageLink)}</g:image_link>\n`;
    
    if (item.additionalImageLinks && item.additionalImageLinks.length > 0) {
      for (const img of item.additionalImageLinks.slice(0, 10)) {
        xml += `      <g:additional_image_link>${esc(img)}</g:additional_image_link>\n`;
      }
    }
    
    xml += `      <g:availability>${esc(item.availability)}</g:availability>\n`;
    xml += `      <g:price>${esc(item.price)}</g:price>\n`;
    
    if (item.salePrice) {
      xml += `      <g:sale_price>${esc(item.salePrice)}</g:sale_price>\n`;
    }
    
    xml += `      <g:brand>${esc(item.brand)}</g:brand>\n`;
    xml += `      <g:condition>${esc(item.condition)}</g:condition>\n`;
    
    if (item.gtin) {
      xml += `      <g:gtin>${esc(item.gtin)}</g:gtin>\n`;
    }
    
    if (item.mpn) {
      xml += `      <g:mpn>${esc(item.mpn)}</g:mpn>\n`;
    }

    if (!item.gtin && !item.mpn) {
      xml += `      <g:identifier_exists>no</g:identifier_exists>\n`;
    } else {
      xml += `      <g:identifier_exists>yes</g:identifier_exists>\n`;
    }
    
    xml += `      <g:google_product_category>${esc(item.googleProductCategory)}</g:google_product_category>\n`;
    
    if (item.itemGroupId) {
      xml += `      <g:item_group_id>${esc(item.itemGroupId)}</g:item_group_id>\n`;
    }

    if (item.productType) {
      xml += `      <g:product_type>${esc(item.productType)}</g:product_type>\n`;
    }
    
    xml += `    </item>\n`;
  }

  xml += `  </channel>\n`;
  xml += `</rss>`;
  return xml;
}
