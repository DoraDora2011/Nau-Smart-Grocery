"use client";

import { useEffect, useMemo, useState } from "react";

import { HomeDesktopLayout } from "@/components/home/HomeDesktopLayout";
import { HomeMobileLayout } from "@/components/home/HomeMobileLayout";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { useFavorites } from "@/components/providers/favorite-provider";
import { useCart } from "@/components/providers/cart-provider";
import {
  homeCategories,
  homeProducts,
  type HomeCategoryKey,
  type HomeProduct,
  type HomeProductSection
} from "@/data/home-products";
import {
  DEFAULT_DELIVERY_ADDRESS,
  readStoredDeliveryAddress,
  saveDeliveryAddress
} from "@/lib/utils/delivery-address";
import type { CartItem } from "@/types";

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d");
}

export function HomePage() {
  const { addItems, removeItem, updateQuantity } = useCart();
  const { favoriteIds, toggleProduct } = useFavorites();
  const [activeCategory, setActiveCategory] = useState<HomeCategoryKey | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<HomeProductSection>>(new Set());
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState(DEFAULT_DELIVERY_ADDRESS);

  useEffect(() => {
    const updateAddress = () => setDeliveryAddress(readStoredDeliveryAddress());

    updateAddress();
    window.addEventListener("storage", updateAddress);
    window.addEventListener("nau-smart-grocery:delivery-address-updated", updateAddress);

    return () => {
      window.removeEventListener("storage", updateAddress);
      window.removeEventListener("nau-smart-grocery:delivery-address-updated", updateAddress);
    };
  }, []);

  useEffect(() => {
    if (!cartMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCartMessage(null);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [cartMessage]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery.trim());
    const searchTokens = normalizedQuery.split(/\s+/).filter(Boolean);

    return homeProducts.filter((product) => {
      const matchesCategory = activeCategory ? product.category === activeCategory : true;
      const categoryLabel =
        homeCategories.find((category) => category.key === product.category)?.label ?? "";
      const searchableText = normalizeText(
        `${product.name} ${product.detail} ${categoryLabel} ${product.price}`
      );
      const matchesSearch = searchTokens.length
        ? searchTokens.every((token) => searchableText.includes(token))
        : true;

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const allPopularProducts = filteredProducts.filter((product) => product.section === "popular");
  const allBestDealProducts = filteredProducts.filter((product) => product.section === "best-deal");
  const hasSearchQuery = searchQuery.trim().length > 0;
  const searchResultProducts = filteredProducts;
  const popularProducts =
    expandedSections.has("popular") || hasSearchQuery
      ? allPopularProducts
      : allPopularProducts.slice(0, 4);
  const bestDealProducts =
    expandedSections.has("best-deal") || hasSearchQuery
      ? allBestDealProducts
      : allBestDealProducts.slice(0, 4);
  const categoryProducts = filteredProducts.filter((product) => product.section === "category");
  const activeCategoryLabel =
    homeCategories.find((category) => category.key === activeCategory)?.label ?? null;

  const toggleFavorite = (productId: string) => {
    const product = homeProducts.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    toggleProduct({
      id: product.id,
      productId: product.id,
      name: product.name,
      detail: product.detail,
      price: product.price,
      oldPrice: product.oldPrice ?? null,
      image: product.image.src,
      category: product.category
    });
  };

  const addProductToCart = (product: HomeProduct) => {
    setQuantities((current) => ({
      ...current,
      [product.id]: (current[product.id] ?? 0) + 1
    }));

    const cartItem: CartItem = {
      id: product.id,
      productId: product.id,
      productName: product.name,
      brand: "Nấu Smart Grocery",
      category: product.category,
      quantity: 1,
      unit: product.detail,
      estimatedPrice: product.price,
      sourceIngredient: product.name,
      image: product.image.src,
      source: "catalog"
    };

    addItems([cartItem]);
    setCartMessage("Đã thêm vào giỏ hàng ✓");
  };

  const decreaseQuantity = (productId: string) => {
    setQuantities((current) => {
      const nextQuantity = Math.max((current[productId] ?? 0) - 1, 0);
      const next = { ...current };

      if (nextQuantity === 0) {
        delete next[productId];
        removeItem(productId);
      } else {
        next[productId] = nextQuantity;
        updateQuantity(productId, nextQuantity);
      }

      return next;
    });
  };

  const toggleSection = (section: HomeProductSection) => {
    setExpandedSections((current) => {
      const next = new Set(current);

      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }

      return next;
    });
  };

  const replayOnboarding = (target?: string) => {
    window.dispatchEvent(new CustomEvent("nau-smart-grocery:replay-onboarding", { detail: { target } }));
  };

  const updateDeliveryAddress = (nextAddress: string) => {
    const trimmedAddress = nextAddress.trim();

    if (!trimmedAddress) {
      return;
    }

    saveDeliveryAddress(trimmedAddress);
    setDeliveryAddress(trimmedAddress);
  };

  const chooseDeliveryAddress = () => {
    const nextAddress = window.prompt(
      "Nhập địa chỉ giao hàng của bạn:",
      deliveryAddress === DEFAULT_DELIVERY_ADDRESS ? "" : deliveryAddress
    );

    if (!nextAddress) {
      return;
    }

    updateDeliveryAddress(nextAddress);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FFF1AF] text-black">
      {cartMessage ? (
        <div className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-black shadow-lg">
          {cartMessage}
        </div>
      ) : null}

      <HomeMobileLayout
        categories={homeCategories}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        popularProducts={popularProducts}
        bestDealProducts={bestDealProducts}
        categoryProducts={categoryProducts}
        searchResultProducts={searchResultProducts}
        activeCategoryLabel={activeCategoryLabel}
        favoriteIds={favoriteIds}
        quantities={quantities}
        onSelectCategory={setActiveCategory}
        onSearchChange={setSearchQuery}
        onToggleFavorite={toggleFavorite}
        onAddToCart={addProductToCart}
        onDecreaseQuantity={decreaseQuantity}
        expandedSections={expandedSections}
        onToggleSection={toggleSection}
        deliveryAddress={deliveryAddress}
        onUpdateDeliveryAddress={updateDeliveryAddress}
        onReplayOnboarding={replayOnboarding}
      />

      <HomeDesktopLayout
        categories={homeCategories}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        popularProducts={popularProducts}
        bestDealProducts={bestDealProducts}
        categoryProducts={categoryProducts}
        searchResultProducts={searchResultProducts}
        activeCategoryLabel={activeCategoryLabel}
        favoriteIds={favoriteIds}
        quantities={quantities}
        onSelectCategory={setActiveCategory}
        onSearchChange={setSearchQuery}
        onToggleFavorite={toggleFavorite}
        onAddToCart={addProductToCart}
        onDecreaseQuantity={decreaseQuantity}
        expandedSections={expandedSections}
        onToggleSection={toggleSection}
        deliveryAddress={deliveryAddress}
        onChooseDeliveryAddress={chooseDeliveryAddress}
        onReplayOnboarding={replayOnboarding}
      />

      <OnboardingTour />
    </div>
  );
}
