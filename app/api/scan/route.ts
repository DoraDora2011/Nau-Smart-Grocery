import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { scanIngredientsWithGemini } from "@/lib/ai/geminiScan";
import { scanMetadataSchema } from "@/lib/validations/scan";
import type { ScanRouteResponse } from "@/types";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");
    const source = formData.get("source");

    const parsedMetadata = scanMetadataSchema.parse({
      source
    });

    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "MISSING_IMAGE",
            message: "An image file is required for ingredient scanning."
          }
        },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_IMAGE_TYPE",
            message: "Only image uploads are supported for ingredient scanning."
          }
        },
        { status: 400 }
      );
    }

    if (image.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "IMAGE_TOO_LARGE",
            message: "Please upload an image smaller than 10MB."
          }
        },
        { status: 400 }
      );
    }

    // GEMINI API INTEGRATION: image understanding for ingredient detection
    const result = await scanIngredientsWithGemini({
      fileName: image.name,
      mimeType: image.type,
      source: parsedMetadata.source,
      imageBytes: await image.arrayBuffer()
    });

    const response: Extract<ScanRouteResponse, { success: true }> = {
      success: true,
      data: result
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_SCAN_REQUEST",
            message: "The scan request payload is invalid."
          }
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SCAN_FAILED",
          message: "Unable to analyze the image right now."
        }
      },
      { status: 500 }
    );
  }
}
