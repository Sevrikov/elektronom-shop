import { NextResponse } from 'next/server';
import { cacheLife, cacheTag } from 'next/cache';
import { generateFeedItems, buildXmlFeed } from '@/lib/merchant/feed-builder';
import type { FeedItem } from '@/lib/validations/product-feed';

// Cached server function to fetch and format all feed items
async function getCachedFeedItems(locale: 'uk' | 'ru'): Promise<FeedItem[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('feed');
  cacheTag(`feed-${locale}`);
  cacheTag('products');
  cacheTag('categories');
  cacheTag('brands');
  cacheTag('supplier_inventory');

  const items: FeedItem[] = [];
  const generator = generateFeedItems(locale);
  for await (const item of generator) {
    items.push(item);
  }
  return items;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  if (locale !== 'uk' && locale !== 'ru') {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const items = await getCachedFeedItems(locale);
    const xml = buildXmlFeed(items, locale);
    
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error(`[feed] Error generating feed for locale ${locale}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
