import { z } from "zod";

import type {
  DetectedIngredient,
  Ingredient,
  ScanInputSource,
  ScanResult
} from "@/types";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

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

function toDisplayName(normalizedName: string) {
  return normalizedName
    .split(" ")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
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

function buildRequestBody(input: GeminiScanInput) {
  const prompt = [
    "Detect only clearly visible cooking ingredients in this image.",
    "Return JSON only.",
    'Use the exact shape: {"ingredientsDetected":[{"name":"tomato","confidence":0.94,"category":"vegetable"}]}.',
    "Ingredient names must be lowercase singular nouns when possible.",
    "Confidence must be a number from 0 to 1.",
    "Category should be a short food category like vegetable, protein, herb, fruit, grain, dairy, spice, or aromatic.",
    "Ignore cookware, utensils, logos, labels, packaging text, and non-food objects.",
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

async function requestGeminiScan(input: GeminiScanInput, apiKey: string) {
  const requestBody = buildRequestBody(input);

  // GEMINI API INTEGRATION: image understanding for ingredient detection
  const response = await fetch(
    `${GEMINI_API_URL}/models/${DEFAULT_GEMINI_MODEL}:generateContent`,
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
      status: response.status,
      responseText
    };
  }

  return {
    ok: true as const,
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
    const result = await requestGeminiScan(input, apiKey);

    if (!result.ok) {
      return createFallbackScanResult(
        input,
        `Gemini request failed with status ${result.status}. Using safe structured fallback response.`
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

    const ingredientsDetected = parsed.data.ingredientsDetected.map((ingredient) => ({
      name: normalizeIngredientName(ingredient.name),
      confidence: ingredient.confidence,
      category: ingredient.category.trim().toLowerCase()
    }));

    return {
      ingredients: toAppIngredients(ingredientsDetected),
      ingredientsDetected,
      model: DEFAULT_GEMINI_MODEL,
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
