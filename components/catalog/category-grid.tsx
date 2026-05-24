"use client";

import Link from "next/link";

import { CatalogImage } from "@/components/catalog/catalog-image";
import { useLanguage } from "@/components/providers/language-provider";
import { Card } from "@/components/ui/card";
import type { GroceryCategory } from "@/types";

const categoryCopyBySlug = {
  vi: {
    produce: {
      name: "Rau củ",
      description: "Rau củ tươi và các nguyên liệu bếp quen thuộc mỗi ngày."
    },
    "dairy-eggs": {
      name: "Sữa và trứng",
      description: "Các món cơ bản cho bữa sáng và nhóm hàng cần bảo quản mát."
    },
    herbs: {
      name: "Rau thơm",
      description: "Nhóm rau thơm và các nguyên liệu giúp món ăn dậy mùi hơn."
    },
    pantry: {
      name: "Đồ khô và gia vị",
      description: "Nhóm đồ khô, gia vị và nguyên liệu nấu ăn dùng hằng ngày."
    },
    meat: {
      name: "Thịt cá",
      description: "Nhóm đạm phù hợp cho các món nấu nhanh và món cơm nhà."
    }
  },
  en: {
    produce: {
      name: "Produce",
      description: "Fresh vegetables and everyday kitchen ingredients."
    },
    "dairy-eggs": {
      name: "Dairy and eggs",
      description: "Breakfast basics and chilled grocery staples."
    },
    herbs: {
      name: "Herbs",
      description: "Fresh herbs and aromatic ingredients for brighter dishes."
    },
    pantry: {
      name: "Pantry and seasonings",
      description: "Dry goods, seasonings, and everyday cooking essentials."
    },
    meat: {
      name: "Meat and fish",
      description: "Protein staples for quick meals and home cooking."
    }
  }
} as const;

export function getLocalizedCatalogCategory(category: GroceryCategory, locale: "vi" | "en") {
  return (
    categoryCopyBySlug[locale][category.slug as keyof (typeof categoryCopyBySlug)[typeof locale]] ?? {
      name: category.name,
      description: category.description
    }
  );
}

export function CategoryGrid({ categories }: { categories: GroceryCategory[] }) {
  const { locale } = useLanguage();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => {
        const copy = getLocalizedCatalogCategory(category, locale);

        return (
          <Link key={category.slug} href={`/shop/${category.slug}`}>
            <Card className="overflow-hidden p-0 transition hover:-translate-y-0.5">
              <CatalogImage
                src={category.image}
                alt={copy.name}
                label={copy.name}
                className="h-44 w-full object-cover"
              />
              <div className="space-y-2 p-5">
                <h2 className="text-base font-semibold leading-snug sm:text-lg">{copy.name}</h2>
                <p className="text-sm text-[var(--color-ink-soft)]">{copy.description}</p>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
