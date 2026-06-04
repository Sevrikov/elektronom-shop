import { GOOGLE_TAXONOMY_MAP, DEFAULT_GOOGLE_TAXONOMY } from '@/config/google-taxonomy';

/**
 * Resolves the Google Product Category ID/path for a given product and its category.
 * Prioritizes product-level custom categories before falling back to category-level config.
 */
export function getProductTaxonomyCategory(
  categorySlug: string | null | undefined,
  productCustomCategory?: string | null
): string {
  if (productCustomCategory && productCustomCategory.trim()) {
    return productCustomCategory.trim();
  }

  if (categorySlug && GOOGLE_TAXONOMY_MAP[categorySlug]) {
    return GOOGLE_TAXONOMY_MAP[categorySlug];
  }

  return DEFAULT_GOOGLE_TAXONOMY;
}
