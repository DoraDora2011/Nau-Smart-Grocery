"use client";

import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { RecipeIngredient, UpsellSuggestion } from "@/types";

interface IngredientReviewPanelProps {
  requiredIngredients: RecipeIngredient[];
  optionalIngredients: RecipeIngredient[];
  seasonings: RecipeIngredient[];
  upsellSuggestions: UpsellSuggestion[];
  selectedUpsells: string[];
  onIngredientQuantityChange: (
    section: "required" | "optional" | "seasonings",
    normalizedName: string,
    nextQuantity: number
  ) => void;
  onOptionalToggle: (normalizedName: string) => void;
  onUpsellToggle: (normalizedName: string) => void;
  onAddFullListToCart: () => void;
  onAddUpsellsToCart: () => void;
  isSubmittingMainCart: boolean;
  isSubmittingUpsells: boolean;
}

function IngredientRow({
  ingredient,
  canRemove,
  onDecrease,
  onIncrease,
  onToggleRemove
}: {
  ingredient: RecipeIngredient;
  canRemove: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  onToggleRemove?: () => void;
}) {
  return (
    <div className="rounded-2xl bg-[var(--color-muted)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{ingredient.name}</p>
          <p className="text-sm text-[var(--color-ink-soft)]">
            {ingredient.required ? "Bắt buộc" : ingredient.optional ? "Tùy chọn" : "Đã gồm"}
          </p>
        </div>
        {canRemove && onToggleRemove ? (
          <Button variant="ghost" size="sm" onClick={onToggleRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={onDecrease}>
          <Minus className="h-4 w-4" />
        </Button>
        <div className="min-w-24 text-center text-sm font-semibold">
          {ingredient.quantity} {ingredient.unit}
        </div>
        <Button variant="secondary" size="sm" onClick={onIncrease}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function IngredientReviewPanel({
  requiredIngredients,
  optionalIngredients,
  seasonings,
  upsellSuggestions,
  selectedUpsells,
  onIngredientQuantityChange,
  onOptionalToggle,
  onUpsellToggle,
  onAddFullListToCart,
  onAddUpsellsToCart,
  isSubmittingMainCart,
  isSubmittingUpsells
}: IngredientReviewPanelProps) {
  return (
    <div className="space-y-5">
      <Card className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold">Bước 5 - Rà soát nguyên liệu</h2>
          <p className="text-sm text-[var(--color-ink-soft)]">
            Điều chỉnh số lượng trước khi thêm danh sách nguyên liệu cuối cùng vào giỏ hàng.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
              Nguyên liệu bắt buộc
            </h3>
            <div className="mt-3 space-y-3">
              {requiredIngredients.map((ingredient) => (
                <IngredientRow
                  key={ingredient.normalizedName}
                  ingredient={ingredient}
                  canRemove={false}
                  onDecrease={() =>
                    onIngredientQuantityChange(
                      "required",
                      ingredient.normalizedName,
                      Math.max(0.1, ingredient.quantity - 1)
                    )
                  }
                  onIncrease={() =>
                    onIngredientQuantityChange(
                      "required",
                      ingredient.normalizedName,
                      ingredient.quantity + 1
                    )
                  }
                />
              ))}
            </div>
          </div>

          {seasonings.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                Gia vị
              </h3>
              <div className="mt-3 space-y-3">
                {seasonings.map((ingredient) => (
                  <IngredientRow
                    key={ingredient.normalizedName}
                    ingredient={ingredient}
                    canRemove={false}
                    onDecrease={() =>
                      onIngredientQuantityChange(
                        "seasonings",
                        ingredient.normalizedName,
                        Math.max(0.1, ingredient.quantity - 0.5)
                      )
                    }
                    onIncrease={() =>
                      onIngredientQuantityChange(
                        "seasonings",
                        ingredient.normalizedName,
                        ingredient.quantity + 0.5
                      )
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}

          {optionalIngredients.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                Nguyên liệu tùy chọn
              </h3>
              <div className="mt-3 space-y-3">
                {optionalIngredients.map((ingredient) => (
                  <IngredientRow
                    key={ingredient.normalizedName}
                    ingredient={ingredient}
                    canRemove
                    onDecrease={() =>
                      onIngredientQuantityChange(
                        "optional",
                        ingredient.normalizedName,
                        Math.max(0.1, ingredient.quantity - 1)
                      )
                    }
                    onIncrease={() =>
                      onIngredientQuantityChange(
                        "optional",
                        ingredient.normalizedName,
                        ingredient.quantity + 1
                      )
                    }
                    onToggleRemove={() => onOptionalToggle(ingredient.normalizedName)}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <Button
          onClick={onAddFullListToCart}
          disabled={isSubmittingMainCart}
          className="w-full"
        >
          <ShoppingBasket className="mr-2 h-4 w-4" />
          {isSubmittingMainCart
            ? "Đang thêm toàn bộ nguyên liệu..."
            : "Thêm toàn bộ danh sách nguyên liệu vào giỏ"}
        </Button>
      </Card>

      {upsellSuggestions.length > 0 ? (
        <Card className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Bước 6 - Bạn có thể muốn mua thêm</h2>
            <p className="text-sm text-[var(--color-ink-soft)]">
              Đây là các món mua thêm tùy chọn và được tách riêng khỏi nguyên liệu bắt buộc của công thức.
            </p>
          </div>

          <div className="space-y-3">
            {upsellSuggestions.map((item) => {
              const selected = selectedUpsells.includes(item.normalizedName);

              return (
                <div
                  key={item.normalizedName}
                  className="rounded-2xl border border-[var(--color-border)] bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-[var(--color-ink-soft)]">{item.reason}</p>
                    </div>
                    <Button
                      variant={selected ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => onUpsellToggle(item.normalizedName)}
                    >
                      {selected ? "Đã chọn" : "Chọn thêm"}
                    </Button>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[var(--color-ink)]">
                    {item.quantity} {item.unit}
                  </p>
                </div>
              );
            })}
          </div>

          <Button
            variant="secondary"
            onClick={onAddUpsellsToCart}
            disabled={selectedUpsells.length === 0 || isSubmittingUpsells}
            className="w-full"
          >
            {isSubmittingUpsells ? "Đang thêm món mua thêm..." : "Thêm các món đã chọn vào giỏ"}
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
