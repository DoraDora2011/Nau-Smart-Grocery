"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DishSearchFormProps {
  ingredientText: string;
  parsedIngredients: string[];
  onIngredientTextChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function DishSearchForm({
  ingredientText,
  parsedIngredients,
  onIngredientTextChange,
  onSubmit,
  isLoading
}: DishSearchFormProps) {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-base font-semibold leading-snug sm:text-lg">Confirmed ingredients</h2>
        <p className="text-sm text-[var(--color-ink-soft)]">
          Paste the ingredients the user has already confirmed from the scan flow.
        </p>
      </div>

      <textarea
        value={ingredientText}
        onChange={(event) => onIngredientTextChange(event.target.value)}
        placeholder={"tomato\negg\ngarlic"}
        className="min-h-44 w-full rounded-[24px] border border-[var(--color-border)] bg-white px-4 py-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-primary)]"
      />

      <div className="rounded-2xl bg-[var(--color-muted)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
          Parsed ingredients
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {parsedIngredients.length > 0 ? (
            parsedIngredients.map((ingredient) => (
              <span
                key={ingredient}
                className="rounded-full bg-white px-3 py-1 text-sm text-[var(--color-ink)] ring-1 ring-[var(--color-border)]"
              >
                {ingredient}
              </span>
            ))
          ) : (
            <p className="text-sm text-[var(--color-ink-soft)]">
              Add at least one confirmed ingredient to continue.
            </p>
          )}
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={parsedIngredients.length === 0 || isLoading}
        className="w-full"
      >
        <Search className="mr-2 h-4 w-4" />
        {isLoading ? "Finding suggested dishes..." : "Suggest dishes"}
      </Button>
    </Card>
  );
}
