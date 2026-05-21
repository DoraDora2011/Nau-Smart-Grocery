import type { Locale } from "@/lib/i18n/translations";

const viIngredientNames: Record<string, string> = {
  apple: "Táo",
  banana: "Chuối",
  "banana flower": "Hoa chuối",
  basil: "Húng quế",
  "bean sprout": "Giá đỗ",
  "bean sprouts": "Giá đỗ",
  beef: "Thịt bò",
  butter: "Bơ",
  bread: "Bánh mì",
  "bell pepper": "Ớt chuông",
  "bitter melon": "Khổ qua",
  broccoli: "Bông cải xanh",
  cabbage: "Bắp cải",
  carrot: "Cà rốt",
  cauliflower: "Bông cải trắng",
  celery: "Cần tây",
  cheese: "Phô mai",
  chicken: "Thịt gà",
  cream: "Kem sữa",
  chili: "Ớt",
  cilantro: "Ngò rí",
  coriander: "Ngò rí",
  cucumber: "Dưa leo",
  dill: "Thì là",
  egg: "Trứng",
  eggplant: "Cà tím",
  eggs: "Trứng",
  fish: "Cá",
  "fermented pork": "Nem chua",
  "fermented pork roll": "Nem chua",
  garlic: "Tỏi",
  ginger: "Gừng",
  "green onion": "Hành lá",
  lettuce: "Xà lách",
  lemongrass: "Sả",
  lime: "Chanh",
  mint: "Bạc hà",
  milk: "Sữa",
  mushroom: "Nấm",
  okra: "Đậu bắp",
  onion: "Hành tây",
  pasta: "Mì Ý",
  pineapple: "Dứa",
  pork: "Thịt heo",
  sausage: "Xúc xích",
  "pork roll": "Chả lụa",
  "cha que": "Chả quế",
  "chả quế": "Chả quế",
  "cinnamon pork roll": "Chả quế",
  "vietnamese cinnamon pork roll": "Chả quế",
  "raw pork paste": "Giò sống",
  "pork paste": "Giò sống",
  "beef ball": "Bò viên",
  "beef balls": "Bò viên",
  "fish ball": "Cá viên",
  "fish balls": "Cá viên",
  "fish cake": "Chả cá",
  "vietnamese fish cake": "Chả cá",
  "tofu skin": "Tàu hũ ky",
  "bean curd skin": "Tàu hũ ky",
  "rice paper": "Bánh tráng",
  "rice paper wrapper": "Bánh tráng",
  "pho noodle": "Bánh phở",
  "rice vermicelli": "Bún",
  "vermicelli noodle": "Bún",
  "glass noodle": "Miến",
  "cellophane noodle": "Miến",
  "shrimp paste": "Mắm tôm",
  "fermented shrimp paste": "Mắm ruốc",
  "fish sauce": "Nước mắm",
  "chili sauce": "Tương ớt",
  "pickled mustard greens": "Dưa cải chua",
  "vietnamese pickles": "Đồ chua",
  "pickled carrot and daikon": "Đồ chua",
  "vietnamese coriander": "Rau răm",
  "perilla": "Tía tô",
  "shiso": "Tía tô",
  "sawtooth coriander": "Ngò gai",
  culantro: "Ngò gai",
  "elephant ear stem": "Bạc hà",
  "taro stem": "Bạc hà",
  galangal: "Riềng",
  "tamarind pulp": "Me vắt",
  "tamarind paste": "Me vắt",
  potato: "Khoai tây",
  pumpkin: "Bí đỏ",
  rice: "Gạo",
  scallion: "Hành lá",
  shallot: "Hành tím",
  shrimp: "Tôm",
  spinach: "Rau chân vịt",
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
