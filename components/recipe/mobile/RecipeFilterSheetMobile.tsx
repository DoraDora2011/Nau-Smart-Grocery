"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Keyboard } from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";
import { uiLabels } from "@/lib/i18n/ui-labels";

interface RecipeFilterSheetMobileProps {
  open: boolean;
  servings: number;
  allergiesText: string;
  hasAllergy: boolean;
  isLoading: boolean;
  onServingsChange: (value: number) => void;
  onAllergiesTextChange: (value: string) => void;
  onHasAllergyChange: (value: boolean) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function RecipeFilterSheetMobile({
  open,
  servings,
  allergiesText,
  hasAllergy,
  isLoading,
  onServingsChange,
  onAllergiesTextChange,
  onHasAllergyChange,
  onClose,
  onConfirm
}: RecipeFilterSheetMobileProps) {
  const { locale } = useLanguage();
  const labels = uiLabels[locale].recipeMobile;
  const dragStartY = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [servingsDraft, setServingsDraft] = useState(String(servings));

  useEffect(() => {
    setServingsDraft(String(servings));
  }, [servings]);

  if (!open) {
    return null;
  }

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    dragStartY.current = event.clientY;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (dragStartY.current === null) {
      return;
    }

    setDragY(Math.max(0, event.clientY - dragStartY.current));
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsDragging(false);

    if (dragY > 72) {
      onClose();
    }

    dragStartY.current = null;
    setDragY(0);
  };

  const commitServingsDraft = () => {
    const nextServings = Math.max(1, Number(servingsDraft) || servings || 1);

    setServingsDraft(String(nextServings));
    onServingsChange(nextServings);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden">
      <button type="button" className="absolute inset-0" aria-label={labels.closeFilter} onClick={onClose} />

      <section
        className="absolute inset-x-0 bottom-0 min-h-[66dvh] rounded-t-[32px] bg-white px-6 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-3 text-black shadow-[0_-22px_56px_rgba(0,0,0,0.2)]"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? "none" : "transform 180ms ease-out"
        }}
      >
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="mx-auto block h-6 w-24 touch-none rounded-full"
          aria-label={labels.dragClose}
        >
          <span className="mx-auto mt-2 block h-1.5 w-16 rounded-full bg-black/35" />
        </button>
        <h2 className="mt-5 text-[26px] font-black leading-tight">{labels.filterTitle}</h2>

        <div className="mt-9 space-y-8">
          <div>
            <div className="rounded-full bg-[linear-gradient(90deg,#ffffff_0%,#f2d8ff_46%,#cd6cfd_100%)] px-5 py-4 text-sm font-black shadow-sm">
              {labels.servings}
            </div>
            <div className="mt-5 inline-flex items-center gap-4 rounded-full bg-[#cd6cfd] px-4 py-2 text-lg font-black shadow-sm">
              <button
                type="button"
                onClick={() => onServingsChange(Math.max(1, servings - 1))}
                aria-label={labels.decreaseServings}
              >
                -
              </button>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                value={servingsDraft}
                onChange={(event) => {
                  const nextDraft = event.target.value;

                  setServingsDraft(nextDraft);

                  if (nextDraft) {
                    onServingsChange(Math.max(1, Number(nextDraft) || 1));
                  }
                }}
                onBlur={commitServingsDraft}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }
                }}
                aria-label={labels.inputServings}
                className="w-10 rounded-full bg-white/24 px-1 text-center text-lg font-black leading-none outline-none focus:bg-white/45"
              />
              <button
                type="button"
                onClick={() => onServingsChange(servings + 1)}
                aria-label={labels.increaseServings}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-full bg-[linear-gradient(90deg,#ffffff_0%,#f2d8ff_46%,#cd6cfd_100%)] px-5 py-4 shadow-sm">
            <span className="text-sm font-black">{labels.allergyQuestion}</span>
            <button
              type="button"
              onClick={() => onHasAllergyChange(!hasAllergy)}
              className="flex h-6 w-12 items-center rounded-full bg-white px-1 shadow-inner"
              aria-label={labels.allergyToggle}
            >
              <span
                className={`h-4 w-4 rounded-full bg-[#ffe467] transition ${
                  hasAllergy ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {hasAllergy ? (
            <label className="block rounded-2xl border-2 border-black bg-white p-3">
              <Keyboard className="h-5 w-5" />
              <textarea
                value={allergiesText}
                onChange={(event) => onAllergiesTextChange(event.target.value)}
                placeholder={labels.allergyPlaceholder}
                className="mt-3 min-h-32 w-full resize-none bg-transparent text-sm font-semibold outline-none"
              />
            </label>
          ) : null}
        </div>

        <div className="mt-10 flex justify-end">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-full bg-black px-7 py-4 text-lg font-bold text-white shadow-lg disabled:opacity-60"
          >
            {isLoading ? labels.creatingShort : labels.confirm}
          </button>
        </div>
      </section>
    </div>
  );
}
