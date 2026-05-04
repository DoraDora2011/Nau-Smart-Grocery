"use client";

import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CartItem } from "@/types";

interface CartReviewProps {
  items: CartItem[];
  unmatchedIngredients: string[];
  onChangeQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onAddToCart: () => void;
}

export function CartReview({
  items,
  unmatchedIngredients,
  onChangeQuantity,
  onRemoveItem,
  onAddToCart
}: CartReviewProps) {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Rà soát giỏ hàng grocery</h2>
        <p className="text-sm text-[var(--color-ink-soft)]">
          Lớp mapping này là deterministic và tách biệt hoàn toàn khỏi logic AI.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl bg-[var(--color-muted)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{item.productName}</p>
                <p className="text-sm text-[var(--color-ink-soft)]">
                  {item.brand} · map từ {item.sourceIngredient}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">${item.estimatedPrice.toFixed(2)}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                  aria-label="Xóa mặt hàng nháp trong giỏ"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onChangeQuantity(item.id, Math.max(0.1, item.quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="min-w-20 text-center text-sm font-semibold">
                {item.quantity} {item.unit}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onChangeQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {unmatchedIngredients.length > 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-ink-soft)]">
          Nguyên liệu chưa map được: {unmatchedIngredients.join(", ")}
        </div>
      ) : null}

      <Button onClick={onAddToCart} disabled={items.length === 0} className="w-full">
        <ShoppingBasket className="mr-2 h-4 w-4" />
        Thêm các mặt hàng đã rà soát vào giỏ
      </Button>
    </Card>
  );
}
