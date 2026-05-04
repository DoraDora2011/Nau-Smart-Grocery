import Link from "next/link";

import { CatalogImage } from "@/components/catalog/catalog-image";
import { Card } from "@/components/ui/card";
import type { GroceryCategory } from "@/types";

export function CategoryGrid({ categories }: { categories: GroceryCategory[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <Link key={category.slug} href={`/shop/${category.slug}`}>
          <Card className="overflow-hidden p-0 transition hover:-translate-y-0.5">
            <CatalogImage
              src={category.image}
              alt={category.name}
              label={category.name}
              className="h-44 w-full object-cover"
            />
            <div className="space-y-2 p-5">
              <h2 className="text-lg font-semibold">{category.name}</h2>
              <p className="text-sm text-[var(--color-ink-soft)]">{category.description}</p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
