import type { Locale } from "@/lib/i18n/translations";

const viIngredientNames: Record<string, string> = {
  apple: "Táo",
  banana: "Chuối",
  "banana flower": "Hoa chuối",
  basil: "Húng quế",
  "bean sprout": "Giá đỗ",
  "bean sprouts": "Giá đỗ",
  beef: "Thịt bò",
  "bell pepper": "Ớt chuông",
  "bitter melon": "Khổ qua",
  broccoli: "Bông cải xanh",
  cabbage: "Bắp cải",
  carrot: "Cà rốt",
  cauliflower: "Bông cải trắng",
  celery: "Cần tây",
  chicken: "Thịt gà",
  chili: "Ớt",
  cilantro: "Ngò rí",
  coriander: "Ngò rí",
  cucumber: "Dưa leo",
  dill: "Thì là",
  egg: "Trứng",
  eggplant: "Cà tím",
  eggs: "Trứng",
  fish: "Cá",
  garlic: "Tỏi",
  ginger: "Gừng",
  "green onion": "Hành lá",
  lettuce: "Xà lách",
  lemongrass: "Sả",
  lime: "Chanh",
  mint: "Bạc hà",
  mushroom: "Nấm",
  okra: "Đậu bắp",
  onion: "Hành tây",
  pineapple: "Dứa",
  pork: "Thịt heo",
  potato: "Khoai tây",
  pumpkin: "Bí đỏ",
  rice: "Gạo",
  scallion: "Hành lá",
  shallot: "Hành tím",
  shrimp: "Tôm",
  "spring onion": "Hành lá",
  tomato: "Cà chua",
  tofu: "Đậu hũ",
  turmeric: "Nghệ",
  watercress: "Cải xoong",
  zucchini: "Bí ngòi"
};

function titleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getLocalizedIngredientName(name: string, locale: Locale) {
  const normalized = name.trim().toLowerCase();

  if (locale === "vi") {
    return viIngredientNames[normalized] ?? titleCase(name);
  }

  return titleCase(name);
}
