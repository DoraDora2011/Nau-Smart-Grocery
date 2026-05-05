import { z } from "zod";

import type {
  DetectedIngredient,
  Ingredient,
  ScanInputSource,
  ScanResult
} from "@/types";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_SCAN_FALLBACK_MODELS = (
  process.env.GEMINI_SCAN_FALLBACK_MODELS || "gemini-flash-latest,gemini-2.5-flash-lite"
)
  .split(",")
  .map((model) => model.trim())
  .filter(Boolean);

const geminiIngredientSchema = z.object({
  ingredientsDetected: z.array(
    z.object({
      name: z.string().min(1),
      confidence: z.number().min(0).max(1),
      category: z.string().min(1)
    })
  )
});

export interface GeminiScanInput {
  fileName: string;
  mimeType: string;
  source: ScanInputSource;
  imageBytes: ArrayBuffer;
}

function normalizeIngredientName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeSearchName(name: string) {
  return normalizeIngredientName(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toDisplayName(normalizedName: string) {
  return normalizedName
    .split(" ")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function isCinnamonLike(name: string) {
  const normalized = normalizeSearchName(name);

  return normalized === "cinnamon" || normalized === "que" || normalized.includes("cinnamon");
}

function isPorkLike(name: string) {
  const normalized = normalizeSearchName(name);

  return (
    normalized.includes("pork") ||
    normalized.includes("thit heo") ||
    normalized.includes("thit lon") ||
    normalized.includes("heo") ||
    normalized.includes("lon")
  );
}

function isPreparedPorkRollLike(name: string) {
  const normalized = normalizeSearchName(name);

  return (
    normalized.includes("cha que") ||
    normalized.includes("cha lua") ||
    normalized.includes("gio lua") ||
    normalized.includes("vietnamese pork roll") ||
    normalized.includes("cinnamon pork roll")
  );
}

const vietnameseFoodCanonicalNames: Array<{
  canonical: string;
  category: string;
  aliases: string[];
}> = [
  {
    canonical: "nem chua",
    category: "fermented_food",
    aliases: ["nem chua", "fermented pork", "fermented pork roll", "sour pork sausage"]
  },
  {
    canonical: "chả lụa",
    category: "prepared_food",
    aliases: ["cha lua", "chả lụa", "gio lua", "giò lụa", "pork roll", "vietnamese pork roll"]
  },
  {
    canonical: "chả quế",
    category: "prepared_food",
    aliases: ["cha que", "chả quế", "cinnamon pork roll", "vietnamese cinnamon pork roll"]
  },
  {
    canonical: "giò sống",
    category: "prepared_food",
    aliases: ["gio song", "giò sống", "raw pork paste", "pork paste"]
  },
  {
    canonical: "chả cá",
    category: "prepared_food",
    aliases: ["cha ca", "chả cá", "fish cake", "vietnamese fish cake"]
  },
  {
    canonical: "bò viên",
    category: "prepared_food",
    aliases: ["bo vien", "bò viên", "beef ball", "beef balls"]
  },
  {
    canonical: "cá viên",
    category: "prepared_food",
    aliases: ["ca vien", "cá viên", "fish ball", "fish balls"]
  },
  {
    canonical: "đậu hũ",
    category: "protein",
    aliases: ["dau hu", "đậu hũ", "dau phu", "đậu phụ", "tofu"]
  },
  {
    canonical: "tàu hũ ky",
    category: "protein",
    aliases: ["tau hu ky", "tàu hũ ky", "tofu skin", "bean curd skin"]
  },
  {
    canonical: "bánh tráng",
    category: "grain",
    aliases: ["banh trang", "bánh tráng", "rice paper", "rice paper wrapper"]
  },
  {
    canonical: "bánh phở",
    category: "noodle",
    aliases: ["banh pho", "bánh phở", "pho noodle", "rice noodle sheet"]
  },
  {
    canonical: "bún",
    category: "noodle",
    aliases: ["bun", "bún", "rice vermicelli", "vermicelli noodle"]
  },
  {
    canonical: "miến",
    category: "noodle",
    aliases: ["mien", "miến", "glass noodle", "cellophane noodle"]
  },
  {
    canonical: "bánh canh",
    category: "noodle",
    aliases: ["banh canh", "bánh canh", "thick tapioca noodle"]
  },
  {
    canonical: "mắm tôm",
    category: "sauce",
    aliases: ["mam tom", "mắm tôm", "shrimp paste"]
  },
  {
    canonical: "mắm ruốc",
    category: "sauce",
    aliases: ["mam ruoc", "mắm ruốc", "fermented shrimp paste"]
  },
  {
    canonical: "nước mắm",
    category: "sauce",
    aliases: ["nuoc mam", "nước mắm", "fish sauce"]
  },
  {
    canonical: "tương ớt",
    category: "sauce",
    aliases: ["tuong ot", "tương ớt", "chili sauce"]
  },
  {
    canonical: "dưa cải chua",
    category: "fermented_food",
    aliases: ["dua cai chua", "dưa cải chua", "pickled mustard greens"]
  },
  {
    canonical: "đồ chua",
    category: "fermented_food",
    aliases: ["do chua", "đồ chua", "vietnamese pickles", "pickled carrot and daikon"]
  },
  {
    canonical: "củ kiệu",
    category: "fermented_food",
    aliases: ["cu kieu", "củ kiệu", "pickled scallion head", "pickled leek"]
  },
  {
    canonical: "rau răm",
    category: "herb",
    aliases: ["rau ram", "rau răm", "vietnamese coriander"]
  },
  {
    canonical: "tía tô",
    category: "herb",
    aliases: ["tia to", "tía tô", "perilla", "shiso"]
  },
  {
    canonical: "kinh giới",
    category: "herb",
    aliases: ["kinh gioi", "kinh giới", "vietnamese balm"]
  },
  {
    canonical: "ngò gai",
    category: "herb",
    aliases: ["ngo gai", "ngò gai", "sawtooth coriander", "culantro"]
  },
  {
    canonical: "bạc hà",
    category: "vegetable",
    aliases: ["bac ha", "bạc hà", "doc mung", "dọc mùng", "elephant ear stem", "taro stem"]
  },
  {
    canonical: "giá đỗ",
    category: "vegetable",
    aliases: ["gia do", "giá đỗ", "bean sprout", "bean sprouts"]
  },
  {
    canonical: "đậu bắp",
    category: "vegetable",
    aliases: ["dau bap", "đậu bắp", "okra"]
  },
  {
    canonical: "khổ qua",
    category: "vegetable",
    aliases: ["kho qua", "khổ qua", "bitter melon"]
  },
  {
    canonical: "thơm",
    category: "fruit",
    aliases: ["thom", "thơm", "dua", "dứa", "pineapple"]
  },
  {
    canonical: "sả",
    category: "aromatic",
    aliases: ["sa", "sả", "lemongrass"]
  },
  {
    canonical: "riềng",
    category: "aromatic",
    aliases: ["rieng", "riềng", "galangal"]
  },
  {
    canonical: "nghệ",
    category: "aromatic",
    aliases: ["nghe", "nghệ", "turmeric"]
  },
  {
    canonical: "me vắt",
    category: "spice",
    aliases: ["me vat", "me vắt", "tamarind pulp", "tamarind paste"]
  }
];

function canonicalizeVietnameseFood(item: DetectedIngredient): DetectedIngredient {
  const normalizedName = normalizeSearchName(item.name);
  const match = vietnameseFoodCanonicalNames.find((entry) =>
    entry.aliases.some((alias) => {
      const normalizedAlias = normalizeSearchName(alias);

      return (
        normalizedName === normalizedAlias ||
        (normalizedAlias.length > 3 && normalizedName.includes(normalizedAlias)) ||
        (normalizedName.length > 3 && normalizedAlias.includes(normalizedName))
      );
    })
  );

  if (!match) {
    return item;
  }

  return {
    ...item,
    name: match.canonical,
    category: match.category
  };
}

function applyVietnamesePreparedFoodCorrections(items: DetectedIngredient[]) {
  const canonicalItems = items.map(canonicalizeVietnameseFood);
  const hasCinnamon = canonicalItems.some((item) => isCinnamonLike(item.name));
  const hasPork = canonicalItems.some((item) => isPorkLike(item.name));
  const hasPreparedPorkRoll = canonicalItems.some((item) => isPreparedPorkRollLike(item.name));

  if (!hasCinnamon || !hasPork || hasPreparedPorkRoll) {
    return canonicalItems;
  }

  const correctedItems = canonicalItems.filter((item) => !isCinnamonLike(item.name));
  const porkConfidence =
    canonicalItems.find((item) => isPorkLike(item.name))?.confidence ??
    canonicalItems.find((item) => isCinnamonLike(item.name))?.confidence ??
    0.78;

  correctedItems.push({
    name: "chả quế",
    confidence: Math.min(0.94, Math.max(0.72, porkConfidence)),
    category: "prepared_food"
  });

  return correctedItems;
}

function toAppIngredients(items: DetectedIngredient[]): Ingredient[] {
  const unique = new Map<string, Ingredient>();

  items.forEach((item, index) => {
    const normalizedName = normalizeIngredientName(item.name);

    if (!normalizedName || unique.has(normalizedName)) {
      return;
    }

    unique.set(normalizedName, {
      id: `scan-${index + 1}`,
      name: toDisplayName(normalizedName),
      normalizedName,
      source: "scan",
      confidence: item.confidence,
      category: item.category
    });
  });

  return Array.from(unique.values());
}

function buildFallbackIngredients(): DetectedIngredient[] {
  return [
    { name: "tomato", confidence: 0.97, category: "vegetable" },
    { name: "garlic", confidence: 0.92, category: "aromatic" },
    { name: "egg", confidence: 0.88, category: "protein" }
  ];
}

function createFallbackScanResult(input: GeminiScanInput, reason: string): ScanResult {
  const ingredientsDetected = buildFallbackIngredients();

  return {
    ingredients: toAppIngredients(ingredientsDetected),
    ingredientsDetected,
    model: "gemini-safe-fallback",
    warnings: [reason],
    fallbackUsed: true,
    input: {
      fileName: input.fileName,
      mimeType: input.mimeType,
      source: input.source
    }
  };
}

function extractCandidateText(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidates = (
    payload as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    }
  ).candidates;

  return (
    candidates?.[0]?.content?.parts
      ?.map((part) => (typeof part.text === "string" ? part.text : ""))
      .join("")
      .trim() || null
  );
}

function getScanModelCandidates() {
  return Array.from(new Set([DEFAULT_GEMINI_MODEL, ...GEMINI_SCAN_FALLBACK_MODELS]));
}

function shouldTryNextModel(status: number) {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

function buildRequestBody(input: GeminiScanInput) {
  const prompt = [
    "You are a Vietnamese grocery and home-cooking vision model.",
    "Detect clearly visible cooking ingredients, market foods, Vietnamese prepared ingredients, and recognizable packaged food items in this image.",
    "Return JSON only.",
    'Use the exact shape: {"ingredientsDetected":[{"name":"cà chua","confidence":0.94,"category":"vegetable"}]}.',
    "Use Vietnamese ingredient names when the item is common in Vietnam. Use lowercase names.",
    "Confidence must be a number from 0 to 1.",
    "Category should be a short food category like vegetable, protein, herb, fruit, grain, dairy, spice, aromatic, noodle, sauce, fermented_food, prepared_food, or packaged_food.",
    "Important: if a culturally specific Vietnamese food is recognizable, include the full item name, not only its visible components.",
    "Examples of Vietnamese-specific items to recognize when visible: nem chua, chả lụa, chả quế, giò sống, chả cá, bò viên, cá viên, đậu hũ, tàu hũ ky, bún, phở, mì, miến, bánh tráng, bánh phở, bánh canh, bột chiên, mắm tôm, mắm ruốc, nước mắm, tương ớt, dưa cải chua, củ kiệu, đồ chua, rau răm, tía tô, kinh giới, húng quế, ngò gai, bạc hà/dọc mùng, giá đỗ, bông điên điển, rau muống, cải thìa, khổ qua, đậu bắp, thơm/dứa, sả, riềng, nghệ, me vắt.",
    "Never translate chả quế into cinnamon. Chả quế is a Vietnamese prepared pork roll/sausage and must be output as chả quế with category prepared_food.",
    "Only output cinnamon/quế when a cinnamon stick, cinnamon powder, or spice package is clearly visible. Do not label a brown cooked pork roll, sausage, loaf, or chả as cinnamon.",
    "For prepared Vietnamese foods such as nem chua, output both the full food item and clearly visible add-ons if present, for example nem chua, tỏi, ớt, lá chuối.",
    "For packaged food, you may use readable label text to identify the food type, but do not output brand names, logos, nutrition text, or marketing words.",
    "Do not invent hidden ingredients. Only include known internal ingredients when the full prepared food is visually or textually recognizable.",
    "Ignore cookware, utensils, plates, hands, table surfaces, and non-food objects.",
    "Prefer 3 to 12 useful grocery/cooking items. Avoid duplicates and overly generic names like food, meat, vegetable, or package when a specific Vietnamese name is possible.",
    "If nothing is clearly identifiable, return an empty ingredientsDetected array."
  ].join(" ");

  return {
    contents: [
      {
        parts: [
          {
            text: prompt
          },
          {
            inline_data: {
              mime_type: input.mimeType,
              data: Buffer.from(input.imageBytes).toString("base64")
            }
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
      candidateCount: 1,
      responseJsonSchema: {
        type: "object",
        properties: {
          ingredientsDetected: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                confidence: { type: "number" },
                category: { type: "string" }
              },
              required: ["name", "confidence", "category"]
            }
          }
        },
        required: ["ingredientsDetected"]
      }
    }
  };
}

async function requestGeminiScan(input: GeminiScanInput, apiKey: string, model: string) {
  const requestBody = buildRequestBody(input);

  // GEMINI API INTEGRATION: image understanding for ingredient detection
  const response = await fetch(
    `${GEMINI_API_URL}/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify(requestBody),
      cache: "no-store"
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    console.error("[Gemini Scan] Response status:", response.status, response.statusText);
    console.error("[Gemini Scan] Response body:", responseText);

    return {
      ok: false as const,
      model,
      status: response.status,
      responseText
    };
  }

  return {
    ok: true as const,
    model,
    responseText
  };
}

export async function scanIngredientsWithGemini(
  input: GeminiScanInput
): Promise<ScanResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return createFallbackScanResult(
      input,
      "Gemini is not configured, so a safe structured fallback ingredient result was returned."
    );
  }

  try {
    let result: Awaited<ReturnType<typeof requestGeminiScan>> | null = null;

    for (const model of getScanModelCandidates()) {
      result = await requestGeminiScan(input, apiKey, model);

      if (result.ok) {
        break;
      }

      if (!shouldTryNextModel(result.status)) {
        break;
      }

      console.warn(
        `[Gemini Scan] Model ${model} failed with status ${result.status}. Trying next scan model if available.`
      );
    }

    if (!result) {
      return createFallbackScanResult(
        input,
        "Gemini scan could not start. Using safe structured fallback response."
      );
    }

    if (!result.ok) {
      return createFallbackScanResult(
        input,
        `Gemini request failed with status ${result.status} on ${result.model}. Using safe structured fallback response.`
      );
    }

    let payload: unknown;

    try {
      payload = JSON.parse(result.responseText);
    } catch (error) {
      console.error("[Gemini Scan] Could not parse Gemini response JSON:", result.responseText);
      console.error(error);

      return createFallbackScanResult(
        input,
        "Gemini returned an unreadable response payload. Using safe structured fallback response."
      );
    }

    const candidateText = extractCandidateText(payload);

    if (!candidateText) {
      console.error("[Gemini Scan] Missing candidate text payload:", result.responseText);

      return createFallbackScanResult(
        input,
        "Gemini returned no structured candidate text. Using safe structured fallback response."
      );
    }

    let candidateJson: unknown;

    try {
      candidateJson = JSON.parse(candidateText);
    } catch (error) {
      console.error("[Gemini Scan] Candidate text was not valid JSON:", candidateText);
      console.error(error);

      return createFallbackScanResult(
        input,
        "Gemini candidate text was not valid JSON. Using safe structured fallback response."
      );
    }

    const parsed = geminiIngredientSchema.safeParse(candidateJson);

    if (!parsed.success) {
      console.error("[Gemini Scan] Candidate JSON did not match schema:", parsed.error.flatten());
      console.error("[Gemini Scan] Candidate JSON payload:", candidateJson);

      return createFallbackScanResult(
        input,
        "Gemini returned JSON in an unexpected shape. Using safe structured fallback response."
      );
    }

    const ingredientsDetected = applyVietnamesePreparedFoodCorrections(
      parsed.data.ingredientsDetected.map((ingredient) => ({
        name: normalizeIngredientName(ingredient.name),
        confidence: ingredient.confidence,
        category: ingredient.category.trim().toLowerCase()
      }))
    );

    return {
      ingredients: toAppIngredients(ingredientsDetected),
      ingredientsDetected,
      model: result.model,
      warnings:
        ingredientsDetected.length === 0
          ? ["No clear ingredients were detected in the image."]
          : [],
      fallbackUsed: false,
      input: {
        fileName: input.fileName,
        mimeType: input.mimeType,
        source: input.source
      }
    };
  } catch (error) {
    console.error("[Gemini Scan] Unexpected runtime failure:", error);

    return createFallbackScanResult(
      input,
      "Gemini scan encountered an unexpected error. Using safe structured fallback response."
    );
  }
}
