import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import type { Prisma } from '@/generated/prisma/client';
import { ASSISTANT_SYSTEM_PROMPT } from './prompts';
import { calculateDraftOrder, buildComparison } from './draft-order';
import type {
  AssistantResponse,
  RecommendedProduct,
  AssistantDraftOrderItem,
  AssistantSource,
  AssistantOrderComparison
} from './types';

// Zod schemas for validating responses from Claude API
const ModelProductSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  price: z.number(),
  stock: z.number(),
  specifications: z.record(z.string(), z.string()).optional(),
  reason: z.string().optional(),
  availability: z.enum(['in_stock', 'on_order', 'check_needed', 'out_of_stock']).optional(),
});

const ModelDraftOrderItemSchema = z.object({
  productId: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  price: z.number(),
  quantity: z.number().int().positive(),
});

const ModelComparisonSchema = z.object({
  mode: z.enum(['replace', 'compare', 'alternative']),
  proposedItems: z.array(ModelDraftOrderItemSchema),
  technicalSummary: z.string(),
});

const ModelResponseSchema = z.object({
  message: z.string(),
  questions: z.array(z.string()).optional(),
  products: z.array(ModelProductSchema).optional(),
  draftOrder: z.object({
    items: z.array(ModelDraftOrderItemSchema),
  }).optional(),
  orderComparison: ModelComparisonSchema.optional(),
  warnings: z.array(z.string()).optional(),
});

// Helper to extract JSON from Claude's response (supporting markdown backticks, raw JSON, and leading/trailing noise)
function extractAndParseJson(text: string): Record<string, unknown> | null {
  if (!text) return null;
  let cleanText = text.trim();

  // Strip markdown code fences if present (e.g. ```json ... ``` or ``` ... ```)
  const codeFenceRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/i;
  const match = cleanText.match(codeFenceRegex);
  if (match && match[1]) {
    cleanText = match[1].trim();
  }

  try {
    const result: unknown = JSON.parse(cleanText);
    if (typeof result === 'object' && result !== null && !Array.isArray(result)) {
      return result as Record<string, unknown>;
    }
    return null;
  } catch (e) {
    console.error('Failed to parse clean text as JSON, trying boundary fallback:', e);
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const result: unknown = JSON.parse(cleanText.substring(firstBrace, lastBrace + 1));
        if (typeof result === 'object' && result !== null && !Array.isArray(result)) {
          return result as Record<string, unknown>;
        }
      } catch (err) {
        console.error('Failed fallback JSON parsing:', err);
      }
    }
    return null;
  }
}

export async function queryAssistant(
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  locale: string
): Promise<AssistantResponse> {
  const apiKey = env.ANTHROPIC_API_KEY;

  // 1. Fetch real products from Prisma database to use for recommendations and draft orders
  // Smart keyword matching from user query
  const keywords = message.toLowerCase()
    .replace(/[^\w\sа-яіїєґ]/gi, ' ')
    .split(/\s+/)
    .filter((k) => k.length > 2);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma OR conditions require dynamic structure
  let searchConditions: Prisma.ProductWhereInput[] = [];
  if (keywords.length > 0) {
    searchConditions = keywords.map((kw) => ({
      OR: [
        { sku: { contains: kw, mode: 'insensitive' as const } },
        { slug: { contains: kw, mode: 'insensitive' as const } },
        {
          translations: {
            some: {
              OR: [
                { name: { contains: kw, mode: 'insensitive' as const } },
                { description: { contains: kw, mode: 'insensitive' as const } }
              ]
            }
          }
        }
      ]
    }));
  }

  const dbProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(searchConditions.length > 0 ? { OR: searchConditions } : {})
    },
    select: {
      id: true,
      slug: true,
      sku: true,
      price: true,
      stock: true,
      attributes: true,
      translations: {
        where: { locale },
        select: { name: true, description: true },
        take: 1,
      },
      images: {
        select: { url: true },
        take: 1,
      },
    },
    take: 12,
  });

  const availableProducts: RecommendedProduct[] = dbProducts.map((p) => {
    const translation = p.translations[0];
    const name = translation?.name || 'Technical Product';
    const img = p.images[0]?.url || undefined;

    // Parse attributes
    let specs: Record<string, string> = {};
    if (p.attributes && typeof p.attributes === 'object') {
      specs = p.attributes as Record<string, string>;
    }

    return {
      id: p.id,
      slug: p.slug,
      sku: p.sku,
      name,
      price: Number(p.price),
      image: img,
      stock: p.stock,
      specifications: specs,
      reason: `Рекомендується для вашого запиту: ${name}`,
      availability: p.stock > 0 ? 'in_stock' : 'on_order',
    };
  });

  // 2. If API Key is present, make call to Anthropic API
  if (apiKey) {
    try {
      const messages = [
        ...history.map((h) => ({ role: h.role, content: h.content })),
        { role: 'user' as const, content: message },
      ];

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          system: `${ASSISTANT_SYSTEM_PROMPT}\n\nHere is the real database product catalog available for recommendations:\n${JSON.stringify(availableProducts, null, 2)}`,
          messages,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const textContent = data.content?.[0]?.text || '';
        const parsedJson = extractAndParseJson(textContent);

        if (!parsedJson) {
          throw new Error('Claude response JSON extraction failed');
        }

        // Zod validation check
        const parsedResult = ModelResponseSchema.safeParse(parsedJson);
        if (parsedResult.success) {
          const validatedData = parsedResult.data;

          // Rehydrate recommended products using actual database variables (price, name, image, stock)
          const rehydratedProducts: RecommendedProduct[] = [];
          if (validatedData.products) {
            for (const prod of validatedData.products) {
              const dbP = dbProducts.find((p) => p.id === prod.id || p.sku === prod.sku);
              if (dbP) {
                const trans = dbP.translations[0];
                const name = trans?.name || prod.name;
                const image = dbP.images[0]?.url || undefined;
                rehydratedProducts.push({
                  id: dbP.id,
                  slug: dbP.slug,
                  sku: dbP.sku,
                  name,
                  price: Number(dbP.price),
                  stock: dbP.stock,
                  image,
                  specifications: (dbP.attributes as Record<string, string>) || {},
                  reason: prod.reason || `Рекомендовано для: ${name}`,
                  availability: dbP.stock > 0 ? 'in_stock' : 'on_order',
                });
              }
            }
          }

          // Rehydrate draft order items using actual database variables
          const rehydratedDraftItems: AssistantDraftOrderItem[] = [];
          if (validatedData.draftOrder && validatedData.draftOrder.items) {
            for (const item of validatedData.draftOrder.items) {
              const dbP = dbProducts.find((p) => p.id === item.productId || p.sku === item.sku);
              if (dbP) {
                const trans = dbP.translations[0];
                const name = trans?.name || item.name;
                const image = dbP.images[0]?.url || undefined;
                rehydratedDraftItems.push({
                  id: `item_${Math.random().toString(36).substring(2, 9)}`,
                  productId: dbP.id,
                  sku: dbP.sku,
                  name,
                  price: Number(dbP.price),
                  quantity: item.quantity,
                  image,
                  specifications: (dbP.attributes as Record<string, string>) || {},
                });
              }
            }
          }

          // Rehydrate comparisons using actual database variables
          let rehydratedComparison: AssistantOrderComparison | undefined = undefined;
          if (validatedData.orderComparison) {
            const rehydratedProposedItems: AssistantDraftOrderItem[] = [];
            for (const item of validatedData.orderComparison.proposedItems) {
              const dbP = dbProducts.find((p) => p.id === item.productId || p.sku === item.sku);
              if (dbP) {
                const trans = dbP.translations[0];
                const name = trans?.name || item.name;
                const image = dbP.images[0]?.url || undefined;
                rehydratedProposedItems.push({
                  id: `item_${Math.random().toString(36).substring(2, 9)}`,
                  productId: dbP.id,
                  sku: dbP.sku,
                  name,
                  price: Number(dbP.price),
                  quantity: item.quantity,
                  image,
                  specifications: (dbP.attributes as Record<string, string>) || {},
                });
              }
            }

            if (rehydratedProposedItems.length > 0) {
              const previousOrder = calculateDraftOrder(rehydratedDraftItems.length > 0 ? rehydratedDraftItems : []);
              const proposedOrder = calculateDraftOrder(rehydratedProposedItems);
              rehydratedComparison = buildComparison(
                previousOrder,
                proposedOrder,
                validatedData.orderComparison.mode,
                validatedData.orderComparison.technicalSummary
              );
            }
          }

          const sources: AssistantSource[] = [
            {
              title: '[MVP Prototype] Локальна база технічної документації Electronom',
              type: 'datasheet',
              snippet: 'Синхронізовані специфікації, інструкції виробника та правила сумісності обладнання.',
            },
          ];

          return {
            message: validatedData.message,
            questions: validatedData.questions,
            products: rehydratedProducts.length > 0 ? rehydratedProducts : undefined,
            draftOrder: rehydratedDraftItems.length > 0 ? calculateDraftOrder(rehydratedDraftItems) : undefined,
            orderComparison: rehydratedComparison,
            sources,
            warnings: validatedData.warnings,
            availabilityCheckedAt: new Date().toISOString(),
          };
        } else {
          console.error('Claude response failed Zod schema validation:', parsedResult.error);
        }
      }
    } catch (err) {
      console.error('Anthropic API query failed, falling back to local matcher:', err);
    }
  }

  // 3. Fallback smart local technical matcher
  // Analyzes message keywords and returns structured JSON responses matching real database items
  const normalizedQuery = message.toLowerCase();
  
  let responseMessage = '';
  let recommended: RecommendedProduct[] = [];
  let draftItems: AssistantDraftOrderItem[] = [];
  let comparison: AssistantOrderComparison | null = null;
  const warnings: string[] = [];
  const sources: AssistantSource[] = [
    {
      title: 'ДСТУ EN 62040-1:2019 Джерела безперебійного живлення',
      type: 'manual',
      snippet: 'Загальні та безпекові вимоги до ДБЖ, які використовуються в доступних для оператора зонах.',
    },
  ];

  // Logic: Identify keywords
  if (normalizedQuery.includes('дбж') || normalizedQuery.includes('ибп') || normalizedQuery.includes('питания') || normalizedQuery.includes('живлення')) {
    // Find products resembling UPS/battery
    recommended = availableProducts.filter(
      (p) =>
        p.name.toLowerCase().includes('дбж') ||
        p.name.toLowerCase().includes('ибп') ||
        p.name.toLowerCase().includes('аккумулятор') ||
        p.name.toLowerCase().includes('акумулятор') ||
        p.sku.toLowerCase().includes('bat') ||
        p.sku.toLowerCase().includes('ups')
    );

    if (recommended.length === 0) {
      recommended = availableProducts.slice(0, 2);
    }

    responseMessage =
      locale === 'uk'
        ? `[Демо-режим] Для резервного живлення роутера та ONU рекомендується використовувати компактне джерело безперебійного живлення (ДБЖ) з літієвим акумулятором LiFePO4. За орієнтовними розрахунками, це забезпечить понад 8 годин автономної роботи при середній потужності споживання 10-15 Вт.`
        : `[Демо-режим] Для резервного питания роутера и ONU рекомендуется использовать компактный источник бесперебойного питания (ИБП) с литиевым аккумулятором LiFePO4. По ориентировочным расчетам, это обеспечит более 8 часов автономной работы при средней мощности потребления 10-15 Вт.`;

    warnings.push(
      locale === 'uk'
        ? 'Перед монтажем електрообладнання перевірте рішення з кваліфікованим електриком.'
        : 'Перед монтажом электрооборудования проверьте решение с квалифицированным электриком.'
    );
  } else if (
    normalizedQuery.includes('замен') ||
    normalizedQuery.includes('замін') ||
    normalizedQuery.includes('аналог') ||
    normalizedQuery.includes('сравн') ||
    normalizedQuery.includes('порівн')
  ) {
    // Compare or replace items using actual database products if they exist
    const mainProduct = availableProducts[0] || null;
    const newProduct = availableProducts[1] || null;

    if (mainProduct && newProduct) {
      recommended = [newProduct];
      responseMessage =
        locale === 'uk'
          ? `[Демо-режим] Пропоную замінити акумулятор ${mainProduct.name} на преміум ${newProduct.name}. За орієнтовними даними, LiFePO4 підтримує значно більше циклів розряду, що є вигіднішим у довгостроковій перспективі.`
          : `[Демо-режим] Предлагаю заменить аккумулятор ${mainProduct.name} на премиум ${newProduct.name}. По ориентировочным данным, LiFePO4 поддерживает значительно больше циклов разряда, что выгоднее в долгосрочной перспективе.`;

      const prevOrder = calculateDraftOrder([
        {
          id: '1',
          productId: mainProduct.id,
          sku: mainProduct.sku,
          name: mainProduct.name,
          price: mainProduct.price,
          quantity: 1,
          image: mainProduct.image,
        },
      ]);

      const proposedOrder = calculateDraftOrder([
        {
          id: '2',
          productId: newProduct.id,
          sku: newProduct.sku,
          name: newProduct.name,
          price: newProduct.price,
          quantity: 1,
          image: newProduct.image,
        },
      ]);

      comparison = buildComparison(
        prevOrder,
        proposedOrder,
        'replace',
        locale === 'uk'
          ? 'Заміна акумулятора забезпечує довший термін служби та швидку зарядку.'
          : 'Замена аккумулятора обеспечивает более долгий срок службы и быструю зарядку.'
      );
    } else {
      recommended = availableProducts.slice(0, 1);
      responseMessage =
        locale === 'uk'
          ? `[Демо-режим] Для точного підбору аналогів потрібне технічне уточнення параметрів вашої мережі (потужність споживачів, бажаний час автономної роботи).`
          : `[Демо-режим] Для точного подбора аналогов требуется техническое уточнение параметров вашей сети (мощность потребителей, желаемое время работы).`;
    }
  } else if (normalizedQuery.includes('автомат') || normalizedQuery.includes('выключатель') || normalizedQuery.includes('вимикач')) {
    recommended = availableProducts.filter((p) => p.name.toLowerCase().includes('автомат') || p.sku.toLowerCase().includes('avt'));
    if (recommended.length === 0) recommended = availableProducts.slice(2, 4);

    responseMessage =
      locale === 'uk'
        ? `[Демо-режим] Для бойлера потужністю 2 кВт за орієнтовними правилами безпеки оптимально встановити автоматичний вимикач номіналом 16А з кривою відключення C. Також рекомендується встановити ПЗВ (УЗО) зі струмом витоку 30мА для захисту від ураження струмом.`
        : `[Демо-режим] Для бойлера мощностью 2 кВт по ориентировочным правилам безопасности оптимально установить автоматический выключатель номиналом 16А с кривой отключения C. Также рекомендуется установить УЗО с током утечки 30мА для защиты от поражения током.`;

    warnings.push(
      locale === 'uk'
        ? 'Перед монтажем електрообладнання перевірте рішення з кваліфікованим електриком.'
        : 'Перед монтажом электрооборудования проверьте решение с квалифицированным электриком.'
    );
  } else {
    // General response
    recommended = availableProducts.slice(0, 3);
    responseMessage =
      locale === 'uk'
        ? `[Демо-режим] Вітаю! Я технічний асистент магазину Electronom (демо-версія). Чим можу допомогти вам сьогодні? Я вмію розраховувати системи безперебійного живлення, вибирати автоматику, кабелі та сумісні акумулятори.`
        : `[Демо-режим] Приветствую! Я технический ассистент магазина Electronom (демо-версия). Чем могу помочь вам сегодня? Я умею рассчитывать системы бесперебойного питания, выбирать автоматику, кабели и совместимые аккумуляторы.`;
  }

  // Pre-fill a draft order in the response when recommending products to showcase the Live Draft Order Panel
  if (recommended.length > 0 && !comparison) {
    draftItems = recommended.map((r, index) => ({
      id: `item_${index}`,
      productId: r.id,
      sku: r.sku,
      name: r.name,
      price: r.price,
      quantity: 1,
      image: r.image,
      specifications: r.specifications,
    }));
  }

  return {
    message: responseMessage,
    products: recommended.length > 0 ? recommended : undefined,
    draftOrder: draftItems.length > 0 ? calculateDraftOrder(draftItems) : undefined,
    orderComparison: comparison || undefined,
    sources,
    warnings,
    availabilityCheckedAt: new Date().toISOString(),
  };
}
