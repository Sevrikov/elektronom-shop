import { env } from './env';

export type FeatureFlagKey =
  | 'alpha12_content_guides_enabled'
  | 'alpha12_guide_rag_citations_enabled'
  | 'alpha12_seo_answer_blocks_enabled'
  | 'alpha12_article_schema_enabled'
  | 'alpha12_faq_howto_schema_enabled'
  | 'alpha12_trust_entity_enabled'
  | 'alpha12_recently_viewed_enabled'
  | 'alpha12_co_purchase_recommendations_enabled'
  | 'alpha12_ai_recommendations_enabled'
  | 'alpha12_bi_dashboard_enabled'
  | 'alpha12_ab_experiments_enabled';

const DEFAULT_FLAGS: Record<FeatureFlagKey, boolean> = {
  alpha12_content_guides_enabled: false,
  alpha12_guide_rag_citations_enabled: false,
  alpha12_seo_answer_blocks_enabled: false,
  alpha12_article_schema_enabled: false,
  alpha12_faq_howto_schema_enabled: false,
  alpha12_trust_entity_enabled: false,
  alpha12_recently_viewed_enabled: false,
  alpha12_co_purchase_recommendations_enabled: false,
  alpha12_ai_recommendations_enabled: false,
  alpha12_bi_dashboard_enabled: false,
  alpha12_ab_experiments_enabled: false,
};

function parseFeatureFlag(value: unknown): boolean {
  if (value === true) return true;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1';
  }
  return false;
}

/**
 * Checks if a specific feature flag is enabled.
 * Looks up the value in validated env variables, falling back to false.
 */
export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  if (env && typeof env === 'object' && flag in env) {
    return parseFeatureFlag((env as Record<string, unknown>)[flag]);
  }
  return DEFAULT_FLAGS[flag] ?? false;
}

/**
 * Returns an object containing all feature flags and their current state.
 */
export function getFeatureFlags(): Record<FeatureFlagKey, boolean> {
  const flags = {} as Record<FeatureFlagKey, boolean>;
  const keys = Object.keys(DEFAULT_FLAGS) as FeatureFlagKey[];
  for (const key of keys) {
    flags[key] = isFeatureEnabled(key);
  }
  return flags;
}
