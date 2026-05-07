import { CategoryGrid } from "@/components/catalog/category-grid";
import { ProductGrid } from "@/components/catalog/product-grid";
import { Badge } from "@/components/ui/badge";
import { getCatalog, getCategories } from "@/lib/repositories/catalogRepository";

export default function ShopPage() {
  const categories = getCategories();
  const products = getCatalog().slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge>Siêu thị</Badge>
        <h1 className="font-heading text-2xl leading-tight sm:text-3xl md:text-4xl">
          Xem các danh mục siêu thị tĩnh
        </h1>
        <p className="max-w-2xl text-sm text-[var(--color-ink-soft)] sm:text-base">
          Danh mục và sản phẩm trên các trang này được tải từ JSON cục bộ và đường dẫn ảnh PNG,
          hoàn toàn tách biệt với các tính năng AI.
        </p>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold leading-tight sm:text-2xl">Danh mục</h2>
          <p className="text-sm text-[var(--color-ink-soft)]">
            Bắt đầu từ một ngành hàng và giữ logic duyệt catalog hoàn toàn deterministic.
          </p>
        </div>
        <CategoryGrid categories={categories} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold leading-tight sm:text-2xl">Sản phẩm nổi bật</h2>
          <p className="text-sm text-[var(--color-ink-soft)]">
            Các mặt hàng này cũng được lấy trực tiếp từ nguồn dữ liệu catalog tĩnh.
          </p>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
