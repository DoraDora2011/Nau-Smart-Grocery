"use client";

import { Languages } from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";
import type { Locale } from "@/lib/i18n/translations";
import { playUiSound } from "@/lib/utils/ui-sounds";

export function LanguageSwitcher() {
  const { locale, setLocale, dictionary } = useLanguage();

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full bg-white/90 p-1 text-sm text-black shadow-sm ring-1 ring-black/10 backdrop-blur"
      aria-label={dictionary.header.language}
      title={dictionary.header.language}
    >
      <Languages className="ml-2 h-4 w-4 text-black/55" />
      {(["vi", "en"] as Locale[]).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => {
            playUiSound("tap");
            setLocale(item);
          }}
          className={`min-w-9 rounded-full px-2.5 py-1.5 text-xs font-black leading-none transition ${
            locale === item ? "bg-[#ffe467] text-black" : "text-black/60 hover:bg-black/5"
          }`}
          aria-pressed={locale === item}
        >
          {item === "vi" ? dictionary.languages.shortVi : dictionary.languages.shortEn}
        </button>
      ))}
    </div>
  );
}
