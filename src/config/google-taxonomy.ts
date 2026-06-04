// Google Product Taxonomy Map
// Maps category slugs to Google Product Taxonomy IDs/Names (e.g., 604 for Electrical Supplies)

export const GOOGLE_TAXONOMY_MAP: Record<string, string> = {
  // Lighting
  "svitlodiodni-lampy": "5543", // Home & Garden > Lighting > Light Bulbs
  "gu5-3-gu10": "5543",

  // Electrical Equipment
  "modulni-avtomatychni-vymykachi-schneider-electric": "499873", // Home & Garden > Electrical Supplies > Circuit Breakers
  "sylovi-avtomatychni-vymykach-va-e-utrust": "499873",
  "peremykachi-modulni-i-0-ii-seriyi-rpv": "499873",
  "klemni-zatyskachi-kintsevi-10kh1-seriyi-s": "499882", // Home & Garden > Electrical Supplies > Terminal Blocks
  "klemy-mahistralni-z-zakhysnoyu-kryshkoyu": "499882",
  "khomuty-plastykovi-styazhky-neylonovi": "4124", // Hardware > Cable Accessories > Cable Ties
  "kabelni-zatyskachi-pid-dyubel": "4122", // Hardware > Cable Accessories > Cable Clips
  "spiralni-kabelni-vvody-seriyi-pgs": "4122",
  "roz-yemy-konektory-z-yednuvachi-dlya-sks": "499878", // Home & Garden > Electrical Supplies > Connectors
  "svitlosyhnalna-armatura-z-indykatoramy": "1113", // Home & Garden > Lighting & Electrical > Electrical Supplies
  "svitlosyhnalna-armatura-z-indykatorom-napruhy-as-ta-strumu-seriyi-u-adm-va": "1113",
  "izolyatory-trymachi-sylovoyi-shyny": "1113",
  "komplekt-shyn-perekhidnykh": "1113",
  "korobky-rozpodilchi-uatmo": "499876", // Home & Garden > Electrical Supplies > Electrical Boxes & Covers
  "korpusa-metalevi": "499876",
  "korpusa-z-montazhnoyu-panellyu-metalevi-seriyi-ubox": "499876",
  "ip65": "499876",
  "ip54-1": "499876",
  "navisni": "499876",
  "navisni-light": "499876",

  // Power Supplies / Generators
  "dyzelni-elektroheneratory": "1478", // Hardware > Power Generators
  "ups-dzhb-u-zakhysnomu-boksi": "300", // Electronics > Computers > Computer Accessories > UPS
  "avtomobilni-zaryadni-prystroyi": "1461", // Electronics > Electronics Accessories > Power Charger

  // Tools & Hardware
  "pryladdya-dlya-hraveriv": "8094", // Hardware > Tool Accessories
  "sverdla-dlya-betonu": "1045", // Hardware > Tool Accessories > Drill Bits & Accessories
  "klyuchi-dlya-zatysku-patrona": "8094",
  "perekhidnyky-dlya-patrona": "8094",
  "perekhidnyky-sds-plus-i-sds-max": "8094",
  "klyuchi-shestyhranni-h-obrazni": "1111", // Hardware > Tools > Putty Knives & Scrapers / Hand Tools
  "shpateli-z-nerzhaviyuchoyi-stali": "1111",
  "sklorizy": "1111",
  "strubtsyny-avtomat": "1111",
  "lomy-i-tsvyakhosmyky": "1111",
  "lebidky-barabanni": "5917", // Hardware > Winches

  // Garden
  "nozhytsi-dlya-stryzhky-travy-i-obrizky-hilok": "5410", // Home & Garden > Lawn & Garden > Garden Shears
  "motopylky-lantsyuhovi-benzopyly": "2516", // Home & Garden > Chainsaws
  "snihoprybyralni-mashyny": "5422", // Home & Garden > Lawn & Garden > Snow Blowers
  "snihoprybyralnyky-elektrychni": "5422",
  "shlanhy-i-kotushky": "5409", // Home & Garden > Lawn & Garden > Garden Hoses
  "nasadky-dlya-polyvannya": "5409",

  // Safety
  "kasky-ta-nakolinnyky": "5698", // Business & Industrial > Work Safety Protective Gear > Knee Pads
  "videodomofon": "1120", // Home & Garden > Home Improvement > Home Security Systems
};

export const DEFAULT_GOOGLE_TAXONOMY = "604"; // Home & Garden > Lighting & Electrical > Electrical Supplies
