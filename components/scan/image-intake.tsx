"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Camera, ImagePlus, ScanLine } from "lucide-react";

import { AppImageButton } from "@/components/AppImageButton";
import type { ScanInputSource } from "@/types";

interface ImageIntakeProps {
  selectedFile: File | null;
  previewUrl: string | null;
  onFileChange: (file: File | null, source: ScanInputSource) => void;
  onClear: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  errorMessage: string | null;
}

export function ImageIntake({
  selectedFile,
  previewUrl,
  onFileChange,
  onClear,
  onSubmit,
  isLoading,
  errorMessage,
}: ImageIntakeProps) {
  const [isMobile, setIsMobile] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const primarySource: ScanInputSource = isMobile ? "camera" : "upload";

  const resetInputs = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }

    if (uploadInputRef.current) {
      uploadInputRef.current.value = "";
    }
  };

  const openPicker = (source: ScanInputSource) => {
    resetInputs();

    if (source === "camera") {
      cameraInputRef.current?.click();
      return;
    }

    uploadInputRef.current?.click();
  };

  const handleScanButton = () => {
    if (!selectedFile) {
      openPicker(primarySource);
      return;
    }

    onSubmit();
  };

  return (
    <section className="flex min-h-[100dvh] flex-col justify-between bg-[#ebf1a0] px-8 pb-36 pt-28 text-black lg:min-h-[calc(100dvh-2rem)] lg:rounded-[42px] lg:px-14 lg:pb-20">
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;
          onFileChange(file, "camera");
        }}
      />
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;
          onFileChange(file, "upload");
        }}
      />

      <button
        type="button"
        onClick={() => openPicker(primarySource)}
        className="mx-auto w-full max-w-[680px] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-8 focus-visible:outline-[#cd6cfd]"
        aria-label="Chọn ảnh nguyên liệu để quét"
      >
        <div className="relative mx-auto aspect-[0.96] max-h-[48dvh] min-h-[310px] w-full overflow-hidden rounded-[80px] bg-[#f6f3d5] shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Ảnh nguyên liệu đã chọn"
              width={1200}
              height={1200}
              unoptimized
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center text-black/45">
              <ImagePlus className="h-16 w-16" />
              <p className="text-base font-black leading-snug sm:text-xl">Chạm để chọn hoặc chụp ảnh</p>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0">
            <div
              className={`absolute left-0 right-0 h-2 rounded-full bg-[#cd6cfd] shadow-[0_0_18px_rgba(205,108,253,0.78)] ${
                previewUrl ? "animate-[scan-sweep_2.2s_ease-in-out_infinite]" : "top-1/2 -translate-y-1/2"
              }`}
            />
            <div className="absolute left-0 top-0 h-[26%] w-[30%] rounded-tl-[80px] border-l-[8px] border-t-[8px] border-[#cd6cfd]" />
            <div className="absolute right-0 top-0 h-[26%] w-[30%] rounded-tr-[80px] border-r-[8px] border-t-[8px] border-[#cd6cfd]" />
            <div className="absolute bottom-0 left-0 h-[26%] w-[30%] rounded-bl-[80px] border-b-[8px] border-l-[8px] border-[#cd6cfd]" />
            <div className="absolute bottom-0 right-0 h-[26%] w-[30%] rounded-br-[80px] border-b-[8px] border-r-[8px] border-[#cd6cfd]" />
          </div>
        </div>
      </button>

      <div className="mx-auto mt-10 w-full max-w-[680px] text-center">
        <p className="text-lg font-black leading-snug text-black/40 sm:text-2xl">
          Đưa nguyên liệu vào khung quét rồi nhấn chụp
        </p>
        {selectedFile ? (
          <p className="mt-2 truncate text-sm font-bold text-black/45">{selectedFile.name}</p>
        ) : null}
        {errorMessage ? (
          <p className="mt-4 rounded-3xl bg-white px-5 py-3 text-sm font-bold text-[#9a3f2f] shadow-sm">
            {errorMessage}
          </p>
        ) : null}
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-[680px] items-center justify-between">
        <AppImageButton
          buttonId="button-008"
          onClick={() => openPicker("upload")}
          size={96}
          className="flex h-24 w-24 items-center justify-center transition active:scale-95 lg:h-28 lg:w-28"
        />

        <button
          type="button"
          onClick={handleScanButton}
          disabled={isLoading}
          className="flex min-h-20 min-w-20 flex-col items-center justify-center gap-1 rounded-[34px] border-[3px] border-black bg-white px-3 text-center text-black shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition active:scale-95 disabled:opacity-60 sm:min-h-24 sm:min-w-24 sm:px-4 lg:min-h-28 lg:min-w-36"
          aria-label={selectedFile ? "Phân tích ảnh nguyên liệu" : "Chọn ảnh để quét"}
        >
          {selectedFile ? (
            <ScanLine className={`h-8 w-8 ${isLoading ? "animate-pulse" : ""}`} />
          ) : (
            <Camera className="h-8 w-8" />
          )}
          <span className="text-xs font-black leading-tight">
            {isLoading ? "Đang phân tích" : selectedFile ? "Phân tích nguyên liệu" : "Chụp ảnh"}
          </span>
        </button>

        {previewUrl ? (
          <button
            type="button"
            onClick={() => {
              resetInputs();
              onClear();
            }}
            className="sr-only"
          >
            Xóa ảnh
          </button>
        ) : null}
      </div>
    </section>
  );
}
