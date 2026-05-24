"use client";

import { CategoryGrid } from "@/components/catalog/category-grid";
import { ProductGrid } from "@/components/catalog/product-grid";
import { useLanguage } from "@/components/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { getCatalog, getCategories } from "@/lib/repositories/catalogRepository";

export default function ShopPage() {
  const { dictionary } = useLanguage();
  const categories = getCategories();
  const products = getCatalog().slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge>{dictionary.shop.badge}</Badge>
        <h1 className="font-heading text-2xl leading-tight sm:text-3xl md:text-4xl">
          {dictionary.shop.title}
        </h1>
        <p className="max-w-2xl text-sm text-[var(--color-ink-soft)] sm:text-base">
          {dictionary.shop.description}
        </p>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold leading-tight sm:text-2xl">{dictionary.shop.categories}</h2>
          <p className="text-sm text-[var(--color-ink-soft)]">
            {dictionary.shop.categoriesDescription}
          </p>
        </div>
        <CategoryGrid categories={categories} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold leading-tight sm:text-2xl">{dictionary.shop.featured}</h2>
          <p className="text-sm text-[var(--color-ink-soft)]">
            {dictionary.shop.featuredDescription}
          </p>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
