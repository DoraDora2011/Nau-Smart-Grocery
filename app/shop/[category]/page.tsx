import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/catalog/product-grid";
import { Badge } from "@/components/ui/badge";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/repositories/catalogRepository";

export default async function CategoryPage({
  params
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const products = getProductsByCategory(category.name);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link href="/shop" className="text-sm font-semibold text-[var(--color-primary)]">
          Quay lại catalog
        </Link>
        <Badge>{category.name}</Badge>
        <h1 className="font-heading text-3xl leading-tight sm:text-4xl">
          {category.name}
        </h1>
        <p className="max-w-2xl text-sm text-[var(--color-ink-soft)] sm:text-base">
          {category.description}
        </p>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
