import { z } from "zod";

import dishIndexData from "@/data/dish-index.json";
import recipeTemplateData from "@/data/recipe-templates.json";
import type {
  GenerateRecipeResult,
  Recipe,
  RecipeIngredient,
  RecipeStep,
  UpsellSuggestion
} from "@/types";

const GEMMA_SERVICE_URL = process.env.GEMMA_SERVICE_URL;

const ingredientSchema = z.object({
  name: z.string().min(1),
  normalizedName: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  required: z.boolean().optional(),
  optional: z.boolean().optional(),
  notes: z.string().optional()
});

const gemmaRecipeResponseSchema = z.object({
  isSafe: z.boolean(),
  dishName: z.string().min(1),
  servings: z.number().int().positive(),
  allergyWarnings: z.array(z.string()),
  conflictingIngredients: z.array(z.string()),
  saferAlternatives: z.array(z.string()),
  recipe: z
    .object({
      dishName: z.string().min(1),
      summary: z.string().min(1),
      cuisine: z.string().min(1),
      servings: z.number().int().positive(),
      prepTimeMinutes: z.number().int().nonnegative(),
      cookTimeMinutes: z.number().int().nonnegative(),
      difficulty: z.enum(["easy", "medium", "advanced"]),
      ingredients: z.array(ingredientSchema),
      seasonings: z.array(ingredientSchema).optional(),
      steps: z.array(
        z.object({
          order: z.number().int().positive(),
          instruction: z.string().min(1),
          durationMinutes: z.number().int().positive().optional()
        })
      ),
      notes: z.array(z.string()).optional(),
      youtubeSearchKeyword: z.string().min(1)
    })
    .nullable(),
  upsellSuggestions: z.array(
    z.object({
      name: z.string().min(1),
      normalizedName: z.string().min(1),
      quantity: z.number().positive(),
      unit: z.string().min(1),
      reason: z.string().min(1)
    })
  )
});

type DishIndexEntry = {
  id: string;
  name: string;
  cuisine: string;
  summary: string;
  requiredIngredients: string[];
  optionalIngredients: string[];
  estimatedTimeMinutes: number;
  difficulty: "easy" | "medium" | "advanced";
};

type RecipeTemplate = {
  dishName: string;
  cuisine: string;
  summary: string;
  difficulty: "easy" | "medium" | "advanced";
  baseServings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
};

type RecipeEnhancement = {
  seasonings: RecipeIngredient[];
  notes: string[];
  upsellSuggestions: UpsellSuggestion[];
  saferAlternatives: string[];
};

const recipeTemplates = recipeTemplateData as RecipeTemplate[];
const dishIndex = dishIndexData as DishIndexEntry[];

const recipeEnhancements: Record<string, RecipeEnhancement> = {
  "tomato egg stir-fry": {
    seasonings: [
      { name: "Muối", normalizedName: "salt", quantity: 0.75, unit: "thìa cà phê", required: true },
      { name: "Đường", normalizedName: "sugar", quantity: 0.5, unit: "thìa cà phê", required: true },
      { name: "Nước tương", normalizedName: "soy sauce", quantity: 1, unit: "thìa canh", required: true }
    ],
    notes: [
      "Nên xào trứng trước rồi cho trở lại sau cùng để trứng mềm và không bị khô.",
      "Nếu nấu số lượng lớn, nên xào cà chua thành hai lượt để món không bị ra nhiều nước."
    ],
    upsellSuggestions: [
      {
        name: "Hành lá",
        normalizedName: "spring onion",
        quantity: 1,
        unit: "bó",
        reason: "Giúp món ăn thơm hơn và nhìn đầy đặn hơn khi dọn ra bàn."
      },
      {
        name: "Gạo Jasmine",
        normalizedName: "rice",
        quantity: 1,
        unit: "túi",
        reason: "Ăn kèm rất hợp để thành một bữa cơm trọn vẹn."
      }
    ],
    saferAlternatives: ["Garlic Butter Pasta", "Vegetable tofu soup"]
  },
  "thai basil chicken rice bowl": {
    seasonings: [
      { name: "Nước mắm", normalizedName: "fish sauce", quantity: 1.5, unit: "thìa canh", required: true },
      { name: "Nước tương", normalizedName: "soy sauce", quantity: 1, unit: "thìa canh", required: true },
      { name: "Đường", normalizedName: "sugar", quantity: 1, unit: "thìa cà phê", required: true }
    ],
    notes: [
      "Nếu nấu cho nhiều người, nên nấu cơm riêng để chảo xào gà luôn đủ nóng.",
      "Chỉ cho húng quế vào cuối cùng để giữ mùi thơm đặc trưng."
    ],
    upsellSuggestions: [
      {
        name: "Trứng gà thả vườn",
        normalizedName: "egg",
        quantity: 1,
        unit: "vỉ",
        reason: "Thêm trứng ốp la phía trên sẽ làm món ăn béo và hấp dẫn hơn."
      },
      {
        name: "Húng quế Thái",
        normalizedName: "thai basil",
        quantity: 1,
        unit: "bó",
        reason: "Mua thêm húng quế sẽ giúp món ăn thơm hơn khi nấu số lượng lớn."
      }
    ],
    saferAlternatives: ["Garlic Butter Pasta", "Tomato Egg Stir-Fry"]
  },
  "garlic butter pasta": {
    seasonings: [
      { name: "Muối", normalizedName: "salt", quantity: 1, unit: "thìa cà phê", required: true },
      { name: "Tiêu đen", normalizedName: "black pepper", quantity: 0.5, unit: "thìa cà phê", required: true }
    ],
    notes: [
      "Nên giữ lại một ít nước luộc mì và cho vào từ từ để sốt bóng mượt hơn khi nấu nhiều.",
      "Nếu chảo nhỏ, nên chia mì thành vài lượt để tránh bị vón cục."
    ],
    upsellSuggestions: [
      {
        name: "Húng quế",
        normalizedName: "basil",
        quantity: 1,
        unit: "bó",
        reason: "Rau thơm tươi giúp món mì dậy mùi và nhìn hấp dẫn hơn."
      },
      {
        name: "Cà chua chùm đóng gói",
        normalizedName: "tomato",
        quantity: 1,
        unit: "gói",
        reason: "Cà chua nướng thêm vị ngọt và màu sắc đẹp cho món mì."
      }
    ],
    saferAlternatives: ["Tomato Egg Stir-Fry", "Vegetable soup"]
  }
};

function normalizeName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function roundQuantity(quantity: number) {
  return Number(quantity.toFixed(quantity < 10 ? 1 : 0));
}

function scaleIngredient(ingredient: RecipeIngredient, scale: number): RecipeIngredient {
  return {
    ...ingredient,
    required: ingredient.required ?? !ingredient.optional,
    quantity: roundQuantity(ingredient.quantity * scale)
  };
}

function scaleRecipe(
  template: RecipeTemplate,
  enhancement: RecipeEnhancement,
  servings: number
): Recipe {
  const scale = servings / template.baseServings;
  const scaledIngredients = template.ingredients.map((ingredient) =>
    scaleIngredient(ingredient, scale)
  );
  const scaledSeasonings = enhancement.seasonings.map((seasoning) =>
    scaleIngredient(seasoning, scale)
  );
  const notes = [...enhancement.notes];

  if (servings >= 6) {
    notes.push(
      `Với ${servings} khẩu phần, nên sơ chế sẵn toàn bộ nguyên liệu trước khi bật bếp để món chín đều hơn.`
    );
  }

  if (servings >= 10) {
    notes.push("Nên dùng chảo lớn hơn hoặc nấu thành hai lượt để tránh quá tải và giúp gia vị thấm đều.");
  }

  return {
    dishName: template.dishName,
    summary: template.summary,
    cuisine: template.cuisine,
    servings,
    prepTimeMinutes: template.prepTimeMinutes,
    cookTimeMinutes: template.cookTimeMinutes + (servings >= 8 ? 5 : 0),
    difficulty: template.difficulty,
    ingredients: scaledIngredients,
    seasonings: scaledSeasonings,
    steps: template.steps,
    notes,
    youtubeSearchKeyword: `${template.dishName} hướng dẫn nấu ăn`
  };
}

function getEnhancement(normalizedDishName: string): RecipeEnhancement {
  return (
    recipeEnhancements[normalizedDishName] ?? {
      seasonings: [
        { name: "Muối", normalizedName: "salt", quantity: 1, unit: "thìa cà phê", required: true }
      ],
      notes: ["Hãy nêm nếm lại ở cuối quá trình nấu để phù hợp với khẩu phần thực tế."],
      upsellSuggestions: [],
      saferAlternatives: dishIndex.slice(0, 2).map((dish) => dish.name)
    }
  );
}

function getAllDishIngredients(recipe: Recipe | null): string[] {
  if (!recipe) {
    return [];
  }

  return [
    ...recipe.ingredients.map((ingredient) => ingredient.normalizedName),
    ...(recipe.seasonings ?? []).map((ingredient) => ingredient.normalizedName)
  ];
}

function buildAllergyWarnings(conflictingIngredients: string[], allergies: string[]) {
  return conflictingIngredients.map(
    (ingredient) =>
      `Món ăn này có chứa ${ingredient}, xung đột với thông tin dị ứng đã nhập: ${allergies.join(", ")}.`
  );
}

function getSaferAlternatives(
  allergies: string[],
  currentDishName: string,
  fallbackAlternatives: string[]
) {
  const normalizedAllergies = allergies.map(normalizeName);

  const safeCatalogAlternatives = dishIndex
    .filter((dish) => normalizeName(dish.name) !== normalizeName(currentDishName))
    .filter((dish) => {
      const allIngredients = [...dish.requiredIngredients, ...dish.optionalIngredients].map(normalizeName);
      return normalizedAllergies.every((allergy) => !allIngredients.includes(allergy));
    })
    .map((dish) => dish.name);

  const combined = [...safeCatalogAlternatives, ...fallbackAlternatives].filter(
    (value, index, array) => array.indexOf(value) === index
  );

  return combined.slice(0, 3);
}

function buildMockRecipeResult(
  dishName: string,
  servings: number,
  allergies: string[] = []
): GenerateRecipeResult {
  const normalizedDishName = normalizeName(dishName);
  const template = recipeTemplates.find(
    (entry) => normalizeName(entry.dishName) === normalizedDishName
  );
  const enhancement = getEnhancement(normalizedDishName);

  const recipe = template
    ? scaleRecipe(template, enhancement, servings)
    : {
        dishName,
        summary: "Đây là công thức mẫu linh hoạt được tạo ra khi backend Gemma chưa được cấu hình.",
        cuisine: "Linh hoạt",
        servings,
        prepTimeMinutes: 15,
        cookTimeMinutes: servings >= 8 ? 28 : 18,
        difficulty: "easy" as const,
        ingredients: [
          {
            name: "Nguyên liệu chính",
            normalizedName: "main ingredient",
            quantity: servings,
            unit: "phần",
            required: true
          },
          {
            name: "Tỏi",
            normalizedName: "garlic",
            quantity: Math.max(2, servings / 2),
            unit: "tép",
            optional: true,
            required: false
          }
        ],
        seasonings: [
          {
            name: "Muối",
            normalizedName: "salt",
            quantity: 1,
            unit: "thìa cà phê",
            required: true
          }
        ],
        steps: [
          {
            order: 1,
            instruction: "Sơ chế và chia nguyên liệu phù hợp với số người ăn đã yêu cầu.",
            durationMinutes: 5
          },
          {
            order: 2,
            instruction: "Nấu nguyên liệu chính theo từng lượt nếu cần để chảo không bị quá tải.",
            durationMinutes: 10
          },
          {
            order: 3,
            instruction: "Nêm nếm lại cho vừa rồi dùng khi còn nóng.",
            durationMinutes: 3
          }
        ],
        notes: [
          "Nếu nấu cho nhóm đông người, nên sơ chế sẵn toàn bộ rau củ và đạm trước khi bật bếp."
        ],
        youtubeSearchKeyword: `${dishName} hướng dẫn nấu ăn`
      };

  const normalizedAllergies = allergies.map(normalizeName).filter(Boolean);
  const dishIngredients = getAllDishIngredients(recipe);
  const conflictingIngredients = dishIngredients.filter((ingredient, index, array) => {
    return normalizedAllergies.includes(ingredient) && array.indexOf(ingredient) === index;
  });

  if (conflictingIngredients.length > 0) {
    return {
      isSafe: false,
      dishName: recipe.dishName,
      servings,
      allergyWarnings: buildAllergyWarnings(conflictingIngredients, normalizedAllergies),
      conflictingIngredients,
      saferAlternatives: getSaferAlternatives(
        normalizedAllergies,
        recipe.dishName,
        enhancement.saferAlternatives
      ),
      recipe: null,
      upsellSuggestions: [],
      fallbackUsed: true,
      model: "gemma-mock-wrapper"
    };
  }

  return {
    isSafe: true,
    dishName: recipe.dishName,
    servings,
    allergyWarnings: [],
    conflictingIngredients: [],
    saferAlternatives: [],
    recipe,
    upsellSuggestions: enhancement.upsellSuggestions,
    fallbackUsed: true,
    model: "gemma-mock-wrapper"
  };
}

export async function generateRecipeWithGemma(
  dishName: string,
  servings: number,
  allergies: string[] = []
): Promise<GenerateRecipeResult> {
  if (!GEMMA_SERVICE_URL) {
    return buildMockRecipeResult(dishName, servings, allergies);
  }

  // GEMMA SERVICE WRAPPER: dish suggestion and recipe reasoning
  const response = await fetch(`${GEMMA_SERVICE_URL.replace(/\/$/, "")}/recipe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      dishName,
      servings,
      allergies
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Gemma recipe request failed with status ${response.status}`);
  }

  const payload = gemmaRecipeResponseSchema.parse((await response.json()) as unknown);

  return {
    ...payload,
    fallbackUsed: false,
    model: "gemma-service-wrapper"
  };
}
