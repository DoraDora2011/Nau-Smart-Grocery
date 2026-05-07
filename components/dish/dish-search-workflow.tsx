"use client";

import { useMemo, useState } from "react";
import { ChefHat, LoaderCircle, Sparkles } from "lucide-react";

import { DishSearchForm } from "@/components/dish/dish-search-form";
import { Card } from "@/components/ui/card";
import type { DishSuggestion, SuggestDishesResponse } from "@/types";

function tokenizeIngredients(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

function getScoreLabel(score: number) {
  if (score >= 0.85) {
    return "Strong match";
  }

  if (score >= 0.5) {
    return "Good candidate";
  }

  return "Needs a few extras";
}

function DishSuggestionCard({ suggestion }: { suggestion: DishSuggestion }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--color-accent)]">{suggestion.cuisine}</p>
          <h2 className="mt-1 text-lg font-semibold leading-tight sm:text-xl">{suggestion.name}</h2>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{suggestion.summary}</p>
        </div>
        <div className="rounded-2xl bg-[var(--color-muted)] px-3 py-2 text-right">
          <p className="text-sm font-semibold text-[var(--color-ink)]">
            {Math.round(suggestion.matchScore * 100)}%
          </p>
          <p className="text-xs text-[var(--color-ink-soft)]">
            {getScoreLabel(suggestion.matchScore)}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-[var(--color-muted)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
            Matched ingredients
          </p>
          <p className="mt-2 text-sm text-[var(--color-ink)]">
            {suggestion.matchedIngredients.length > 0
              ? suggestion.matchedIngredients.join(", ")
              : "No core ingredient match yet"}
          </p>
        </div>
        <div className="rounded-2xl bg-[var(--color-muted)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
            Missing ingredients
          </p>
          <p className="mt-2 text-sm text-[var(--color-ink)]">
            {suggestion.missingIngredients.length > 0
              ? suggestion.missingIngredients.join(", ")
              : "None"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
          Why this dish
        </p>
        <div className="mt-3 space-y-2">
          {suggestion.reasons.map((reason) => (
            <p key={reason} className="text-sm text-[var(--color-ink)]">
              {reason}
            </p>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm text-[var(--color-ink-soft)]">
        <span>{suggestion.difficulty} difficulty</span>
        <span>{suggestion.estimatedTimeMinutes} min</span>
      </div>
    </Card>
  );
}

export function DishSearchWorkflow() {
  const [ingredientText, setIngredientText] = useState("tomato, egg, garlic");
  const [suggestions, setSuggestions] = useState<DishSuggestion[]>([]);
  const [modelLabel, setModelLabel] = useState<string | null>(null);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const parsedIngredients = useMemo(
    () => tokenizeIngredients(ingredientText),
    [ingredientText]
  );

  const handleSuggest = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuggestions([]);

    try {
      const response = await fetch("/api/suggest-dishes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          confirmedIngredients: parsedIngredients,
          limit: 4
        })
      });

      const payload = (await response.json()) as SuggestDishesResponse;

      if (!response.ok || !payload.success) {
        setErrorMessage(
          payload.success ? "Unable to suggest dishes right now." : payload.error.message
        );
        return;
      }

      setSuggestions(payload.data.suggestions);
      setFallbackUsed(payload.data.fallbackUsed);
      setModelLabel(payload.data.model);
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to suggest dishes right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="space-y-5">
        <DishSearchForm
          ingredientText={ingredientText}
          parsedIngredients={parsedIngredients}
          onIngredientTextChange={setIngredientText}
          onSubmit={handleSuggest}
          isLoading={isLoading}
        />

        {errorMessage ? (
          <Card className="border border-[#e7c6b0] bg-[#fff3ea] text-sm text-[#8c4d2b]">
            {errorMessage}
          </Card>
        ) : null}

        {modelLabel ? (
          <Card className="space-y-2 text-sm text-[var(--color-ink-soft)]">
            <p className="font-semibold text-[var(--color-ink)]">Response metadata</p>
            <p>Model: {modelLabel}</p>
            <p>Fallback mode: {fallbackUsed ? "enabled" : "not used"}</p>
            <p>Confirmed ingredients: {parsedIngredients.length}</p>
          </Card>
        ) : null}
      </div>

      <div className="space-y-5">
        {isLoading ? (
          <Card className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
            <LoaderCircle className="h-7 w-7 animate-spin text-[var(--color-primary)]" />
            <div>
              <p className="text-base font-semibold text-[var(--color-ink)]">
                Suggesting dishes
              </p>
              <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
                The wrapper is reasoning over your confirmed ingredients.
              </p>
            </div>
          </Card>
        ) : suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <DishSuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden p-0">
            <div className="bg-[linear-gradient(135deg,rgba(255,250,241,0.95),rgba(237,243,232,0.98))] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold leading-tight sm:text-xl">Dish suggestions will appear here</h2>
              <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                Enter the ingredients you already confirmed from the scan flow, then request dish
                suggestions.
              </p>
            </div>
            <div className="border-t border-[var(--color-border)] p-6">
              <div className="flex items-center gap-3 text-sm text-[var(--color-ink-soft)]">
                <ChefHat className="h-4 w-4 text-[var(--color-primary)]" />
                Output includes suggested dishes, missing ingredients, and reasoning only.
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
