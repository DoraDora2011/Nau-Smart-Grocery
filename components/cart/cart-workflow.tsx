"use client";

import Link from "next/link";
import { useState } from "react";

import { CartBuilderForm } from "@/components/cart/cart-builder-form";
import { CartList } from "@/components/cart/cart-list";
import { CartReview } from "@/components/cart/cart-review";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CartAddResponse, CartIngredientInput, CartItem } from "@/types";

function createEmptyIngredient(): CartIngredientInput {
  return {
    name: "",
    normalizedName: "",
    quantity: 1,
    unit: "gói"
  };
}

export function CartWorkflow() {
  const { addItems } = useCart();
  const [ingredients, setIngredients] = useState<CartIngredientInput[]>([
    { name: "cà chua", normalizedName: "cà chua", quantity: 1, unit: "gói" },
    { name: "tỏi", normalizedName: "tỏi", quantity: 1, unit: "củ" }
  ]);
  const [draftItems, setDraftItems] = useState<CartItem[]>([]);
  const [unmatchedIngredients, setUnmatchedIngredients] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuildCart = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setConfirmationMessage(null);
    setDraftItems([]);
    setUnmatchedIngredients([]);

    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ingredients: ingredients
            .map((ingredient) => ({
              ...ingredient,
              name: ingredient.name.trim(),
              normalizedName: ingredient.name.trim().toLowerCase()
            }))
            .filter((ingredient) => ingredient.name.length > 0)
        })
      });

      const payload = (await response.json()) as CartAddResponse;

      if (!response.ok || !payload.success) {
        setErrorMessage(
          payload.success
            ? "Hiện chưa thể tạo các mặt hàng trong giỏ."
            : payload.error.message
        );
        return;
      }

      setDraftItems(payload.data.items);
      setUnmatchedIngredients(payload.data.unmatchedIngredients);
    } catch (error) {
      console.error(error);
      setErrorMessage("Hiện chưa thể tạo các mặt hàng trong giỏ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[0.84fr_1.16fr]">
        <div className="space-y-5">
          <CartBuilderForm
            ingredients={ingredients}
            onChange={(nextIngredients) =>
              setIngredients(nextIngredients.length > 0 ? nextIngredients : [createEmptyIngredient()])
            }
            onSubmit={handleBuildCart}
            isLoading={isLoading}
          />

          {errorMessage ? (
            <Card className="border border-[#e7c6b0] bg-[#fff3ea] text-sm text-[#8c4d2b]">
              {errorMessage}
            </Card>
          ) : null}

          {confirmationMessage ? (
            <Card className="text-sm text-[var(--color-ink-soft)]">
              {confirmationMessage}
            </Card>
          ) : null}
        </div>

        <div className="space-y-5">
          {draftItems.length > 0 || unmatchedIngredients.length > 0 ? (
            <CartReview
              items={draftItems}
              unmatchedIngredients={unmatchedIngredients}
              onChangeQuantity={(id, quantity) =>
                setDraftItems((current) =>
                  current.map((item) => (item.id === id ? { ...item, quantity } : item))
                )
              }
              onRemoveItem={(id) =>
                setDraftItems((current) => current.filter((item) => item.id !== id))
              }
              onAddToCart={() => {
                addItems(draftItems);
                setConfirmationMessage(
                  `Đã thêm ${draftItems.length} sản phẩm vào giỏ hàng.`
                );
              }}
            />
          ) : (
            <Card className="overflow-hidden p-0">
              <div className="bg-[linear-gradient(135deg,rgba(255,250,241,0.95),rgba(237,243,232,0.98))] p-6">
                <h2 className="text-xl font-semibold">Mapping giỏ hàng deterministic</h2>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                  Tên nguyên liệu được map sang sản phẩm siêu thị chỉ bằng catalog mock cục bộ và
                  file JSON ingredient-product.
                </p>
              </div>
              <div className="border-t border-[var(--color-border)] p-6 text-sm text-[var(--color-ink-soft)]">
                Flow giỏ hàng này không dùng AI ở bất kỳ bước nào.
              </div>
            </Card>
          )}

          <Card className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink)]">Xem catalog siêu thị</p>
              <p className="text-sm text-[var(--color-ink-soft)]">
                Danh mục và sản phẩm được tải từ JSON tĩnh và đường dẫn ảnh PNG.
              </p>
            </div>
            <Link href="/shop">
              <Button variant="secondary">Mở catalog</Button>
            </Link>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Giỏ hàng hiện tại</h2>
          <p className="text-sm text-[var(--color-ink-soft)]">
            Rà soát các mặt hàng đã thêm, chỉnh số lượng hoặc xóa bớt trước khi có bước thanh toán.
          </p>
        </div>
        <CartList />
      </div>
    </div>
  );
}
