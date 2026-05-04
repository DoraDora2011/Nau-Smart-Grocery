"use client";

import { Suspense } from "react";

import { RecipeWorkflow } from "@/components/recipe/recipe-workflow";
import { useLanguage } from "@/components/providers/language-provider";
import { Badge } from "@/components/ui/badge";

export default function RecipePage() {
  const { dictionary } = useLanguage();

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Badge>{dictionary.recipePage.badge}</Badge>
        <h1 className="font-heading text-3xl leading-tight sm:text-4xl">
          {dictionary.recipePage.title}
        </h1>
        <p className="max-w-2xl text-sm text-[var(--color-ink-soft)] sm:text-base">
          {dictionary.recipePage.description}
        </p>
      </div>

      <Suspense fallback={<p className="text-sm text-[var(--color-ink-soft)]">Đang mở công thức...</p>}>
        <RecipeWorkflow />
      </Suspense>
    </div>
  );
}
