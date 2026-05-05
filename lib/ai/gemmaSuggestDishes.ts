import { z } from "zod";

import dishIndexData from "@/data/dish-index.json";
import type { DishSuggestion, SuggestDishesResult } from "@/types";

const GEMMA_SERVICE_URL = process.env.GEMMA_SERVICE_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const gemmaSuggestResponseSchema = z.object({
  suggestions: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      cuisine: z.string().min(1),
      summary: z.string().min(1),
      matchScore: z.number().min(0).max(1),
      estimatedTimeMinutes: z.number().int().positive(),
      difficulty: z.enum(["easy", "medium", "advanced"]),
      matchedIngredients: z.array(z.string()),
      missingIngredients: z.array(z.string()),
      reasons: z.array(z.string()).min(1)
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

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

const dishIndex = dishIndexData as DishIndexEntry[];

function normalizeName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const ingredientSynonyms: Record<string, string[]> = {
  "ca chua": ["tomato", "tomatoes", "ca chua"],
  trung: ["egg", "eggs", "trung", "trung ga", "trung vit"],
  toi: ["garlic", "toi"],
  "hanh la": ["spring onion", "green onion", "scallion", "hanh la"],
  "hanh tim": ["shallot", "hanh tim"],
  "hanh tay": ["onion", "hanh tay"],
  ca: ["fish", "ca", "ca basa", "ca loc", "ca thu", "ca hoi"],
  tom: ["shrimp", "tom"],
  muc: ["squid", "muc"],
  "thit ga": ["chicken", "ga", "thit ga"],
  "thit bo": ["beef", "bo", "thit bo"],
  "thit heo": ["pork", "heo", "thit heo", "thit ba chi", "ba chi"],
  "nem chua": ["nem chua", "fermented pork", "fermented pork roll", "sour pork sausage"],
  "cha lua": ["cha lua", "gio lua", "pork roll", "vietnamese pork roll"],
  "cha que": ["cha que", "chả quế", "cinnamon pork roll", "vietnamese cinnamon pork roll"],
  "cha ca": ["cha ca", "fish cake", "vietnamese fish cake"],
  "gio song": ["gio song", "giò sống", "raw pork paste", "pork paste"],
  "bo vien": ["bo vien", "bò viên", "beef ball", "beef balls"],
  "ca vien": ["ca vien", "cá viên", "fish ball", "fish balls"],
  "dau hu": ["tofu", "dau hu", "dau phu"],
  "tau hu ky": ["tau hu ky", "tàu hũ ky", "tofu skin", "bean curd skin"],
  "hung que": ["basil", "thai basil", "hung que"],
  gao: ["rice", "gao", "com"],
  bun: ["bun", "bún", "rice vermicelli", "vermicelli noodle"],
  mien: ["mien", "miến", "glass noodle", "cellophane noodle"],
  "banh trang": ["banh trang", "bánh tráng", "rice paper", "rice paper wrapper"],
  "banh pho": ["banh pho", "bánh phở", "pho noodle", "rice noodle sheet"],
  "banh canh": ["banh canh", "bánh canh", "thick tapioca noodle"],
  mi: ["noodle", "noodles", "pasta", "mi"],
  bo: ["butter", "bo"],
  "bong cai": ["broccoli", "cauliflower", "bong cai"],
  "dua leo": ["cucumber", "dua leo"],
  dua: ["pineapple", "dua", "thom"],
  "bac ha": ["mint", "bac ha", "doc mung"],
  "gia do": ["bean sprout", "bean sprouts", "gia", "gia do"],
  "dau bap": ["okra", "dau bap"],
  sa: ["lemongrass", "sa"],
  ot: ["chili", "chilli", "ot"],
  gung: ["ginger", "gung"],
  nam: ["mushroom", "nam"],
  "bi do": ["pumpkin", "bi do"],
  "rau muong": ["water spinach", "rau muong", "rau"],
  "xa lach": ["lettuce", "xa lach"],
  "ca rot": ["carrot", "ca rot"],
  chanh: ["lime", "lemon", "chanh"],
  "ngo ri": ["cilantro", "coriander", "ngo ri"],
  "ngo gai": ["ngo gai", "ngò gai", "sawtooth coriander", "culantro"],
  "rau ram": ["rau ram", "rau răm", "vietnamese coriander"],
  "tia to": ["tia to", "tía tô", "perilla", "shiso"],
  "kinh gioi": ["kinh gioi", "kinh giới", "vietnamese balm"],
  "can tay": ["celery", "can tay"],
  "ot chuong": ["bell pepper", "ot chuong"],
  "pho mai": ["cheese", "pho mai"],
  "mam tom": ["mam tom", "mắm tôm", "shrimp paste"],
  "mam ruoc": ["mam ruoc", "mắm ruốc", "fermented shrimp paste"],
  "nuoc mam": ["nuoc mam", "nước mắm", "fish sauce"],
  "tuong ot": ["tuong ot", "tương ớt", "chili sauce"],
  "dua cai chua": ["dua cai chua", "dưa cải chua", "pickled mustard greens"],
  "do chua": ["do chua", "đồ chua", "vietnamese pickles", "pickled carrot and daikon"],
  "cu kieu": ["cu kieu", "củ kiệu", "pickled scallion head", "pickled leek"],
  "me vat": ["me vat", "me vắt", "tamarind pulp", "tamarind paste"],
  rieng: ["rieng", "riềng", "galangal"]
};

const normalizedSynonyms = Object.values(ingredientSynonyms).map((group) =>
  Array.from(new Set(group.map(normalizeName).filter(Boolean)))
);

function expandIngredientAliases(value: string) {
  const normalizedValue = normalizeName(value);
  const aliases = new Set([normalizedValue]);

  normalizedSynonyms.forEach((group) => {
    if (
      group.some(
        (alias) =>
          alias === normalizedValue ||
          (alias.length > 2 && normalizedValue.includes(alias)) ||
          (normalizedValue.length > 2 && alias.includes(normalizedValue))
      )
    ) {
      group.forEach((alias) => aliases.add(alias));
    }
  });

  return aliases;
}

function ingredientMatches(confirmedIngredient: string, dishIngredient: string) {
  const confirmedAliases = expandIngredientAliases(confirmedIngredient);
  const dishAliases = expandIngredientAliases(dishIngredient);

  for (const confirmedAlias of confirmedAliases) {
    for (const dishAlias of dishAliases) {
      if (
        confirmedAlias === dishAlias ||
        (confirmedAlias.length > 3 && dishAlias.includes(confirmedAlias)) ||
        (dishAlias.length > 3 && confirmedAlias.includes(dishAlias))
      ) {
        return true;
      }
    }
  }

  return false;
}

function textMentionsIngredient(text: string, ingredient: string) {
  const normalizedText = normalizeName(text);
  const aliases = expandIngredientAliases(ingredient);

  for (const alias of aliases) {
    if (alias.length > 2 && normalizedText.includes(alias)) {
      return true;
    }
  }

  return false;
}

function getRequiredScanMatchCount(confirmedIngredientCount: number) {
  if (confirmedIngredientCount >= 3) {
    return 2;
  }

  return 1;
}

function sanitizeSuggestionAgainstScan(
  suggestion: DishSuggestion,
  confirmedIngredients: string[]
): DishSuggestion | null {
  const normalizedConfirmedIngredients = Array.from(
    new Set(confirmedIngredients.map((ingredient) => ingredient.trim()).filter(Boolean))
  );
  const searchableSuggestionText = [
    suggestion.name,
    suggestion.summary,
    suggestion.cuisine,
    ...suggestion.reasons
  ].join(" ");
  const matchedIngredients = normalizedConfirmedIngredients.filter(
    (confirmedIngredient) =>
      suggestion.matchedIngredients.some((matchedIngredient) =>
        ingredientMatches(confirmedIngredient, matchedIngredient)
      ) || textMentionsIngredient(searchableSuggestionText, confirmedIngredient)
  );
  const requiredMatchCount = getRequiredScanMatchCount(normalizedConfirmedIngredients.length);

  if (matchedIngredients.length < requiredMatchCount) {
    return null;
  }

  const missingIngredients = suggestion.missingIngredients.filter(
    (missingIngredient) =>
      !normalizedConfirmedIngredients.some((confirmedIngredient) =>
        ingredientMatches(confirmedIngredient, missingIngredient)
      )
  );
  const recalculatedMatchScore = Math.min(
    1,
    Math.max(
      0.35,
      Number((matchedIngredients.length / Math.max(1, normalizedConfirmedIngredients.length)).toFixed(2))
    )
  );

  return {
    ...suggestion,
    matchedIngredients,
    missingIngredients,
    matchScore: Math.min(suggestion.matchScore, recalculatedMatchScore),
    reasons: [
      `Món này được giữ lại vì dùng trực tiếp: ${matchedIngredients.join(", ")}.`,
      ...suggestion.reasons
    ]
  };
}

function sanitizeSuggestionsAgainstScan(
  suggestions: DishSuggestion[],
  confirmedIngredients: string[],
  limit: number
) {
  const uniqueSuggestions = new Map<string, DishSuggestion>();

  suggestions.forEach((suggestion) => {
    const sanitized = sanitizeSuggestionAgainstScan(suggestion, confirmedIngredients);

    if (!sanitized) {
      console.warn(
        `[Suggest Dishes] Dropped unrelated suggestion "${suggestion.name}" for scan ingredients: ${confirmedIngredients.join(", ")}`
      );
      return;
    }

    uniqueSuggestions.set(normalizeName(sanitized.name), sanitized);
  });

  return Array.from(uniqueSuggestions.values())
    .sort((left, right) => right.matchedIngredients.length - left.matchedIngredients.length)
    .slice(0, limit);
}

function buildReasons(
  matchedIngredients: string[],
  missingIngredients: string[],
  optionalHits: string[],
  dish: DishIndexEntry
) {
  const reasons: string[] = [];

  if (matchedIngredients.length > 0) {
    reasons.push(`Matches key ingredients: ${matchedIngredients.join(", ")}.`);
  }

  if (optionalHits.length > 0) {
    reasons.push(`Also aligns with optional ingredients: ${optionalHits.join(", ")}.`);
  }

  if (missingIngredients.length === 0) {
    reasons.push("You already have all required core ingredients for this dish.");
  } else {
    reasons.push(`You only need ${missingIngredients.join(", ")} to complete the core set.`);
  }

  reasons.push(`This is a ${dish.difficulty} dish that takes about ${dish.estimatedTimeMinutes} minutes.`);

  return reasons;
}

function buildMockSuggestions(
  confirmedIngredients: string[],
  limit = 4
): SuggestDishesResult {
  const normalizedIngredients = Array.from(
    new Set(confirmedIngredients.map((ingredient) => ingredient.trim()).filter(Boolean))
  );

  const rankedSuggestions = dishIndex
    .map((dish) => {
      const matchedIngredients = dish.requiredIngredients.filter((ingredient) =>
        normalizedIngredients.some((confirmedIngredient) =>
          ingredientMatches(confirmedIngredient, ingredient)
        )
      );
      const missingIngredients = dish.requiredIngredients.filter(
        (ingredient) =>
          !normalizedIngredients.some((confirmedIngredient) =>
            ingredientMatches(confirmedIngredient, ingredient)
          )
      );
      const optionalHits = dish.optionalIngredients.filter((ingredient) =>
        normalizedIngredients.some((confirmedIngredient) =>
          ingredientMatches(confirmedIngredient, ingredient)
        )
      );
      const baseScore = matchedIngredients.length / dish.requiredIngredients.length;
      const optionalBoost =
        dish.optionalIngredients.length > 0
          ? optionalHits.length / dish.optionalIngredients.length / 10
          : 0;
      const matchScore = Math.min(1, Number((baseScore + optionalBoost).toFixed(2)));

      return {
        id: dish.id,
        name: dish.name,
        cuisine: dish.cuisine,
        summary: dish.summary,
        matchScore,
        estimatedTimeMinutes: dish.estimatedTimeMinutes,
        difficulty: dish.difficulty,
        matchedIngredients,
        missingIngredients,
        reasons: buildReasons(matchedIngredients, missingIngredients, optionalHits, dish)
      } satisfies DishSuggestion;
    })
    .sort((left, right) => right.matchScore - left.matchScore);

  const suggestions = sanitizeSuggestionsAgainstScan(
    rankedSuggestions.filter((item) => item.matchScore > 0),
    normalizedIngredients,
    limit
  );

  return {
    suggestions:
      suggestions.length > 0
        ? suggestions
        : buildIngredientDrivenFallbackSuggestions(normalizedIngredients, limit),
    fallbackUsed: true,
    model: "gemma-mock-wrapper",
    ingredientCount: normalizedIngredients.length
  };
}

function buildIngredientDrivenFallbackSuggestions(
  confirmedIngredients: string[],
  limit: number
): DishSuggestion[] {
  const visibleIngredients = confirmedIngredients.slice(0, 4);
  const primaryIngredient = visibleIngredients[0] ?? "nguyên liệu đã quét";
  const secondaryIngredient = visibleIngredients[1] ?? "rau củ";

  const dynamicSuggestions: DishSuggestion[] = [
    {
      id: "dish-dynamic-stir-fry",
      name: `Món xào ${primaryIngredient}`,
      cuisine: "Món gia đình",
      summary: `Gợi ý món xào nhanh dựa trên nguyên liệu đã nhận diện: ${visibleIngredients.join(", ")}.`,
      matchScore: 0.45,
      estimatedTimeMinutes: 20,
      difficulty: "easy",
      matchedIngredients: visibleIngredients,
      missingIngredients: ["gia vị cơ bản"],
      reasons: ["Món này được tạo dựa trên các nguyên liệu scan được, không phải món mặc định."]
    },
    {
      id: "dish-dynamic-soup",
      name: `Canh ${primaryIngredient}`,
      cuisine: "Món Việt",
      summary: `Một món canh đơn giản có thể tận dụng ${primaryIngredient} và ${secondaryIngredient}.`,
      matchScore: 0.4,
      estimatedTimeMinutes: 25,
      difficulty: "easy",
      matchedIngredients: visibleIngredients,
      missingIngredients: ["nước dùng hoặc gia vị nêm"],
      reasons: ["Gợi ý ưu tiên tận dụng nguyên liệu hiện có sau khi quét ảnh."]
    },
    {
      id: "dish-dynamic-rice-bowl",
      name: `Cơm ăn kèm ${primaryIngredient}`,
      cuisine: "Món nhanh",
      summary: `Một phần cơm đơn giản ăn cùng ${visibleIngredients.join(", ")} và gia vị có sẵn.`,
      matchScore: 0.38,
      estimatedTimeMinutes: 18,
      difficulty: "easy",
      matchedIngredients: visibleIngredients,
      missingIngredients: ["cơm hoặc gạo"],
      reasons: ["Gợi ý được sinh từ nguyên liệu scan, phù hợp khi không khớp món mẫu."]
    }
  ];

  return dynamicSuggestions.slice(0, limit);
}

function getGeminiText(data: GeminiResponse) {
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

function extractJsonObject(text: string) {
  let cleaned = text.trim();

  if (cleaned.includes("```")) {
    cleaned = cleaned.split("```")[1]?.replace(/^json/i, "").trim() ?? cleaned;
  }

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}") + 1;

  if (start < 0 || end <= start) {
    throw new Error("Gemini suggest dishes did not return a JSON object.");
  }

  return cleaned.slice(start, end);
}

function createDynamicDishId(name: string, index: number) {
  const slug = normalizeName(name).replace(/\s+/g, "-").slice(0, 48);
  return `dish-ai-${slug || index + 1}`;
}

function buildGeminiSuggestPrompt(confirmedIngredients: string[], limit: number) {
  return `
Bạn là đầu bếp Việt Nam cho website Nấu Smart Grocery.

Nguyên liệu người dùng vừa scan được:
${confirmedIngredients.map((ingredient) => `- ${ingredient}`).join("\n")}

Hãy gợi ý đúng ${limit} món có thể nấu dựa trên chính các nguyên liệu này.

YÊU CẦU QUAN TRỌNG:
- Mỗi món bắt buộc phải dùng trực tiếp ít nhất ${getRequiredScanMatchCount(confirmedIngredients.length)} nguyên liệu trong danh sách scan làm nguyên liệu chính hoặc thành phần nổi bật.
- Không được gợi ý món chỉ vì đó là món phổ biến nếu món đó không dùng nguyên liệu scan.
- Không được đưa nguyên liệu không có trong ảnh vào matchedIngredients.
- Nếu cần thêm nguyên liệu ngoài ảnh, chỉ đưa vào missingIngredients và không đặt tên món xoay quanh nguyên liệu đang thiếu.
- Ví dụ: nếu scan có "chả lụa, dưa leo, rau răm, tương ớt" thì món phù hợp là "gỏi chả lụa dưa leo", "bánh mì chả lụa dưa leo", không phải "rau muống xào tỏi".
- Không dùng danh sách món mặc định.
- Không lặp lại cùng một món.
- Ưu tiên món Việt Nam hoặc món gia đình Việt dễ nấu.
- Tên món, mô tả, lý do, nguyên liệu thiếu phải bằng tiếng Việt.
- matchedIngredients chỉ gồm nguyên liệu có trong danh sách scan.
- missingIngredients chỉ gồm nguyên liệu cần mua thêm nếu thiếu.
- matchScore từ 0 đến 1, càng dùng được nhiều nguyên liệu scan thì càng cao.
- difficulty chỉ được là "easy", "medium", hoặc "advanced".
- estimatedTimeMinutes là số phút nấu thực tế.
- Chỉ trả về JSON, không markdown, không giải thích ngoài JSON.

JSON schema:
{
  "suggestions": [
    {
      "id": "string",
      "name": "string",
      "cuisine": "string",
      "summary": "string",
      "matchScore": 0.85,
      "estimatedTimeMinutes": 30,
      "difficulty": "easy",
      "matchedIngredients": ["string"],
      "missingIngredients": ["string"],
      "reasons": ["string"]
    }
  ]
}
`;
}

async function suggestDishesWithGemini(
  confirmedIngredients: string[],
  limit: number
): Promise<SuggestDishesResult> {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY.");
  }

  // GEMMA SERVICE WRAPPER: dish suggestion and recipe reasoning
  // Hosted Gemini is used here as the mockable reasoning backend until a Gemma service is available.
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: buildGeminiSuggestPrompt(confirmedIngredients, limit)
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.35
        }
      }),
      cache: "no-store"
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Gemini suggest dishes request failed with status ${response.status}: ${responseText}`
    );
  }

  const parsedResponse = JSON.parse(responseText) as GeminiResponse;
  const jsonText = extractJsonObject(getGeminiText(parsedResponse));
  const payload = gemmaSuggestResponseSchema.parse(JSON.parse(jsonText));
  const suggestions = sanitizeSuggestionsAgainstScan(
    payload.suggestions.map((suggestion, index) => ({
      ...suggestion,
      id: suggestion.id?.trim() ? suggestion.id : createDynamicDishId(suggestion.name, index),
      matchScore: Math.min(1, Math.max(0, Number(suggestion.matchScore.toFixed(2))))
    })),
    confirmedIngredients,
    limit
  );

  if (suggestions.length === 0) {
    throw new Error("Gemini returned an empty dish suggestion list.");
  }

  return {
    suggestions,
    fallbackUsed: false,
    model: `gemini:${GEMINI_MODEL}`,
    ingredientCount: confirmedIngredients.length
  };
}

export async function suggestDishesWithGemma(
  confirmedIngredients: string[],
  limit = 4
): Promise<SuggestDishesResult> {
  if (GEMMA_SERVICE_URL) {
    try {
      // GEMMA SERVICE WRAPPER: dish suggestion and recipe reasoning
      const response = await fetch(`${GEMMA_SERVICE_URL.replace(/\/$/, "")}/suggest-dishes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          confirmedIngredients,
          limit
        }),
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`Gemma suggest dishes request failed with status ${response.status}`);
      }

      const payload = gemmaSuggestResponseSchema.parse((await response.json()) as unknown);

      return {
        suggestions: payload.suggestions,
        fallbackUsed: false,
        model: "gemma-service-wrapper",
        ingredientCount: confirmedIngredients.length
      };
    } catch (error) {
      console.warn("Gemma suggest dishes failed; falling back to Gemini/local mock.", error);
    }
  }

  if (GEMINI_API_KEY) {
    try {
      return await suggestDishesWithGemini(confirmedIngredients, limit);
    } catch (error) {
      console.warn("Gemini suggest dishes failed; falling back to local mock.", error);
    }
  }

  return buildMockSuggestions(confirmedIngredients, limit);
}
