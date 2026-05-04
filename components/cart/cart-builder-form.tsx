"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { CartIngredientInput } from "@/types";

interface CartBuilderFormProps {
  ingredients: CartIngredientInput[];
  onChange: (ingredients: CartIngredientInput[]) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

function emptyIngredient(): CartIngredientInput {
  return {
    name: "",
    normalizedName: "",
    quantity: 1,
    unit: "gói"
  };
}

export function CartBuilderForm({
  ingredients,
  onChange,
  onSubmit,
  isLoading
}: CartBuilderFormProps) {
  const updateIngredient = (
    index: number,
    patch: Partial<CartIngredientInput>
  ) => {
    onChange(
      ingredients.map((ingredient, currentIndex) => {
        if (currentIndex !== index) {
          return ingredient;
        }

        const next = {
          ...ingredient,
          ...patch
        };

        if ("name" in patch && typeof patch.name === "string") {
          next.normalizedName = patch.name.trim().toLowerCase();
        }

        return next;
      })
    );
  };

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, currentIndex) => currentIndex !== index));
  };

  const addIngredient = () => {
    onChange([...ingredients, emptyIngredient()]);
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Tạo giỏ hàng từ nguyên liệu</h2>
          <p className="text-sm text-[var(--color-ink-soft)]">
            Nhập nguyên liệu bếp và map chúng một cách deterministic sang sản phẩm trong catalog.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={addIngredient}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm dòng
        </Button>
      </div>

      <div className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <div key={`${ingredient.name}-${index}`} className="rounded-2xl bg-[var(--color-muted)] p-3">
            <div className="grid gap-3 sm:grid-cols-[1.4fr_0.7fr_0.7fr_auto]">
              <Input
                value={ingredient.name}
                onChange={(event) => updateIngredient(index, { name: event.target.value })}
                placeholder="Tên nguyên liệu"
                className="bg-white"
              />
              <Input
                type="number"
                min={0.1}
                step={0.1}
                value={ingredient.quantity}
                onChange={(event) =>
                  updateIngredient(index, {
                    quantity: Number(event.target.value) || 0.1
                  })
                }
                className="bg-white"
              />
              <Input
                value={ingredient.unit}
                onChange={(event) => updateIngredient(index, { unit: event.target.value })}
                placeholder="đơn vị"
                className="bg-white"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeIngredient(index)}
                aria-label="Xóa dòng nguyên liệu"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={onSubmit}
        disabled={
          isLoading ||
          ingredients.length === 0 ||
          ingredients.some(
            (ingredient) =>
              !ingredient.name.trim() || !ingredient.unit.trim() || ingredient.quantity <= 0
          )
        }
        className="w-full"
      >
        {isLoading ? "Đang map nguyên liệu..." : "Map nguyên liệu sang sản phẩm trong giỏ"}
      </Button>
    </Card>
  );
}
