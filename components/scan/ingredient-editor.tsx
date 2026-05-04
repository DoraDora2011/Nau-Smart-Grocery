"use client";

import { CheckCircle2, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLocalizedIngredientName } from "@/lib/i18n/ingredient-names";
import type { Locale } from "@/lib/i18n/translations";
import type { Ingredient } from "@/types";

interface IngredientEditorProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
  onConfirm: () => void;
  isLoading: boolean;
  locale: Locale;
}

export function IngredientEditor({
  ingredients,
  onChange,
  onConfirm,
  isLoading,
  locale,
}: IngredientEditorProps) {
  const updateIngredient = (id: string, name: string) => {
    onChange(
      ingredients.map((ingredient) =>
        ingredient.id === id
          ? {
              ...ingredient,
              name,
              normalizedName: name.trim().toLowerCase(),
            }
          : ingredient,
      ),
    );
  };

  const removeIngredient = (id: string) => {
    onChange(ingredients.filter((ingredient) => ingredient.id !== id));
  };

  const addIngredient = () => {
    const id = `manual-${crypto.randomUUID()}`;

    onChange([
      ...ingredients,
      {
        id,
        name: "",
        normalizedName: "",
        source: "manual",
      },
    ]);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-[#b46a1f]">
            Kết quả quét
          </p>
          <h2 className="text-2xl font-black">Xác nhận nguyên liệu</h2>
          <p className="mt-1 text-sm font-bold text-black/55">
            Chỉnh lại tên nguyên liệu trước khi Nấu gợi ý món phù hợp.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={addIngredient}
          className="rounded-full border border-black bg-white px-4 font-black"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm
        </Button>
      </div>

      <div className="max-h-[48dvh] space-y-3 overflow-y-auto pr-1">
        {ingredients.map((ingredient) => (
          <div key={ingredient.id} className="rounded-[26px] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-[#d7fdd9] text-black">
                  {ingredient.source === "scan" ? "Đã nhận diện" : "Thêm tay"}
                </Badge>
                {typeof ingredient.confidence === "number" ? (
                  <Badge className="rounded-full bg-[#fff4b8] text-black">
                    Độ tin cậy {Math.round(ingredient.confidence * 100)}%
                  </Badge>
                ) : null}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeIngredient(ingredient.id)}
                aria-label="Xóa nguyên liệu"
                className="rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <Input
              value={getLocalizedIngredientName(ingredient.normalizedName || ingredient.name, locale)}
              onChange={(event) => updateIngredient(ingredient.id, event.target.value)}
              placeholder="Tên nguyên liệu"
              className="h-12 rounded-2xl border-black bg-white text-base font-black"
            />
          </div>
        ))}
      </div>

      <Button
        onClick={onConfirm}
        disabled={ingredients.length === 0 || isLoading || ingredients.some((item) => !item.name.trim())}
        className="h-14 w-full rounded-full bg-[#69bf7b] text-base font-black text-black hover:bg-[#69bf7b]/90"
      >
        <CheckCircle2 className="mr-2 h-5 w-5" />
        {isLoading ? "Đang lưu danh sách..." : "Xác nhận danh sách nguyên liệu"}
      </Button>
    </div>
  );
}
