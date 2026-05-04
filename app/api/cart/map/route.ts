import { NextResponse } from "next/server";

import { mapRecipeIngredientsToCart } from "@/lib/services/catalogMapper";
import { mapCartSchema } from "@/lib/validations/cart";
import type { MapCartResponse } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = mapCartSchema.parse(body);
    const mapped = mapRecipeIngredientsToCart(parsed.recipeIngredients);

    const response: MapCartResponse = {
      success: true,
      data: mapped
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to map ingredients into grocery items"
      },
      { status: 400 }
    );
  }
}
