import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { mapIngredientInputsToCart } from "@/lib/services/catalogMapper";
import { cartAddRequestSchema } from "@/lib/validations/cart-add";
import type { CartAddResponse } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = cartAddRequestSchema.parse(body);
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
            message: "Provide at least one ingredient with name, quantity, and unit."
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
          message: "Unable to build cart items right now."
        }
      } satisfies Extract<CartAddResponse, { success: false }>,
      { status: 500 }
    );
  }
}
