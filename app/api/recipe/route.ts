import { NextRequest, NextResponse } from "next/server";

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

function getGeminiText(data: GeminiResponse) {
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

function extractJsonObject(text: string) {
  let cleaned = text.trim();

  if (cleaned.includes("```")) {
    cleaned = cleaned.split("```")[1]?.replace(/^json/i, "").trim() ?? cleaned;
  }

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}") + 1;

  if (start < 0 || end <= start) {
    throw new Error("Gemini did not return a JSON object.");
  }

  return cleaned.slice(start, end);
}

async function callGemini(prompt: string) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!API_KEY) {
    throw new Error("Missing GEMINI_API_KEY.");
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = (await res.json()) as GeminiResponse;

  if (!res.ok) {
    throw new Error(`Gemini request failed with status ${res.status}: ${JSON.stringify(data)}`);
  }

  return getGeminiText(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode } = body;

    if (mode === "suggest") {
      const ingredients = Array.isArray(body.ingredients) ? body.ingredients : [];
      const prompt = `
Nguyên liệu: ${ingredients.join(", ")}

Gợi ý CHÍNH XÁC 3 món ăn Việt Nam.

YÊU CẦU:
- Chỉ tên món
- Mỗi dòng 1 món
- Không giải thích
`;

      const text = await callGemini(prompt);
      const dishes = text
        .split("\n")
        .map((dish: string) => dish.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean)
        .slice(0, 3);

      return NextResponse.json({ dishes });
    }

    if (mode === "recipe") {
      const allergies = Array.isArray(body.allergies) ? body.allergies : [];
      const prompt = `
Món ăn: ${body.dish}
Số người: ${body.servings}
Dị ứng cần tránh: ${allergies.length > 0 ? allergies.join(", ") : "không có"}

Hãy tạo công thức trước, sau đó kiểm tra dị ứng trên chính danh sách nguyên liệu đã tạo.

Nếu món ăn có nguy cơ chứa nguyên liệu dị ứng, vẫn trả về danh sách nguyên liệu và các bước nấu,
nhưng đánh dấu món không an toàn để giao diện cho người dùng tự quyết định xoá nguyên liệu xung đột
hoặc vẫn xác nhận thêm danh sách vào giỏ.

Nếu món ăn có nguy cơ chứa nguyên liệu dị ứng, trả về JSON dạng:
{
  "isSafe": false,
  "dish": "${body.dish}",
  "servings": ${body.servings},
  "allergyWarnings": ["..."],
  "conflictingIngredients": ["..."],
  "saferAlternatives": ["...", "...", "..."],
  "ingredients": [
    {
      "name": "",
      "amount": "",
      "alternatives": []
    }
  ],
  "steps": []
}

Nếu món ăn an toàn, trả về JSON dạng:
{
  "isSafe": true,
  "dish": "",
  "servings": number,
  "allergyWarnings": [],
  "conflictingIngredients": [],
  "saferAlternatives": [],
  "ingredients": [
    {
      "name": "",
      "amount": "",
      "alternatives": []
    }
  ],
  "steps": []
}

YÊU CẦU:
- CHỈ JSON
- KHÔNG markdown
- KHÔNG giải thích
- Nguyên liệu phải có định lượng phù hợp với số người ăn
- Nếu isSafe là false, vẫn phải có ingredients để người dùng có thể xoá nguyên liệu xung đột
- Không đưa nguyên liệu dị ứng vào công thức khi isSafe là true
`;

      const text = await callGemini(prompt);
      const jsonText = extractJsonObject(text);

      return NextResponse.json(JSON.parse(jsonText));
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Server crash",
        detail
      },
      { status: 500 }
    );
  }
}
