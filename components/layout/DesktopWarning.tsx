import { TriangleAlert } from "lucide-react";

export function DesktopWarning() {
  return (
    <div
      className="fixed inset-0 z-[300] hidden items-center justify-center overflow-hidden bg-white/50 px-6 backdrop-blur-[10px] lg:flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="desktop-warning-title"
      aria-describedby="desktop-warning-description"
    >
      <section className="flex min-h-[22.5rem] w-full max-w-[22.75rem] flex-col items-center justify-center rounded-[14px] bg-white px-8 py-10 text-center text-black shadow-[0_26px_56px_rgba(0,0,0,0.18)] ring-1 ring-[#d7e1cc]">
        <TriangleAlert className="h-[62px] w-[62px] text-[#ff6500]" strokeWidth={2.5} />

        <h2 id="desktop-warning-title" className="mt-6 text-[26px] font-black leading-[1.08]">
          Website chưa hỗ trợ
          <br />
          Desktop
        </h2>

        <p id="desktop-warning-description" className="mt-5 text-[15px] font-black leading-6">
          Vui lòng bấm F12 và chuyển sang giao diện điện thoại để tiếp tục sử dụng.
        </p>

        <p className="mt-4 text-sm font-black leading-5">
          Phiên bản Desktop sẽ được cập nhật hoàn thiện sau ngày 25/05/2026.
        </p>
      </section>
    </div>
  );
}
