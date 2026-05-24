import type { Locale } from "@/lib/i18n/translations";
import { productCatalogById } from "@/data/productCatalog";

type ProductText = {
  id: string;
  name: string;
  detail?: string | null;
  category?: string;
  categoryLabel?: string;
  sellUnitLabel?: string;
  displayUnit?: string;
};

const categoryLabels = {
  vi: {
    bestdeal: "Best deal",
    dairy: "Sữa & chế phẩm sữa",
    grains: "Ngũ cốc & lương thực",
    "meat-seafood": "Thịt & hải sản",
    sauces: "Gia vị & nước chấm",
    vegetable: "Rau, củ, quả",
    vegetables: "Rau, củ, quả",
    "egg-dairy": "Sữa & chế phẩm sữa",
    meat: "Thịt & hải sản",
    "rice-noodle": "Ngũ cốc & lương thực",
    seasoning: "Gia vị & nước chấm"
  },
  en: {
    bestdeal: "Best deal",
    dairy: "Milk, eggs & dairy",
    grains: "Grains & staples",
    "meat-seafood": "Meat & seafood",
    sauces: "Seasoning & sauces",
    vegetable: "Vegetables & fruit",
    vegetables: "Vegetables & fruit",
    "egg-dairy": "Milk, eggs & dairy",
    meat: "Meat & seafood",
    "rice-noodle": "Grains & staples",
    seasoning: "Seasoning & sauces"
  }
} as const;

const unitLabels: Record<Locale, Record<string, string>> = {
  vi: {
    item: "sản phẩm",
    box: "hộp",
    pack: "gói",
    bottle: "chai",
    jar: "hũ",
    bag: "túi",
    can: "lon",
    piece: "cái",
    carton: "thùng",
    pouch: "bịch",
    tube: "tuýp",
    bunch: "bó",
    tray: "khay",
    set: "bộ"
  },
  en: {
    item: "item",
    "sản phẩm": "item",
    box: "box",
    "hộp": "box",
    pack: "pack",
    "gói": "pack",
    "lốc": "pack",
    bottle: "bottle",
    "chai": "bottle",
    jar: "jar",
    "hũ": "jar",
    bag: "bag",
    "túi": "bag",
    can: "can",
    "lon": "can",
    piece: "piece",
    "cái": "item",
    carton: "carton",
    "thùng": "carton",
    pouch: "pouch",
    "bịch": "pouch",
    tube: "tube",
    "tuýp": "tube",
    bunch: "bunch",
    "bó": "bunch",
    tray: "tray",
    "khay": "tray",
    "vỉ": "tray",
    set: "set",
    "bộ": "set",
    combo: "combo"
  }
};

const englishProductNames: Record<string, string> = {
  "bestdeal-001": "Seedless watermelon",
  "bestdeal-002": "Spicy grilled sausage",
  "bestdeal-003": "Multi-function electric toothbrush",
  "bestdeal-004": "Rechargeable desk fan",
  "bestdeal-005": "Taiwanese fresh sausage",
  "bestdeal-006": "Multi-function tea kettle",
  "bestdeal-007": "Facial tissue pack",
  "bestdeal-008": "Sriracha chili sauce",
  "bestdeal-009": "Portable power bank",
  "bestdeal-010": "Vietnamese shrimp and pork cake",
  "bestdeal-011": "Vietnamese shrimp and pork cake",
  "bestdeal-012": "Storage box",
  "bestdeal-013": "Gift plush toy",
  "bestdeal-014": "Tefal rice cooker",
  "bestdeal-015": "Fish sauce",
  "bestdeal-016": "Bird's nest drink set",
  "bestdeal-017": "Mackerel",
  "bestdeal-018": "Electric kettle",
  "dairy-001": "Chicken eggs",
  "dairy-002": "Duck eggs",
  "dairy-003": "Salted duck eggs",
  "dairy-004": "Century duck eggs",
  "dairy-005": "Fami calcium soy milk",
  "dairy-006": "Mlekovita UHT milk",
  "dairy-007": "Vinamilk low-sugar UHT milk",
  "dairy-008": "Dutch Lady low-sugar UHT milk",
  "dairy-009": "Milo A2 low-sugar cereal milk",
  "dairy-010": "Ensure Original vanilla ready-to-drink",
  "dairy-011": "Abbott ready-to-drink nutrition milk",
  "dairy-012": "Vinamilk yogurt",
  "dairy-013": "Strawberry yogurt drink",
  "dairy-014": "Fristi grape yogurt drink",
  "dairy-015": "Ong Tho sweetened condensed milk can",
  "dairy-016": "Ong Tho sweetened condensed milk box",
  "dairy-017": "Ong Tho sweetened condensed milk tube",
  "dairy-018": "Celano vanilla cone ice cream",
  "dairy-019": "Chocolate chip ice cream",
  "dairy-020": "StFood cheese powder",
  "dairy-021": "Paysan Breton shredded cheese",
  "dairy-022": "Laughing Cow original cheese",
  "dairy-023": "Laughing Cow strawberry cheese",
  "dairy-024": "Tuong An butter-flavor margarine",
  "egg-001": "Fresh chicken eggs size XL",
  "lavie-001": "La Vie mineral water",
  "milk-001": "Mlekovita UHT milk",
  "milk-002": "UHT milk 4-pack",
  "noodle-001": "3 Mien chicken pho-style instant noodles",
  "noodle-002": "Hao Hao sour shrimp instant noodles",
  "revive-001": "Revive electrolyte drink",
  "rice-001": "Vua Gao Phu Sa fragrant rice",
  "sapvwa-water-001": "Sapuwa purified water",
  "soymilk-001": "Fami low-sugar calcium soy milk",
  "spicy-noodle-001": "Acecook Siukay seafood spicy noodles",
  "spicy-noodle-002": "Acecook Siukay beef spicy noodles",
  "tissue-001": "Let Green facial tissue",
  "vinamilk-001": "Vinamilk UHT milk",
  "vinamilk-yogurt-001": "Vinamilk yogurt 4-pack",
  "vinamilk-yogurt-002": "Vinamilk sweetened yogurt",
  "vinh-hao-001": "Vinh Hao mineral water",
  "meat-001": "Pork belly",
  "meat-002": "Herb-marinated pork chops",
  "meat-003": "Pork shoulder butt",
  "meat-004": "Pork ribs",
  "meat-005": "Beef tenderloin",
  "meat-006": "Australian beef steak",
  "meat-007": "Beef shank",
  "meat-008": "Vietnamese beef ribs tray",
  "meat-009": "CP chicken breast fillet",
  "meat-010": "CP chicken drumsticks",
  "meat-011": "CP chicken thigh quarters",
  "meat-012": "CP fresh chicken wings",
  "meat-013": "Sliced catfish steaks",
  "meat-014": "Packed sliced basa fish",
  "meat-015": "Short mackerel",
  "meat-016": "Mackerel",
  "meat-017": "Hong Huong salted squid",
  "meat-018": "Skin-on salmon fillet",
  "meat-019": "Sliced cobia steaks",
  "meat-020": "Whole white pomfret",
  "meat-021": "Fresh whiteleg shrimp size 30-40",
  "meat-022": "Tinh Gia jellyfish salad",
  "meat-023": "Thoai An fried fish cake",
  "meat-024": "Dill fish balls",
  "carb-001": "Otto plain sandwich bread",
  "carb-002": "Vinh Hien purple brown rice",
  "carb-003": "Vietnamese yellow flower sticky rice",
  "carb-004": "Vua Gao ST25 fragrant rice",
  "carb-005": "Susan dry pho noodles",
  "carb-006": "Dry rice crackers",
  "carb-007": "Vifon glass noodles",
  "carb-008": "Ba Bay rice vermicelli",
  "carb-009": "Nuffam dry hu tieu noodles",
  "carb-010": "Meizan premium egg noodles",
  "carb-011": "Dry banh canh noodles",
  "carb-012": "Nuffam long vegetable pasta",
  "carb-013": "Meizan cornstarch",
  "carb-014": "Meizan banh xeo flour",
  "carb-015": "Tai Ky rice flour",
  "carb-016": "Meizan premium all-purpose flour",
  "carb-017": "Meizan crispy frying flour",
  "carb-018": "Cung Dinh pork rib hu tieu noodles",
  "carb-019": "Vifon beef pho packet",
  "carb-020": "Fresh salmon porridge combo",
  "carb-021": "MacCereal nutritious cereal",
  "seasoning-001": "Quang Ngai golden sugar",
  "seasoning-002": "Bien Hoa refined white sugar",
  "seasoning-003": "A Tuan Ben Tre coconut caramel sauce",
  "seasoning-004": "Pure palm sugar caramel sauce",
  "seasoning-005": "Viper turmeric powder",
  "seasoning-006": "Viper star anise",
  "seasoning-007": "Viper cinnamon sticks",
  "seasoning-008": "Thanh Loc annatto powder",
  "seasoning-009": "Thanh Loc garlic powder",
  "seasoning-010": "Thanh Loc five-spice powder",
  "seasoning-011": "Meizan premium sesame oil",
  "seasoning-012": "Neptune premium cooking oil",
  "seasoning-013": "Meizan MSG",
  "seasoning-014": "Knorr pork bone seasoning granules",
  "seasoning-015": "Ong Cha Va 707 soy sauce",
  "seasoning-016": "Premium fish sauce 2-bottle pack",
  "seasoning-017": "Maggi concentrated oyster sauce",
  "seasoning-018": "Ajinomoto fermented rice vinegar",
  "seasoning-019": "Nam Duong chili sauce",
  "seasoning-020": "Chinsu tomato ketchup",
  "seasoning-021": "Simply mayonnaise",
  "seasoning-022": "Cholimex sate dried chili",
  "seasoning-023": "Fadely ground black pepper",
  "seasoning-024": "Vianca curry powder",
  "vegetable-001": "Soybean sprouts",
  "vegetable-002": "Baby bok choy",
  "vegetable-003": "Phu Loc water spinach",
  "vegetable-004": "Asparagus grade III",
  "vegetable-005": "Okra",
  "vegetable-006": "Da Lat tomatoes",
  "vegetable-007": "Cucumbers",
  "vegetable-008": "Onions",
  "vegetable-009": "Carrots",
  "vegetable-010": "Potatoes",
  "vegetable-011": "Two-color bell peppers",
  "vegetable-012": "Lemongrass stalks",
  "vegetable-013": "Ly Son shallots",
  "vegetable-014": "Canned sour soup tamarind",
  "vegetable-015": "Fresh ginger",
  "vegetable-016": "Red horn chili",
  "vegetable-017": "Green onion and cilantro mix",
  "vegetable-018": "Whole Ly Son garlic",
  "vegetable-019": "Fresh calamansi bag",
  "vegetable-020": "Straw mushrooms",
  "vegetable-021": "Korean enoki mushrooms",
  "vegetable-022": "Lettuce",
  "vegetable-023": "Napa cabbage",
  "vegetable-024": "Elephant ear stem"
};

function englishNameFromId(product: ProductText) {
  if (englishProductNames[product.id]) {
    return englishProductNames[product.id];
  }

  const match = product.id.match(/^(dairy|meat|vegetable|seasoning|carb|rice-noodle)-(\d+)/);

  if (!match) {
    return product.name;
  }

  const [, group, number] = match;
  const labelByGroup: Record<string, string> = {
    dairy: "Dairy item",
    meat: "Meat and seafood item",
    vegetable: "Vegetable item",
    seasoning: "Seasoning item",
    carb: "Staple food item",
    "rice-noodle": "Staple food item"
  };

  return `${labelByGroup[group] ?? "Product"} ${Number(number)}`;
}

function localizeUnit(value: string | null | undefined, locale: Locale) {
  if (!value) {
    return value ?? "";
  }

  const normalizedValue = value.trim().toLowerCase();

  return unitLabels[locale][normalizedValue] ?? unitLabels[locale][value] ?? value;
}

function isEggProduct(product: ProductText) {
  return /trứng|egg/i.test([product.id, product.name, product.detail, product.displayUnit].filter(Boolean).join(" "));
}

function localizeProductDetail(product: ProductText, locale: Locale) {
  const rawDetail = product.detail ?? product.displayUnit ?? "";

  if (!rawDetail || locale === "vi") {
    return rawDetail;
  }

  const pieceWord = isEggProduct(product) ? "eggs" : "pcs";

  return rawDetail
    .replace(/\bbox\s+(\d+)\s+(?:trứng|quả|pcs|eggs)/gi, `$1 ${pieceWord}/box`)
    .replace(/\bpack\s+(\d+)\s+box(?:es)?\b/gi, "$1 boxes/pack")
    .replace(/\bpack\s+(\d+)\s+bottle(?:s)?\b/gi, "$1 bottles/pack")
    .replace(/hộp\s+(\d+)\s+quả/gi, `$1 ${pieceWord}/box`)
    .replace(/(\d+)\s*(?:trứng|quả)\s*\/\s*hộp/gi, `$1 ${pieceWord}/box`)
    .replace(/lốc\s+(\d+)\s+hộp/gi, "$1 boxes/pack")
    .replace(/(\d+)\s+hộp\s*\/\s*lốc/gi, "$1 boxes/pack")
    .replace(/(\d+)\s+chai\s*\/\s*lốc/gi, "$1 bottles/pack")
    .replace(/(\d+)\s+hộp\s+x/gi, "$1 boxes x")
    .replace(/(\d+)\s+chai\s+x/gi, "$1 bottles x")
    .replace(/gói\s+(\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))/gi, "$1/pack")
    .replace(/(\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))\s*\/\s*gói/gi, "$1/pack")
    .replace(/(\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))\s*\/\s*hộp/gi, "$1/box")
    .replace(/(\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))\s*\/\s*chai/gi, "$1/bottle")
    .replace(/(\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))\s*\/\s*lon/gi, "$1/can")
    .replace(/(\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))\s*\/\s*lốc/gi, "$1/pack")
    .replace(/(\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))\s*\/\s*hũ/gi, "$1/jar")
    .replace(/(\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))\s*\/\s*túi/gi, "$1/bag")
    .replace(/(\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))\s*\/\s*tuýp/gi, "$1/tube")
    .replace(/(\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))\s*\/\s*bó/gi, "$1/bunch")
    .replace(/(\d+(?:[.,]\d+)?\s*(?:g|kg|ml|l))\s*\/\s*sản phẩm/gi, "$1/item")
    .replace(/trứng/gi, "eggs")
    .replace(/quả/gi, pieceWord)
    .replace(/sản phẩm/gi, "item")
    .replace(/hộp/gi, "box")
    .replace(/gói/gi, "pack")
    .replace(/chai/gi, "bottle")
    .replace(/lốc/gi, "pack")
    .replace(/thùng/gi, "carton")
    .replace(/bịch/gi, "pouch")
    .replace(/hũ/gi, "jar")
    .replace(/lon/gi, "can")
    .replace(/khay/gi, "tray")
    .replace(/vỉ/gi, "tray")
    .replace(/túi/gi, "bag")
    .replace(/cái/gi, "item")
    .replace(/bộ/gi, "set")
    .replace(/tuýp/gi, "tube")
    .replace(/bó/gi, "bunch")
    .replace(/khoảng/gi, "about")
    .replace(/từ/gi, "from")
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveProduct(product: ProductText): ProductText {
  const catalogProduct = productCatalogById.get(product.id);

  if (!catalogProduct) {
    return product;
  }

  return {
    ...product,
    name: catalogProduct.name,
    detail: catalogProduct.detail ?? catalogProduct.displayUnit ?? product.detail,
    category: catalogProduct.category,
    categoryLabel: catalogProduct.categoryLabel,
    sellUnitLabel: catalogProduct.sellUnitLabel,
    displayUnit: catalogProduct.displayUnit
  };
}

export function getLocalizedProductText(product: ProductText, locale: Locale) {
  const resolvedProduct = resolveProduct(product);

  if (locale === "vi") {
    return {
      name: resolvedProduct.name,
      detail: resolvedProduct.detail ?? resolvedProduct.displayUnit ?? "",
      category: resolvedProduct.categoryLabel ?? resolvedProduct.category ?? ""
    };
  }

  const categoryKey = resolvedProduct.category ?? "";
  const category =
    categoryLabels.en[categoryKey as keyof typeof categoryLabels.en] ??
    resolvedProduct.categoryLabel ??
    resolvedProduct.category ??
    "";

  return {
    name: englishNameFromId(resolvedProduct),
    detail: localizeProductDetail(resolvedProduct, locale) || localizeUnit(resolvedProduct.sellUnitLabel, locale),
    category
  };
}

export function getLocalizedCategoryLabel(categoryKey: string, locale: Locale) {
  return (
    categoryLabels[locale][categoryKey as keyof (typeof categoryLabels)[Locale]] ??
    categoryKey
  );
}
