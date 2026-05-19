"use client";

import Image from "next/image";
import { ArrowRight, Mic, Utensils } from "lucide-react";

import logoMascot from "@/assets/brand_logo/logo-mascot.png";
import { AppImageButton } from "@/components/AppImageButton";

type RecipeChatMessage = {
  id: string;
  type: "user" | "recipe";
  text: string;
};

interface RecipeInputMobileProps {
  dishName: string;
  hasSubmittedChat: boolean;
  chatMessages: RecipeChatMessage[];
  onDishNameChange: (value: string) => void;
  onOpenFilter: () => void;
  onSubmitChat: () => void;
  onHistoryOpen: () => void;
  onBack: () => void;
}

export function RecipeInputMobile({
  dishName,
  hasSubmittedChat,
  chatMessages,
  onDishNameChange,
  onOpenFilter,
  onSubmitChat,
  onHistoryOpen,
  onBack
}: RecipeInputMobileProps) {
  const hasDishText = dishName.trim().length > 0;
  const hasChatHistory = chatMessages.length > 0;
  const shouldShowGuide = hasChatHistory || (hasSubmittedChat && hasDishText);

  return (
    <section className="fixed inset-0 z-0 min-h-[100dvh] overflow-hidden bg-[#FFF1AF] px-6 pt-6 text-black lg:hidden">
      <div className="flex items-center justify-between">
        <AppImageButton
          buttonId="button-007"
          onClick={onHistoryOpen}
          size={56}
          className="flex h-14 w-14 items-center justify-center rounded-full"
        />
        <AppImageButton
          buttonId="button-009"
          onClick={onBack}
          size={56}
          className="flex h-14 w-14 items-center justify-center rounded-full"
        />
      </div>

      <div className="absolute inset-x-0 bottom-32 px-6">
        <div className="space-y-6">
          {hasChatHistory ? (
            <div className="max-h-[46dvh] space-y-4 overflow-y-auto pr-1">
              {chatMessages.map((message) =>
                message.type === "user" ? (
                  <div key={message.id} className="flex justify-end">
                    <div className="flex min-h-20 w-[72%] items-center rounded-3xl bg-[#edc7ff] px-5 text-sm font-bold shadow-sm">
                      {message.text}
                    </div>
                  </div>
                ) : (
                  <div key={message.id} className="flex items-start gap-3">
                    <Image
                      src={logoMascot}
                      alt="Mascot NÃ¢u"
                      className="mt-1 h-12 w-12 shrink-0 object-contain"
                    />
                    <button
                      type="button"
                      onClick={onOpenFilter}
                      className="min-h-14 flex-1 rounded-3xl border-2 border-black bg-white px-4 py-3 text-left text-sm font-bold leading-5 shadow-sm"
                    >
                      {message.text}
                    </button>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="min-h-20">
              {hasSubmittedChat && hasDishText ? (
                <div className="flex justify-end">
                  <div className="flex min-h-20 w-[72%] items-center rounded-3xl bg-[#edc7ff] px-5 text-sm font-bold">
                    {dishName}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {shouldShowGuide ? (
            <div className="flex items-center gap-3">
              <Image src={logoMascot} alt="Mascot Nâu" className="h-16 w-16 object-contain" priority />
              <button
                type="button"
                onClick={onOpenFilter}
                className="flex min-h-11 flex-1 items-center justify-between rounded-full border-2 border-black bg-white px-4 text-sm font-bold"
              >
                Xem hướng dẫn nấu ăn ở đây
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <Image src={logoMascot} alt="Mascot Nâu" className="h-14 w-14 object-contain" priority />
            <label className="flex min-h-14 flex-1 items-center gap-3 rounded-full border-2 border-black bg-white px-4 shadow-sm">
              <Utensils className="h-7 w-7 shrink-0" />
              <input
                value={dishName}
                onChange={(event) => onDishNameChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onSubmitChat();
                  }
                }}
                placeholder="Nhập món ăn ở đây..."
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-black outline-none placeholder:text-black/70"
              />
              <button type="button" onClick={onSubmitChat} aria-label="Gửi món ăn">
                <Mic className="h-7 w-7" />
              </button>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
