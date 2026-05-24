import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { defaultLocale, translations } from "@/lib/i18n/translations";
import { mapIngredientInputsToCart } from "@/lib/services/catalogMapper";
import { cartAddRequestSchema } from "@/lib/validations/cart-add";
import type { CartAddResponse } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let locale = defaultLocale;

  try {
    const body = await request.json();
    const parsed = cartAddRequestSchema.parse(body);
    locale = parsed.locale ?? defaultLocale;
    const mapped = mapIngredientInputsToCart(parsed.ingredients);

    const response: Extract<CartAddResponse, { success: true }> = {
      success: true,
      data: mapped
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CART_ADD_REQUEST",
            message: translations[locale].api.invalidCartAdd
          }
        } satisfies Extract<CartAddResponse, { success: false }>,
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CART_ADD_FAILED",
          message: translations[locale].api.cartAddFailed
        }
      } satisfies Extract<CartAddResponse, { success: false }>,
      { status: 500 }
    );
  }
}
