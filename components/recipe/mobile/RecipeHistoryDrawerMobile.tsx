"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useMemo, useState } from "react";

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

type PendingDeleteAction =
  | {
      type: "item";
      itemId: string;
    }
  | {
      type: "group";
      dateKey: string;
    }
  | {
      type: "all";
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

function normalizeSearchText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
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
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingDeleteAction, setPendingDeleteAction] = useState<PendingDeleteAction | null>(null);
  const normalizedSearchQuery = normalizeSearchText(searchQuery);
  const filteredHistory = useMemo(() => {
    if (!normalizedSearchQuery) {
      return history;
    }

    return history.filter((item) => normalizeSearchText(item.text).includes(normalizedSearchQuery));
  }, [history, normalizedSearchQuery]);
  const groupedHistory = groupHistoryByDate(filteredHistory);
  const hasHistory = history.length > 0;
  const hasVisibleHistory = groupedHistory.length > 0;

  const handleConfirmDelete = () => {
    if (!pendingDeleteAction) {
      return;
    }

    if (pendingDeleteAction.type === "item") {
      onDeleteItem(pendingDeleteAction.itemId);
    }

    if (pendingDeleteAction.type === "group") {
      onDeleteGroup(pendingDeleteAction.dateKey);
    }

    if (pendingDeleteAction.type === "all") {
      onClearHistory();
    }

    setPendingDeleteAction(null);
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black/25 text-black backdrop-blur-[1px] lg:hidden">
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

        <div className="px-6 pt-14">
          <h2 className="text-xl font-black leading-tight">Lịch sử tìm kiếm</h2>
        </div>

        <div className="px-5 pb-6 pt-5">
          <label className="flex h-7 items-center rounded-full bg-[#FFE467] px-3">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder=""
              aria-label="Tìm kiếm lịch sử"
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-black outline-none placeholder:text-black/50"
            />
            <Image
              src="/assets/buttons/search-button-001.png"
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
          </label>
        </div>

        {hasVisibleHistory ? (
          <div className="min-h-0 flex-1 overflow-y-auto pb-24">
            {groupedHistory.map((group) => (
              <section key={group.dateKey}>
                <div className="flex h-[55px] items-center justify-between bg-[#D7FDD9] px-5 py-3">
                  <h3 className="text-lg font-black leading-tight">{group.label}</h3>
                  <button
                    type="button"
                    onClick={() => setPendingDeleteAction({ type: "group", dateKey: group.dateKey })}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-black"
                    aria-label={`Xoá lịch sử ${group.label}`}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="bg-white py-3">
                  {group.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => onSelectItem(item)}
                        className="min-w-0 flex-1 truncate text-left text-sm font-bold"
                      >
                        {item.text}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDeleteAction({ type: "item", itemId: item.id })}
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
          <div className="flex-1 bg-white px-6 py-6 text-sm font-bold text-black/60">
            {hasHistory ? "Không tìm thấy lịch sử phù hợp." : ""}
          </div>
        )}

        {hasHistory ? (
          <button
            type="button"
            onClick={() => setPendingDeleteAction({ type: "all" })}
            className="absolute inset-x-0 bottom-0 flex min-h-14 items-center bg-[#D9D9D9] px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 text-left text-[13px] font-bold leading-tight"
          >
            Xoá tất cả lịch sử tìm kiếm
          </button>
        ) : null}

      </aside>

      {pendingDeleteAction ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 px-6">
          <div className="w-full max-w-[348px] overflow-hidden rounded-[28px] border-2 border-black bg-white text-center text-black">
            <div className="flex min-h-[142px] items-center justify-center px-8">
              <p className="text-sm font-bold leading-6">
                {pendingDeleteAction.type === "all"
                  ? "Xác nhận bạn muốn xoá toàn bộ lịch sử tìm kiếm"
                  : "Xác nhận bạn muốn xoá hoạt động này"}
              </p>
            </div>
            <div className="grid grid-cols-2 border-t-2 border-black">
              <button
                type="button"
                onClick={() => setPendingDeleteAction(null)}
                className="min-h-14 border-r border-black text-sm font-bold"
              >
                Không
              </button>
              <button type="button" onClick={handleConfirmDelete} className="min-h-14 text-sm font-bold">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
