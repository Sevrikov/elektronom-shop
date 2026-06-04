import { z } from 'zod';

export const FeedItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  link: z.string().url(),
  imageLink: z.string().url(),
  additionalImageLinks: z.array(z.string().url()).default([]),
  availability: z.enum(['in_stock', 'out_of_stock', 'preorder', 'backorder']),
  price: z.string().regex(/^\d+(\.\d{1,2})?\s[A-Z]{3}$/),
  salePrice: z.string().regex(/^\d+(\.\d{1,2})?\s[A-Z]{3}$/).nullable().optional(),
  brand: z.string().min(1),
  condition: z.enum(['new', 'used', 'refurbished']),
  gtin: z.string().nullable().optional(),
  mpn: z.string().nullable().optional(),
  googleProductCategory: z.string().min(1),
  itemGroupId: z.string().nullable().optional(),
  productType: z.string().nullable().optional(),
  shipping: z.object({
    country: z.string().default('UA'),
    service: z.string().default('Nova Poshta'),
    price: z.string().default('0.00 UAH'),
  }).optional(),
});

export type FeedItem = z.infer<typeof FeedItemSchema>;
