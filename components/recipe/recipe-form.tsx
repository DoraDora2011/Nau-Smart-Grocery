"use client";

import { AlertCircle, Search, ShieldAlert, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface RecipeFormProps {
  step: 1 | 2;
  dishName: string;
  servings: number;
  allergiesText: string;
  parsedAllergies: string[];
  onDishNameChange: (value: string) => void;
  onServingsChange: (value: number) => void;
  onAllergiesTextChange: (value: string) => void;
  onStepOneSubmit: () => void;
  onStepTwoSubmit: () => void;
  isLoading: boolean;
}

export function RecipeForm({
  step,
  dishName,
  servings,
  allergiesText,
  parsedAllergies,
  onDishNameChange,
  onServingsChange,
  onAllergiesTextChange,
  onStepOneSubmit,
  onStepTwoSubmit,
  isLoading
}: RecipeFormProps) {
  if (step === 1) {
    return (
      <Card className="space-y-4">
        <div>
          <h2 className="text-base font-semibold leading-snug sm:text-lg">Bước 1 - Nhập tên món</h2>
          <p className="text-sm text-[var(--color-ink-soft)]">
            Hãy cho hệ thống biết món ăn bạn muốn nấu.
          </p>
        </div>

        <Input
          value={dishName}
          onChange={(event) => onDishNameChange(event.target.value)}
          placeholder="Ví dụ: Canh chua cá, Tomato egg soup hoặc Beef stew"
        />

        <Button
          onClick={onStepOneSubmit}
          disabled={!dishName.trim() || isLoading}
          className="w-full"
        >
          <Search className="mr-2 h-4 w-4" />
          Tiếp tục
        </Button>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-base font-semibold leading-snug sm:text-lg">Bước 2 - Khẩu phần và dị ứng</h2>
        <p className="text-sm text-[var(--color-ink-soft)]">
          Hệ thống sẽ kiểm tra nguy cơ dị ứng trước khi tạo công thức nấu ăn.
        </p>
      </div>

      <div className="rounded-2xl bg-[var(--color-muted)] px-4 py-3 text-sm text-[var(--color-ink)]">
        Món đã chọn: <span className="font-semibold">{dishName}</span>
      </div>

      <div className="rounded-[24px] border border-[var(--color-border)] bg-white px-4 py-3">
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]">
          <Users className="h-4 w-4" />
          Có bao nhiêu người sẽ ăn món này?
        </label>
        <input
          type="number"
          min={1}
          max={50}
          value={servings}
          onChange={(event) => onServingsChange(Number(event.target.value) || 1)}
          className="w-full bg-transparent text-base text-[var(--color-ink)] outline-none"
        />
      </div>

      <div className="space-y-3 rounded-[24px] border border-[var(--color-border)] bg-white px-4 py-4">
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]">
          <ShieldAlert className="h-4 w-4" />
          Bạn có bị dị ứng với nguyên liệu nào không?
        </label>
        <textarea
          value={allergiesText}
          onChange={(event) => onAllergiesTextChange(event.target.value)}
          placeholder="Ví dụ: tôm, đậu phộng, sữa"
          className="min-h-28 w-full resize-none bg-transparent text-sm text-[var(--color-ink)] outline-none"
        />
        <div className="rounded-2xl bg-[var(--color-muted)] p-3">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
            <AlertCircle className="h-4 w-4" />
            Thẻ dị ứng đã nhận
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {parsedAllergies.length > 0 ? (
              parsedAllergies.map((allergy) => (
                <span
                  key={allergy}
                  className="rounded-full bg-white px-3 py-1 text-sm text-[var(--color-ink)] ring-1 ring-[var(--color-border)]"
                >
                  {allergy}
                </span>
              ))
            ) : (
              <p className="text-sm text-[var(--color-ink-soft)]">
                Có thể để trống nếu không cần kiểm tra dị ứng.
              </p>
            )}
          </div>
        </div>
      </div>

      <Button
        onClick={onStepTwoSubmit}
        disabled={!dishName.trim() || servings < 1 || isLoading}
        className="w-full"
      >
        {isLoading ? "Đang kiểm tra an toàn và tạo công thức..." : "Kiểm tra an toàn và tiếp tục"}
      </Button>
    </Card>
  );
}
