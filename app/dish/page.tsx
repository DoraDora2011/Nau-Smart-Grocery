"use client";

import { Suspense } from "react";

import { RecipeWorkflow } from "@/components/recipe/recipe-workflow";
import { useLanguage } from "@/components/providers/language-provider";
import { Badge } from "@/components/ui/badge";

export default function DishPage() {
  const { dictionary } = useLanguage();

  return (
    <div className="min-h-[100dvh] bg-[#ebf1a0] lg:space-y-5 lg:bg-transparent">
      <div className="hidden space-y-3 lg:block">
        <Badge>{dictionary.dishPage.badge}</Badge>
        <h1 className="font-heading text-2xl leading-tight sm:text-3xl md:text-4xl">
          {dictionary.dishPage.title}
        </h1>
        <p className="max-w-2xl text-sm text-[var(--color-ink-soft)] sm:text-base">
          {dictionary.dishPage.description}
        </p>
      </div>

      <Suspense fallback={<p className="text-sm text-[var(--color-ink-soft)]">Đang mở công thức...</p>}>
        <RecipeWorkflow />
      </Suspense>
    </div>
  );
}
