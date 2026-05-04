"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CookingPot, Camera, Search, ShoppingBasket, Store } from "lucide-react";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils/cn";

export function MobileNav() {
  const pathname = usePathname();
  const { dictionary } = useLanguage();
  const items = [
    { href: "/", label: dictionary.nav.home, icon: CookingPot },
    { href: "/scan", label: dictionary.nav.scan, icon: Camera },
    { href: "/dish", label: dictionary.nav.dish, icon: Search },
    { href: "/shop", label: dictionary.nav.shop, icon: Store },
    { href: "/cart", label: dictionary.nav.cart, icon: ShoppingBasket }
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 mx-auto w-[calc(100%-1.5rem)] max-w-md rounded-[28px] border border-white/70 bg-[rgba(252,248,239,0.92)] p-2 shadow-[0_20px_50px_rgba(24,52,41,0.16)] backdrop-blur md:bottom-6">
      <div className="mb-2 flex justify-end md:hidden">
        <LanguageSwitcher />
      </div>
      <ul className="grid grid-cols-5 gap-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;

          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition-colors",
                  active
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-ink-soft)] hover:bg-white"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
