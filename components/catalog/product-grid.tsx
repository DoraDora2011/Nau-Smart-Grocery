"use client";

import { CatalogImage } from "@/components/catalog/catalog-image";
import { useLanguage } from "@/components/providers/language-provider";
import { Card } from "@/components/ui/card";
import { getLocalizedProductText } from "@/lib/i18n/products";
import type { GroceryProduct } from "@/types";

export function ProductGrid({ products }: { products: GroceryProduct[] }) {
  const { locale, dictionary } = useLanguage();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => {
        const text = getLocalizedProductText(
          {
            id: product.id,
            name: product.name,
            detail: product.unit,
            category: product.category,
            categoryLabel: product.category
          },
          locale
        );

        return (
          <Card key={product.id} className="overflow-hidden p-0">
            <CatalogImage
              src={product.image}
              alt={text.name}
              label={text.name}
              className="h-44 w-full object-cover"
            />
            <div className="space-y-3 p-5">
              <div>
                <p className="text-sm text-[var(--color-accent)]">{text.category}</p>
                <h2 className="text-base font-semibold leading-snug sm:text-lg">{text.name}</h2>
                <p className="text-sm text-[var(--color-ink-soft)]">{product.brand}</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[var(--color-ink-soft)]">{text.detail}</span>
                <span className="text-base font-semibold">
                  {new Intl.NumberFormat(dictionary.common.currencyLocale).format(product.price)}
                  {dictionary.common.currencySuffix}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
