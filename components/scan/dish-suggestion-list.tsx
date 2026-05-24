"use client";

import { ChefHat, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { interpolate } from "@/lib/i18n/translations";
import { uiLabels } from "@/lib/i18n/ui-labels";
import type { DishSuggestion } from "@/types";

interface DishSuggestionListProps {
  suggestions: DishSuggestion[];
  onSelect: (dishName: string) => void;
  isLoading: boolean;
}

export function DishSuggestionList({
  suggestions,
  onSelect,
  isLoading
}: DishSuggestionListProps) {
  const { locale } = useLanguage();
  const labels = uiLabels[locale].dishSuggestion;

  return (
    <div className="space-y-3">
      {suggestions.map((suggestion) => (
        <Card key={suggestion.id} className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-accent)]">
                <ChefHat className="h-4 w-4" />
                {suggestion.cuisine}
              </div>
              <h3 className="mt-2 text-base font-semibold leading-snug sm:text-lg">{suggestion.name}</h3>
              <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{suggestion.summary}</p>
            </div>
            <Badge>{interpolate(labels.match, { value: Math.round(suggestion.matchScore * 100) })}</Badge>
          </div>

          {suggestion.missingIngredients.length > 0 ? (
            <p className="text-sm text-[var(--color-ink-soft)]">
              {interpolate(labels.missing, { items: suggestion.missingIngredients.join(", ") })}
            </p>
          ) : (
            <p className="text-sm text-[var(--color-primary)]">{labels.enough}</p>
          )}

          <Button onClick={() => onSelect(suggestion.name)} disabled={isLoading} className="w-full">
            {isLoading ? (
              labels.creating
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {labels.create}
              </>
            )}
          </Button>
        </Card>
      ))}
    </div>
  );
}
