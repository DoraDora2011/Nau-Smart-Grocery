import type { Metadata } from "next";
import localFont from "next/font/local";

import { AppLoadingOverlay } from "@/components/layout/app-loading-overlay";
import { AppShell } from "@/components/layout/app-shell";
import { CartProvider } from "@/components/providers/cart-provider";
import { FavoriteProvider } from "@/components/providers/favorite-provider";
import { LanguageProvider } from "@/components/providers/language-provider";

import "./globals.css";

const appFont = localFont({
  src: "./fonts/DarleySans-Regular.otf",
  variable: "--font-body",
  display: "swap"
});

const headingFont = localFont({
  src: "./fonts/DarleySans-Regular.otf",
  variable: "--font-heading",
  display: "swap"
});

export const metadata: Metadata = {
  title: "N\u1EA5u Smart Grocery",
  description:
    "Website grocery thông minh ưu tiên di động với quét nguyên liệu, gợi ý món ăn, recipe có cấu trúc và mapping grocery deterministic."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${headingFont.variable} ${appFont.variable}`}
      >
        <LanguageProvider>
          <CartProvider>
            <FavoriteProvider>
              <AppShell>{children}</AppShell>
              <AppLoadingOverlay />
            </FavoriteProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
