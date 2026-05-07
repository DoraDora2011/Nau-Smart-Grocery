import { Clock3, Soup, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Recipe } from "@/types";

function getDifficultyLabel(difficulty: Recipe["difficulty"]) {
  if (difficulty === "easy") {
    return "Dễ";
  }

  if (difficulty === "medium") {
    return "Trung bình";
  }

  return "Nâng cao";
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--color-accent)]">{recipe.cuisine}</p>
          <h2 className="text-xl font-semibold leading-tight sm:text-2xl">{recipe.dishName}</h2>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{recipe.summary}</p>
        </div>
        <Badge>{getDifficultyLabel(recipe.difficulty)}</Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-[var(--color-muted)] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4" />
            Khẩu phần
          </div>
          <p className="mt-2 text-lg leading-tight sm:text-xl">{recipe.servings}</p>
        </div>
        <div className="rounded-2xl bg-[var(--color-muted)] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Clock3 className="h-4 w-4" />
            Prep
          </div>
          <p className="mt-2 text-lg leading-tight sm:text-xl">{recipe.prepTimeMinutes} phút</p>
        </div>
        <div className="rounded-2xl bg-[var(--color-muted)] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Soup className="h-4 w-4" />
            Nấu
          </div>
          <p className="mt-2 text-lg leading-tight sm:text-xl">{recipe.cookTimeMinutes} phút</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
              Nguyên liệu chính
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {recipe.ingredients.map((ingredient) => (
                <li
                  key={`${ingredient.normalizedName}-${ingredient.unit}`}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-[var(--color-muted)] px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{ingredient.name}</p>
                    {ingredient.optional ? (
                      <p className="text-xs text-[var(--color-ink-soft)]">Tùy chọn</p>
                    ) : null}
                  </div>
                  <p className="font-semibold">
                    {ingredient.quantity} {ingredient.unit}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {(recipe.seasonings?.length ?? 0) > 0 ? (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                Gia vị
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                {recipe.seasonings?.map((seasoning) => (
                  <li
                    key={`${seasoning.normalizedName}-${seasoning.unit}`}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 ring-1 ring-[var(--color-border)]"
                  >
                    <p className="font-medium">{seasoning.name}</p>
                    <p className="font-semibold">
                      {seasoning.quantity} {seasoning.unit}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
            Các bước nấu
          </h3>
          <ol className="mt-3 space-y-3">
            {recipe.steps.map((step) => (
              <li
                key={step.order}
                className="rounded-2xl bg-white px-4 py-4 ring-1 ring-[var(--color-border)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  Bước {step.order}
                </p>
                <p className="mt-2 text-sm text-[var(--color-ink)]">{step.instruction}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {(recipe.notes?.length ?? 0) > 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-3">
          <h3 className="text-sm font-semibold text-[var(--color-ink)]">Ghi chú khi nấu</h3>
          <div className="mt-2 space-y-2 text-sm text-[var(--color-ink-soft)]">
            {recipe.notes?.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </div>
      ) : null}

      {recipe.youtubeSearchKeyword ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-ink-soft)]">
          Từ khóa tìm YouTube:{" "}
          <span className="font-semibold text-[var(--color-ink)]">
            {recipe.youtubeSearchKeyword}
          </span>
        </div>
      ) : null}
    </Card>
  );
}
