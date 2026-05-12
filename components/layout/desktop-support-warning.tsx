"use client";

import { AlertTriangle } from "lucide-react";

/*
 * TEMP_DESKTOP_SUPPORT_WARNING
 * Codex removal command after desktop UI is ready:
 * "Remove TEMP_DESKTOP_SUPPORT_WARNING only: delete components/layout/desktop-support-warning.tsx,
 * then remove its import and <DesktopSupportWarning /> render from components/layout/app-shell.tsx.
 * Do not modify any product logic or page components."
 */
export function DesktopSupportWarning() {
  return (
    <div
      className="fixed inset-0 z-[2147483647] hidden items-center justify-center bg-gray-200/70 px-5 backdrop-blur-md md:flex"
      aria-modal="true"
      role="dialog"
      aria-labelledby="desktop-support-warning-title"
    >
      <div className="flex aspect-square w-full max-w-[360px] flex-col items-center justify-center rounded-xl bg-white px-8 text-center text-black outline outline-2 outline-black shadow-[inset_0_0_0_2px_#000,0_24px_80px_rgba(0,0,0,0.18)]">
        <AlertTriangle
          className="mb-5 h-16 w-16 text-orange-500"
          aria-hidden="true"
          strokeWidth={2.4}
        />
        <h2
          id="desktop-support-warning-title"
          className="text-2xl font-semibold leading-tight"
        >
          Website chưa hỗ trợ Desktop
        </h2>
        <p className="mt-4 text-base leading-6">
          Vui lòng bấm F12 và chuyển sang giao diện điện thoại để tiếp tục sử
          dụng.
        </p>
        <p className="mt-4 text-sm leading-5">
          Phiên bản Desktop sẽ được cập nhật hoàn thiện sau ngày 22/05/2026.
        </p>
      </div>
    </div>
  );
}
