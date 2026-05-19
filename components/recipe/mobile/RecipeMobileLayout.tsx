"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { RecipeFilterSheetMobile } from "@/components/recipe/mobile/RecipeFilterSheetMobile";
import { RecipeHistoryDrawerMobile } from "@/components/recipe/mobile/RecipeHistoryDrawerMobile";
import { RecipeInputMobile } from "@/components/recipe/mobile/RecipeInputMobile";
import { RecipeMobileBottomNav } from "@/components/recipe/mobile/RecipeMobileBottomNav";
import { RecipeResultMobile } from "@/components/recipe/mobile/RecipeResultMobile";

type RecipeIngredient = {
  name: string;
  amount: string;
  alternatives?: string[];
};

type RecipeResult = {
  isSafe?: boolean;
  dish: string;
  servings: number;
  allergyWarnings?: string[];
  conflictingIngredients?: string[];
  saferAlternatives?: string[];
  ingredients?: RecipeIngredient[];
  steps?: string[];
};

type RecipeChatMessage = {
  id: string;
  type: "user" | "recipe";
  text: string;
};

type RecipeHistoryItem = {
  id: string;
  text: string;
  createdAt: string;
  servings?: number;
  allergiesText?: string;
  hasAllergy?: boolean;
  recipe?: RecipeResult;
  reviewIngredients?: RecipeIngredient[];
};

interface RecipeMobileLayoutProps {
  dishName: string;
  hasSubmittedChat: boolean;
  chatMessages: RecipeChatMessage[];
  historyOpen: boolean;
  searchHistory: RecipeHistoryItem[];
  servings: number;
  allergiesText: string;
  hasAllergy: boolean;
  isFilterOpen: boolean;
  recipe: RecipeResult | null;
  reviewIngredients: RecipeIngredient[];
  loading: boolean;
  cartLoading: boolean;
  cartMessage: string | null;
  isUnsafe: boolean;
  onDishNameChange: (value: string) => void;
  onSubmitChat: () => void;
  onHistoryOpenChange: (value: boolean) => void;
  onSelectHistoryItem: (item: RecipeHistoryItem) => void;
  onDeleteHistoryItem: (id: string) => void;
  onDeleteHistoryGroup: (dateKey: string) => void;
  onClearHistory: () => void;
  onServingsChange: (value: number) => void;
  onAllergiesTextChange: (value: string) => void;
  onHasAllergyChange: (value: boolean) => void;
  onFilterOpenChange: (value: boolean) => void;
  onConfirm: () => void;
  onBack: () => void;
  isConflictingIngredient: (ingredientName: string) => boolean;
  onRemoveIngredient: (ingredientName: string) => void;
  onAddReviewedIngredientsToCart: () => void;
  isRecipeFavorite: boolean;
  onToggleRecipeFavorite: () => void;
}

export function RecipeMobileLayout({
  dishName,
  hasSubmittedChat,
  chatMessages,
  historyOpen,
  searchHistory,
  servings,
  allergiesText,
  hasAllergy,
  isFilterOpen,
  recipe,
  reviewIngredients,
  loading,
  cartLoading,
  cartMessage,
  isUnsafe,
  onDishNameChange,
  onSubmitChat,
  onHistoryOpenChange,
  onSelectHistoryItem,
  onDeleteHistoryItem,
  onDeleteHistoryGroup,
  onClearHistory,
  onServingsChange,
  onAllergiesTextChange,
  onHasAllergyChange,
  onFilterOpenChange,
  onConfirm,
  onBack,
  isConflictingIngredient,
  onRemoveIngredient,
  onAddReviewedIngredientsToCart,
  isRecipeFavorite,
  onToggleRecipeFavorite
}: RecipeMobileLayoutProps) {
  const [isResultCollapsed, setIsResultCollapsed] = useState(false);

  useEffect(() => {
    if (recipe) {
      setIsResultCollapsed(false);
    }
  }, [recipe]);

  return (
    <div className="min-h-[100dvh] bg-[#FFF1AF] lg:hidden">
      {recipe && !isResultCollapsed ? (
        <RecipeResultMobile
          recipe={recipe}
          reviewIngredients={reviewIngredients}
          isUnsafe={isUnsafe}
          cartLoading={cartLoading}
          cartMessage={cartMessage}
          isConflictingIngredient={isConflictingIngredient}
          onRemoveIngredient={onRemoveIngredient}
          onAddReviewedIngredientsToCart={onAddReviewedIngredientsToCart}
          isRecipeFavorite={isRecipeFavorite}
          onToggleRecipeFavorite={onToggleRecipeFavorite}
          onCollapse={() => setIsResultCollapsed(true)}
        />
      ) : (
        <RecipeInputMobile
          dishName={dishName}
          hasSubmittedChat={hasSubmittedChat}
          chatMessages={chatMessages}
          onDishNameChange={onDishNameChange}
          onOpenFilter={() => {
            if (recipe) {
              setIsResultCollapsed(false);
              return;
            }

            onFilterOpenChange(true);
          }}
          onSubmitChat={onSubmitChat}
          onHistoryOpen={() => onHistoryOpenChange(true)}
          onBack={onBack}
        />
      )}

      {loading && !isFilterOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-black text-black">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Đang tạo công thức...
          </div>
        </div>
      ) : null}

      <RecipeFilterSheetMobile
        open={isFilterOpen}
        servings={servings}
        allergiesText={allergiesText}
        hasAllergy={hasAllergy}
        isLoading={loading}
        onServingsChange={onServingsChange}
        onAllergiesTextChange={onAllergiesTextChange}
        onHasAllergyChange={onHasAllergyChange}
        onClose={() => onFilterOpenChange(false)}
        onConfirm={onConfirm}
      />

      <RecipeHistoryDrawerMobile
        open={historyOpen}
        history={searchHistory}
        onClose={() => onHistoryOpenChange(false)}
        onSelectItem={onSelectHistoryItem}
        onDeleteItem={onDeleteHistoryItem}
        onDeleteGroup={onDeleteHistoryGroup}
        onClearHistory={onClearHistory}
      />

      <RecipeMobileBottomNav />
    </div>
  );
}
