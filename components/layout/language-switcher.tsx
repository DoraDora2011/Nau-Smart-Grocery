"use client";

import { Languages } from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";
import type { Locale } from "@/lib/i18n/translations";

export function LanguageSwitcher() {
  const { locale, setLocale, dictionary } = useLanguage();

  return (
    <label className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-ink)] ring-1 ring-[var(--color-border)]">
      <Languages className="h-4 w-4 text-[var(--color-ink-soft)]" />
      <span className="hidden sm:inline">{dictionary.header.language}</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="bg-transparent text-sm font-semibold outline-none"
        aria-label={dictionary.header.language}
      >
        <option value="vi">{dictionary.languages.vi}</option>
        <option value="en">{dictionary.languages.en}</option>
      </select>
    </label>
  );
}
