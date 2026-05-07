"use client";

import { Search, X } from "lucide-react";

import { AppImageButton } from "@/components/AppImageButton";

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

interface RecipeHistoryDrawerMobileProps {
  open: boolean;
  history: RecipeHistoryItem[];
  onClose: () => void;
  onSelectItem: (item: RecipeHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onDeleteGroup: (dateKey: string) => void;
  onClearHistory: () => void;
}

function formatHistoryDate(dateValue: string) {
  const date = new Date(dateValue);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return "Hôm nay";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric"
  }).format(date);
}

function groupHistoryByDate(history: RecipeHistoryItem[]) {
  return history.reduce<Array<{ dateKey: string; label: string; items: RecipeHistoryItem[] }>>(
    (groups, item) => {
      const dateKey = new Date(item.createdAt).toDateString();
      const existingGroup = groups.find((group) => group.dateKey === dateKey);

      if (existingGroup) {
        existingGroup.items.push(item);
        return groups;
      }

      groups.push({
        dateKey,
        label: formatHistoryDate(item.createdAt),
        items: [item]
      });

      return groups;
    },
    []
  );
}

export function RecipeHistoryDrawerMobile({
  open,
  history,
  onClose,
  onSelectItem,
  onDeleteItem,
  onDeleteGroup,
  onClearHistory
}: RecipeHistoryDrawerMobileProps) {
  const groupedHistory = groupHistoryByDate(history);
  const hasHistory = history.length > 0;

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/25 text-black backdrop-blur-[1px] lg:hidden">
      <button
        type="button"
        aria-label="Đóng lịch sử tìm kiếm"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <aside className="relative flex h-[100dvh] w-[70vw] max-w-[294px] flex-col overflow-hidden rounded-r-[28px] bg-white shadow-2xl">
        <div className="px-6 pt-6">
          <AppImageButton
            buttonId="button-007"
            size={56}
            className="flex h-14 w-14 items-center justify-center rounded-full"
          />
        </div>

        <div className="mt-3 flex min-h-11 items-center justify-between bg-gradient-to-r from-[#cd6cfd] via-[#f3d6ff] to-white px-8">
          <h2 className="text-2xl font-black">Lịch sử tìm kiếm</h2>
          {hasHistory ? (
            <button
              type="button"
              onClick={onClearHistory}
              className="rounded-full bg-white/70 px-3 py-1 text-xs font-black"
            >
              Xoá tất cả
            </button>
          ) : null}
        </div>

        <div className="px-6 py-5">
          <div className="flex h-12 items-center justify-end rounded-full bg-gradient-to-r from-[#ffe467] to-[#d7fdd9] px-4">
            <Search className="h-7 w-7" />
          </div>
        </div>

        {hasHistory ? (
          <div className="min-h-0 flex-1 overflow-y-auto pb-8">
            {groupedHistory.map((group) => (
              <section key={group.dateKey}>
                <div className="flex h-[55px] items-center justify-between bg-gradient-to-r from-[#d7fdd9] to-[#ffe467] px-5 py-3">
                  <h3 className="text-xl font-black">{group.label}</h3>
                  <button
                    type="button"
                    onClick={() => onDeleteGroup(group.dateKey)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-black"
                    aria-label={`Xoá lịch sử ${group.label}`}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="bg-white py-2">
                  {group.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 px-5 py-3">
                      <button
                        type="button"
                        onClick={() => onSelectItem(item)}
                        className="min-w-0 flex-1 truncate text-left text-base font-bold"
                      >
                        {item.text}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-black"
                        aria-label={`Xoá ${item.text} khỏi lịch sử`}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="flex-1 bg-white" />
        )}
      </aside>
    </div>
  );
}
