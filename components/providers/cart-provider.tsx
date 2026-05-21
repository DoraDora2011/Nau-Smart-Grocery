"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";

import { productCatalog, type ProductCatalogItem } from "@/data/productCatalog";
import { calculateCartQuantityFromRecipeIngredient } from "@/lib/services/cartQuantity";
import { playUiSound } from "@/lib/utils/ui-sounds";
import type { CartItem } from "@/types";

interface CartContextValue {
  items: CartItem[];
  addItems: (incomingItems: CartItem[]) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "nau-smart-grocery-cart";
const RAW_RECIPE_UNITS = new Set([
  "g",
  "kg",
  "ml",
  "l",
  "lit",
  "liter",
  "litre",
  "qua",
  "cai",
  "piece",
  "pieces",
  "pcs",
  "muong",
  "muong canh",
  "muong ca phe",
  "tbsp",
  "tsp",
  "teaspoon",
  "tablespoon"
]);

function normalizeUnit(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
}

function normalizeName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findCatalogProduct(item: CartItem): ProductCatalogItem | null {
  const byId = productCatalog.find((product) => product.id === item.productId);

  if (byId) {
    return byId;
  }

  const names = [
    item.productName,
    item.sourceIngredient
  ].map(normalizeName).filter(Boolean);

  return (
    productCatalog.find((product) => {
      const productName = normalizeName(product.name);
      const aliases = product.aliases.map(normalizeName);

      return names.some(
        (name) =>
          productName.includes(name) ||
          name.includes(productName) ||
          aliases.some((alias) => alias === name || (alias && name.includes(alias)))
      );
    }) ?? null
  );
}

function looksLikeLegacyRecipeQuantity(item: CartItem) {
  const normalizedUnit = normalizeUnit(item.unit);

  return (
    !item.cartQuantity &&
    !item.recipeDisplayAmount &&
    (item.quantity > 20 || RAW_RECIPE_UNITS.has(normalizedUnit))
  );
}

function normalizeStoredItem(item: CartItem): CartItem {
  if (item.source === "catalog") {
    return {
      ...item,
      quantity: Math.max(1, item.quantity),
      cartQuantity: item.cartQuantity ?? Math.max(1, item.quantity),
      image: item.image || "/catalog/fallback-product.png"
    };
  }

  if (item.source === "recipe" || item.source === "scan") {
    return {
      ...item,
      productId: item.productId || item.id,
      productName: item.productName || item.sourceIngredient,
      category: item.category || "Nguyên liệu từ công thức",
      image: item.image || "/catalog/fallback-product.png",
      estimatedPrice: item.estimatedPrice || 10000,
      quantity: Math.max(1, item.quantity),
      cartQuantity: item.cartQuantity ?? Math.max(1, item.quantity),
      unit: item.unit || item.sellUnitLabel || "phần",
      sellUnitLabel: item.sellUnitLabel ?? item.unit,
      displayUnit: item.displayUnit ?? item.recipeDisplayAmount ?? item.unit
    };
  }

  const product = findCatalogProduct(item);
  const baseItem = {
    ...item,
    productId: product?.id ?? item.productId,
    productName: product?.name ?? item.productName,
    category: product?.categoryLabel ?? (item.category || "Uncategorized"),
    image: product?.image ?? (item.image || "/catalog/fallback-product.png"),
    estimatedPrice: product?.price ?? item.estimatedPrice,
    unit: product?.sellUnitLabel ?? item.unit,
    sellUnitLabel: product?.sellUnitLabel ?? item.sellUnitLabel,
    displayUnit: product?.displayUnit ?? item.displayUnit
  };

  if (!looksLikeLegacyRecipeQuantity(baseItem)) {
    return {
      ...baseItem,
      quantity: Math.max(1, baseItem.quantity),
      cartQuantity: baseItem.cartQuantity ?? Math.max(1, baseItem.quantity)
    };
  }

  const recipeDisplayAmount = `${baseItem.quantity}${baseItem.unit}`;

  if (!product) {
    return {
      ...baseItem,
      quantity: 1,
      cartQuantity: 1,
      recipeAmount: baseItem.quantity,
      recipeDisplayAmount,
      sellUnitLabel: "sản phẩm",
      displayUnit: "1 sản phẩm",
      unit: "sản phẩm"
    };
  }

  const result = calculateCartQuantityFromRecipeIngredient(
    {
      quantity: baseItem.quantity,
      unit: baseItem.unit,
      recipeDisplayAmount
    },
    product
  );

  return {
    ...baseItem,
    productId: product.id,
    productName: product.name,
    category: product.categoryLabel,
    image: product.image,
    estimatedPrice: product.price,
    quantity: result.cartQuantity,
    unit: product.sellUnitLabel,
    cartQuantity: result.cartQuantity,
    recipeAmount: result.recipeAmount,
    recipeDisplayAmount: result.recipeDisplayAmount,
    sellUnitLabel: product.sellUnitLabel,
    displayUnit: product.displayUnit
  };
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setItems((JSON.parse(saved) as CartItem[]).map(normalizeStoredItem));
      }
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hasHydrated, items]);

  const value: CartContextValue = {
    items,
    addItems: (incomingItems) => {
      if (incomingItems.length > 0) {
        playUiSound("cart");
      }

      setItems((current) => {
        const merged = new Map(current.map((item) => {
          const normalizedItem = normalizeStoredItem(item);

          return [normalizedItem.id, normalizedItem] as const;
        }));

        incomingItems.forEach((item) => {
          const normalizedIncomingItem = normalizeStoredItem(item);
          const existing = merged.get(normalizedIncomingItem.id);

          if (existing) {
            merged.set(normalizedIncomingItem.id, {
              ...existing,
              quantity: existing.quantity + normalizedIncomingItem.quantity,
              cartQuantity: (existing.cartQuantity ?? existing.quantity) + normalizedIncomingItem.quantity
            });
            return;
          }

          merged.set(normalizedIncomingItem.id, normalizedIncomingItem);
        });

        return Array.from(merged.values());
      });
    },
    updateQuantity: (id, quantity) => {
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0.1, quantity) } : item
        )
      );
    },
    removeItem: (id) => {
      setItems((current) => current.filter((item) => item.id !== id));
    },
    clearCart: () => setItems([])
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
