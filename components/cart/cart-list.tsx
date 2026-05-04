"use client";

import { Trash2 } from "lucide-react";

import { CatalogImage } from "@/components/catalog/catalog-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/components/providers/cart-provider";

export function CartList() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Card className="text-sm text-[var(--color-ink-soft)]">
        Giỏ hàng của bạn đang trống. Hãy tạo sản phẩm từ danh sách nguyên liệu hoặc xem catalog
        siêu thị tĩnh trước.
      </Card>
    );
  }

  const total = items.reduce(
    (sum, item) => sum + item.estimatedPrice * Math.max(item.quantity, 1),
    0
  );

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="space-y-4">
          <div className="flex items-start gap-4">
            <CatalogImage
              src={item.image || "/catalog/fallback-product.png"}
              alt={item.productName}
              label={item.productName}
              className="h-20 w-20 rounded-2xl object-cover"
            />

            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{item.productName}</h2>
                  <p className="text-sm text-[var(--color-ink-soft)]">
                    {item.brand} · {item.category || "Chưa phân loại"}
                  </p>
                  <p className="text-sm text-[var(--color-ink-soft)]">
                    Map từ {item.sourceIngredient}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <label className="text-sm text-[var(--color-ink-soft)]">Số lượng</label>
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                  className="h-11 w-28 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-right text-sm"
                />
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Card className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--color-ink-soft)]">Tạm tính ước lượng</p>
          <p className="text-2xl font-semibold">${total.toFixed(2)}</p>
        </div>
        <Button variant="secondary" onClick={clearCart}>
          Xóa giỏ hàng
        </Button>
      </Card>
    </div>
  );
}
