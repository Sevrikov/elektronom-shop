export interface ImageArbitrationConfig {
  distBlock: number;          // Minimum outline distance to block background BFS (0 for bottles, 2+ for diagrams)
  floorShadowY?: number;      // Height percentage (0 to 1) where shadow removal should be more aggressive
  minHoleSize?: number;       // Minimum size threshold to hollow out internal closed regions (e.g. 800 for stands)
  skipProcessing?: boolean;   // Directly skip background removal for lifestyle/action photos
  tBot?: number;              // Custom override for bottom background threshold
  outlineThreshMin?: number;  // Custom override for minimum outline threshold
  skipQa?: boolean;           // Force bypass QA checks for images that look okay but fail metrics
}

export const IMAGE_ARBITRATION_CONFIGS: Record<string, ImageArbitrationConfig> = {
  // Jack stand schema diagram: protect annotations, allow medium-to-large hollows
  "jack_stand.jpg": {
    distBlock: 4,
    floorShadowY: 0.82,
    minHoleSize: 800
  },
  "jack_stand_arbitrated.png": {
    distBlock: 4,
    floorShadowY: 0.82,
    minHoleSize: 800
  },
  // Prom.ua Jack Stand in Carousel Banner
  "7138921733_w640_h640_podstavka-pod-mashinu.jpg": {
    distBlock: 4,
    floorShadowY: 0.82,
    minHoleSize: 800
  },
  "jack_mock.jpg": {
    distBlock: 4,
    skipProcessing: true
  },
  // Prom.ua Automatic Transfer Switch (ATS) in Carousel Banner
  "6335425546_w640_h640_avtomatichnij-peremikach-avr.jpg": {
    distBlock: 2,
    floorShadowY: 0.85,
    minHoleSize: 99999 // Solid box, keep all labels solid
  },
  "ats_mock.jpg": {
    distBlock: 2,
    skipProcessing: true
  },
  // Local Mock Images in Carousel Banner
  "relay_ly2_mock.png": {
    distBlock: 0,
    skipProcessing: true
  },
  "trinix_battery_mock.png": {
    distBlock: 0,
    skipProcessing: true
  },

  // Standard Oil Bottles: no thin lines/diagrams, no internal holes. Clean shadows at the bottom 15%.
  "castrol_edge_5w30.png": {
    distBlock: 0,
    floorShadowY: 0.85,
    minHoleSize: 99999
  },
  "liqui_moly.png": {
    distBlock: 0,
    floorShadowY: 0.85,
    minHoleSize: 99999
  },
  "mannol_energy.png": {
    distBlock: 0,
    floorShadowY: 0.85,
    minHoleSize: 99999
  },
  "mobil1_esp.png": {
    distBlock: 0,
    floorShadowY: 0.85,
    minHoleSize: 99999
  },
  "shell_helix_ultra.png": {
    distBlock: 0,
    floorShadowY: 0.85,
    minHoleSize: 99999
  },
  "total_transmission.png": {
    distBlock: 0,
    floorShadowY: 0.85,
    minHoleSize: 99999
  },

  // Oil Filter: cylinder shape with bottom shadow, no internal holes
  "bosch_filter.png": {
    distBlock: 0,
    floorShadowY: 0.65,
    minHoleSize: 99999,
    tBot: 100,
    outlineThreshMin: 95
  },

  // Skip lifestyle / non-studio images completely
  "castrol_edge_5w30_spec.png": {
    distBlock: 0,
    skipProcessing: true
  },
  "castrol_edge_pour.png": {
    distBlock: 0,
    skipProcessing: true
  }
};

/**
 * Extracts the image filename from a URL or source string and resolves its custom config.
 */
export function getImageArbitration(src: string): ImageArbitrationConfig | null {
  if (!src) return null;
  const filename = src.split("/").pop();
  if (!filename) return null;
  return IMAGE_ARBITRATION_CONFIGS[filename] || null;
}
