import { CatalogImage } from "@/components/catalog/catalog-image";
import { Card } from "@/components/ui/card";
import type { GroceryProduct } from "@/types";

export function ProductGrid({ products }: { products: GroceryProduct[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden p-0">
          <CatalogImage
            src={product.image}
            alt={product.name}
            label={product.name}
            className="h-44 w-full object-cover"
          />
          <div className="space-y-3 p-5">
            <div>
              <p className="text-sm text-[var(--color-accent)]">{product.category}</p>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-[var(--color-ink-soft)]">{product.brand}</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[var(--color-ink-soft)]">{product.unit}</span>
              <span className="text-base font-semibold">${product.price.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
