/**
 * Map frontend filter keys (from catalog-filter-config.ts) to the actual keys used in JSONB products.attributes in the database,
 * and vice-versa.
 */

export const frontendToDbAttributeMapping: Record<string, string> = {
  poles: "kolychestvo_polyusov",
  rated_current: "nominalnyy_robochyy_strum_ie_a",
  curve: "kharakterystyka_vidklyuchennya",
  breaking_capacity: "nominalna_vymykayucha_zdatnist_icn_ka",
};

export const dbToFrontendAttributeMapping: Record<string, string> = Object.fromEntries(
  Object.entries(frontendToDbAttributeMapping).map(([k, v]) => [v, k])
);

export function mapFrontendToDbAttributeKey(key: string): string {
  return frontendToDbAttributeMapping[key] ?? key;
}

export function mapDbToFrontendAttributeKey(key: string): string {
  return dbToFrontendAttributeMapping[key] ?? key;
}

export function mapFrontendToDbAttributeValue(key: string, value: string): string {
  const normKey = key.toLowerCase();
  if (normKey === "poles" || normKey === "kolychestvo_polyusov") {
    // Convert '2P' to '2', leave other values as-is
    return value.toUpperCase().replace("P", "");
  }
  return value;
}

export function mapDbToFrontendAttributeValue(key: string, value: string): string {
  const normKey = key.toLowerCase();
  if (normKey === "poles" || normKey === "kolychestvo_polyusov") {
    // Convert '2' to '2P', leave other values as-is
    const clean = value.toUpperCase().replace("P", "");
    if (["1", "2", "3", "4"].includes(clean)) {
      return `${clean}P`;
    }
  }
  return value;
}
