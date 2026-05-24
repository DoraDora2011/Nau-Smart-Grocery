"use client";

import Image from "next/image";
import { ArrowRight, Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import logoMascot from "@/assets/brand_logo/logo-mascot-bigsize.png";
import { AppImageButton } from "@/components/AppImageButton";
import { useLanguage } from "@/components/providers/language-provider";
import { uiLabels } from "@/lib/i18n/ui-labels";

type RecipeChatMessage = {
  id: string;
  type: "user" | "recipe";
  text: string;
};

type SpeechRecognitionResultEvent = {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
};

type SpeechRecognitionErrorEvent = {
  error?: string;
};

type BrowserSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  }
}

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
  const { locale } = useLanguage();
  const labels = uiLabels[locale].recipeMobile;
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const hasDishText = dishName.trim().length > 0;
  const hasChatHistory = chatMessages.length > 0;
  const shouldShowGuide = hasChatHistory || (hasSubmittedChat && hasDishText);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceMessage(labels.voiceUnsupported);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = locale === "vi" ? "vi-VN" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceMessage(labels.listening);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();

      if (transcript) {
        onDishNameChange(dishName.trim() ? `${dishName.trim()} ${transcript}` : transcript);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setVoiceMessage(
        event.error === "not-allowed" || event.error === "service-not-allowed"
          ? labels.micPermission
          : labels.voiceUnsupported
      );
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      setVoiceMessage((current) => (current === labels.listening ? "" : current));
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceMessage(labels.voiceUnsupported);
    }
  };

  return (
    <section className="fixed inset-0 z-0 min-h-[100dvh] overflow-hidden bg-[#FFF1AF] px-6 pt-[4.75rem] text-black lg:hidden">
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
        <div className="space-y-8">
          {hasChatHistory ? (
            <div className="max-h-[46dvh] space-y-5 overflow-y-auto pr-1">
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
                      alt={labels.mascotAlt}
                      className="h-14 w-14 shrink-0 object-contain"
                    />
                    <button
                      type="button"
                      onClick={onOpenFilter}
                      className="min-h-14 flex-1 rounded-3xl bg-white px-4 py-3 text-left text-sm font-bold leading-5 shadow-sm"
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
              <Image src={logoMascot} alt={labels.mascotAlt} className="h-14 w-14 shrink-0 object-contain" priority />
              <button
                type="button"
                onClick={onOpenFilter}
                className="flex min-h-11 flex-1 items-center justify-between rounded-full bg-white px-4 text-sm font-bold"
              >
                {labels.guideCta}
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <Image src={logoMascot} alt={labels.mascotAlt} className="h-14 w-14 shrink-0 object-contain" priority />
            <div className="flex flex-1 flex-col gap-2">
              <label className="flex min-h-14 items-center gap-3 rounded-full border-2 border-black bg-white px-4 shadow-sm">
              <input
                value={dishName}
                onChange={(event) => onDishNameChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onSubmitChat();
                  }
                }}
                placeholder={labels.placeholder}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-black outline-none placeholder:text-black/70"
              />
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  aria-label={labels.voiceInput}
                  className={`shrink-0 rounded-full p-1 transition lg:hidden ${
                    isListening ? "animate-pulse bg-[#FFE76A] text-black" : "text-black"
                  }`}
                >
                <Mic className="h-7 w-7" />
                </button>
              </label>
              {voiceMessage ? <p className="px-4 text-xs font-bold text-black/70">{voiceMessage}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
