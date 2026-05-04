export type NutritionIngredientInput = {
  name: string;
  amount?: string;
};

export type RecipeNutritionEstimate = {
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
};

type NutritionProfile = {
  keywords: string[];
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  defaultGrams: number;
};

const PROFILES: NutritionProfile[] = [
  {
    keywords: ["gạo", "cơm", "bún", "mì", "miến", "phở", "nui", "bột", "khoai"],
    calories: 160,
    carbs: 34,
    protein: 3,
    fat: 1,
    defaultGrams: 180
  },
  {
    keywords: ["đường", "mật ong"],
    calories: 387,
    carbs: 100,
    protein: 0,
    fat: 0,
    defaultGrams: 12
  },
  {
    keywords: ["dầu", "bơ", "mỡ"],
    calories: 884,
    carbs: 0,
    protein: 0,
    fat: 100,
    defaultGrams: 14
  },
  {
    keywords: ["sữa", "kem", "phô mai", "yogurt", "sữa chua"],
    calories: 64,
    carbs: 5,
    protein: 3.4,
    fat: 3.3,
    defaultGrams: 200
  },
  {
    keywords: ["trứng"],
    calories: 143,
    carbs: 1,
    protein: 13,
    fat: 10,
    defaultGrams: 100
  },
  {
    keywords: ["cá", "tôm", "mực", "nghêu", "sò", "hải sản"],
    calories: 135,
    carbs: 0,
    protein: 22,
    fat: 5,
    defaultGrams: 150
  },
  {
    keywords: ["gà", "bò", "heo", "thịt", "sườn", "ba chỉ", "chả", "xúc xích"],
    calories: 210,
    carbs: 0,
    protein: 21,
    fat: 14,
    defaultGrams: 150
  },
  {
    keywords: ["đậu", "đậu hũ", "tofu", "nấm"],
    calories: 95,
    carbs: 6,
    protein: 9,
    fat: 4,
    defaultGrams: 120
  },
  {
    keywords: ["rau", "cải", "cà", "dưa", "hành", "tỏi", "ớt", "ngò", "thơm", "dứa", "giá", "măng"],
    calories: 28,
    carbs: 6,
    protein: 1.5,
    fat: 0.3,
    defaultGrams: 100
  },
  {
    keywords: ["nước mắm", "xì dầu", "tương", "muối", "tiêu", "hạt nêm", "gia vị"],
    calories: 25,
    carbs: 4,
    protein: 1,
    fat: 0,
    defaultGrams: 15
  }
];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

function findProfile(name: string) {
  const normalizedName = normalizeText(name);

  return (
    PROFILES.find((profile) =>
      profile.keywords.some((keyword) => normalizedName.includes(normalizeText(keyword)))
    ) ?? PROFILES[PROFILES.length - 1]
  );
}

function parseAmountToGrams(amount: string | undefined, profile: NutritionProfile) {
  if (!amount) {
    return profile.defaultGrams;
  }

  const normalized = normalizeText(amount.replace(/,/g, "."));
  const numbers = normalized.match(/\d+(?:\.\d+)?/g)?.map(Number).filter(Number.isFinite) ?? [];
  const quantity = numbers.length > 0 ? Math.max(...numbers) : 1;

  if (normalized.includes("kg")) {
    return quantity * 1000;
  }

  if (normalized.includes("ml")) {
    return quantity;
  }

  if (/\bl\b/.test(normalized) || normalized.includes("lit")) {
    return quantity * 1000;
  }

  if (normalized.includes("muong") || normalized.includes("tbsp")) {
    return quantity * 15;
  }

  if (normalized.includes("tsp") || normalized.includes("ca phe")) {
    return quantity * 5;
  }

  if (
    normalized.includes("qua") ||
    normalized.includes("cai") ||
    normalized.includes("cu") ||
    normalized.includes("trai")
  ) {
    return quantity * Math.min(profile.defaultGrams, 70);
  }

  if (normalized.includes("g")) {
    return quantity;
  }

  return Math.max(quantity * profile.defaultGrams, profile.defaultGrams);
}

export function estimateRecipeNutrition(
  ingredients: NutritionIngredientInput[],
  servings = 1
): RecipeNutritionEstimate {
  const safeServings = Math.max(1, Math.round(servings || 1));
  const sourceIngredients = ingredients.length > 0 ? ingredients : [{ name: "món ăn", amount: "1 phần" }];

  const totals = sourceIngredients.reduce(
    (sum, ingredient) => {
      const profile = findProfile(ingredient.name);
      const grams = Math.min(parseAmountToGrams(ingredient.amount, profile), 2000);
      const multiplier = grams / 100;

      return {
        calories: sum.calories + profile.calories * multiplier,
        carbs: sum.carbs + profile.carbs * multiplier,
        protein: sum.protein + profile.protein * multiplier,
        fat: sum.fat + profile.fat * multiplier
      };
    },
    { calories: 0, carbs: 0, protein: 0, fat: 0 }
  );

  return {
    calories: `${Math.max(80, Math.round(totals.calories / safeServings))}`,
    carbs: `${Math.max(1, Math.round(totals.carbs / safeServings))}g`,
    protein: `${Math.max(1, Math.round(totals.protein / safeServings))}g`,
    fat: `${Math.max(1, Math.round(totals.fat / safeServings))}g`
  };
}

export function ingredientsTextToNutritionInputs(value: string): NutritionIngredientInput[] {
  return value
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({ name }));
}
