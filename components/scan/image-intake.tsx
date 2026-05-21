"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type MutableRefObject } from "react";
import { Camera, ImagePlus, Minus, Plus, ScanLine } from "lucide-react";

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
  scanActionRef?: MutableRefObject<(() => void) | null>;
}

type CameraStatus = "idle" | "starting" | "ready" | "unsupported" | "error";

type ZoomState = {
  supported: boolean;
  min: number;
  max: number;
  step: number;
  value: number;
};

type ZoomCapabilities = MediaTrackCapabilities & {
  zoom?: {
    min: number;
    max: number;
    step?: number;
  };
};

type ZoomSettings = MediaTrackSettings & {
  zoom?: number;
};

const DEFAULT_ZOOM_STATE: ZoomState = {
  supported: false,
  min: 1,
  max: 1,
  step: 0.1,
  value: 1,
};

function clampZoom(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ImageIntake({
  selectedFile,
  previewUrl,
  onFileChange,
  onClear,
  onSubmit,
  isLoading,
  errorMessage,
  scanActionRef,
}: ImageIntakeProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("idle");
  const [zoomState, setZoomState] = useState<ZoomState>(DEFAULT_ZOOM_STATE);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const primarySource: ScanInputSource = isMobile ? "camera" : "upload";

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    videoTrackRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setZoomState(DEFAULT_ZOOM_STATE);
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("unsupported");
      return;
    }

    setCameraStatus("starting");

    try {
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
        },
      });
      const video = videoRef.current;
      const [track] = stream.getVideoTracks();

      streamRef.current = stream;
      videoTrackRef.current = track ?? null;

      if (video) {
        video.srcObject = stream;
        await video.play().catch(() => undefined);
      }

      const capabilities = track?.getCapabilities?.() as ZoomCapabilities | undefined;
      const settings = track?.getSettings?.() as ZoomSettings | undefined;
      const zoom = capabilities?.zoom;

      if (zoom && typeof zoom.min === "number" && typeof zoom.max === "number" && zoom.max > zoom.min) {
        const initialZoom = clampZoom(settings?.zoom ?? zoom.min, zoom.min, zoom.max);

        setZoomState({
          supported: true,
          min: zoom.min,
          max: zoom.max,
          step: zoom.step ?? 0.1,
          value: initialZoom,
        });
      } else {
        setZoomState(DEFAULT_ZOOM_STATE);
      }

      setCameraStatus("ready");
    } catch (error) {
      console.warn("Could not start scan camera preview.", error);
      stopCamera();
      setCameraStatus("error");
    }
  }, [stopCamera]);

  useEffect(() => {
    if (!isMobile || selectedFile) {
      stopCamera();
      setCameraStatus(isMobile ? "idle" : "unsupported");
      return;
    }

    void startCamera();

    return () => stopCamera();
  }, [isMobile, selectedFile, startCamera, stopCamera]);

  const applyZoom = async (nextZoom: number) => {
    const track = videoTrackRef.current;
    const normalizedZoom = clampZoom(nextZoom, zoomState.min, zoomState.max);

    setZoomState((current) => ({
      ...current,
      value: normalizedZoom,
    }));

    if (!track || !zoomState.supported) {
      return;
    }

    try {
      await track.applyConstraints({
        advanced: [{ zoom: normalizedZoom }],
      } as unknown as MediaTrackConstraints);
    } catch (error) {
      console.warn("Camera zoom is not available on this device.", error);
      setZoomState((current) => ({
        ...current,
        supported: false,
      }));
    }
  };

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

  const captureCameraFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || cameraStatus !== "ready" || video.videoWidth === 0 || video.videoHeight === 0) {
      openPicker(primarySource);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      openPicker(primarySource);
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.92);
    });

    if (!blob) {
      openPicker(primarySource);
      return;
    }

    const file = new File([blob], `nau-scan-${Date.now()}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });

    onFileChange(file, "camera");
  };

  const handleScanButton = () => {
    if (!selectedFile) {
      if (isMobile && cameraStatus === "ready") {
        void captureCameraFrame();
        return;
      }

      openPicker(primarySource);
      return;
    }

    onSubmit();
  };

  useEffect(() => {
    if (!scanActionRef) {
      return;
    }

    scanActionRef.current = handleScanButton;

    return () => {
      scanActionRef.current = null;
    };
  });

  return (
    <section className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#FFF1AF] px-4 pb-[calc(6.75rem+env(safe-area-inset-bottom))] pt-[clamp(5.25rem,10dvh,6.5rem)] text-black lg:h-auto lg:min-h-[calc(100dvh-2rem)] lg:justify-between lg:overflow-visible lg:rounded-[42px] lg:px-14 lg:pb-20 lg:pt-28">
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
      <canvas ref={canvasRef} className="hidden" />

      <button
        type="button"
        onClick={() => openPicker(primarySource)}
        className="mx-auto w-full max-w-[680px] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-8 focus-visible:outline-[#cd6cfd]"
        aria-label="Chọn ảnh nguyên liệu để quét"
      >
        <div className="relative mx-auto aspect-[0.9] max-h-[min(47dvh,27rem)] min-h-[clamp(17rem,39dvh,24rem)] w-full overflow-hidden rounded-[80px] bg-[#f6f3d5] shadow-[0_18px_40px_rgba(0,0,0,0.08)] lg:aspect-[0.96] lg:max-h-[48dvh] lg:min-h-[310px]">
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
          ) : isMobile && (cameraStatus === "ready" || cameraStatus === "starting") ? (
            <>
              <video
                ref={videoRef}
                muted
                playsInline
                autoPlay
                className="h-full w-full object-cover"
                aria-label="Camera quét nguyên liệu"
              />
              {cameraStatus === "starting" ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#f6f3d5]/80 text-center text-sm font-black text-black/45">
                  Đang mở camera...
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center text-black/45">
              <ImagePlus className="h-16 w-16" />
              <p className="text-base font-black leading-snug sm:text-xl">Chạm để chọn hoặc chụp ảnh</p>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0">
            <div
              className={`absolute left-0 right-0 h-2 rounded-full bg-[#cd6cfd] shadow-[0_0_18px_rgba(205,108,253,0.78)] ${
                previewUrl && isLoading
                  ? "animate-[scan-sweep_2.2s_ease-in-out_infinite]"
                  : "top-1/2 -translate-y-1/2"
              }`}
            />
            <div className="absolute left-0 top-0 h-[26%] w-[30%] rounded-tl-[80px] border-l-[8px] border-t-[8px] border-[#cd6cfd]" />
            <div className="absolute right-0 top-0 h-[26%] w-[30%] rounded-tr-[80px] border-r-[8px] border-t-[8px] border-[#cd6cfd]" />
            <div className="absolute bottom-0 left-0 h-[26%] w-[30%] rounded-bl-[80px] border-b-[8px] border-l-[8px] border-[#cd6cfd]" />
            <div className="absolute bottom-0 right-0 h-[26%] w-[30%] rounded-br-[80px] border-b-[8px] border-r-[8px] border-[#cd6cfd]" />
          </div>
        </div>
      </button>

      {isMobile && !selectedFile ? (
        <div
          className={`mx-auto mt-4 flex w-full max-w-[680px] items-center gap-3 rounded-full bg-white/75 px-4 py-3 shadow-[0_10px_26px_rgba(0,0,0,0.08)] lg:mt-7 ${
            zoomState.supported ? "" : "opacity-55"
          }`}
        >
          <button
            type="button"
            onClick={() => void applyZoom(zoomState.value - zoomState.step)}
            disabled={!zoomState.supported}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black bg-[#f6f3d5] text-black active:scale-95"
            aria-label="Giảm zoom camera"
          >
            <Minus className="h-5 w-5" strokeWidth={3} />
          </button>
          <input
            type="range"
            min={zoomState.supported ? zoomState.min : 1}
            max={zoomState.supported ? zoomState.max : 2}
            step={zoomState.supported ? zoomState.step : 0.1}
            value={zoomState.supported ? zoomState.value : 1}
            onChange={(event) => void applyZoom(Number(event.target.value))}
            disabled={!zoomState.supported}
            className="h-2 flex-1 accent-[#cd6cfd]"
            aria-label={zoomState.supported ? "Điều chỉnh zoom camera" : "Thiết bị chưa hỗ trợ zoom camera"}
          />
          <button
            type="button"
            onClick={() => void applyZoom(zoomState.value + zoomState.step)}
            disabled={!zoomState.supported}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black bg-[#f6f3d5] text-black active:scale-95"
            aria-label="Tăng zoom camera"
          >
            <Plus className="h-5 w-5" strokeWidth={3} />
          </button>
        </div>
      ) : null}

      <div className="mx-auto mt-7 w-full max-w-[680px] text-center lg:mt-12">
        <p className="text-base font-black leading-snug text-black/40 sm:text-lg lg:text-2xl">
          Sắp xếp nguyên liệu rõ ràng để hệ thống nhận diện tốt hơn
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

      <div className="mx-auto mt-auto flex w-full max-w-[680px] items-center justify-between pt-6 lg:mt-14 lg:pt-0">
        <AppImageButton
          buttonId="button-008"
          onClick={() => openPicker("upload")}
          size={72}
          className="flex h-[72px] w-[72px] items-center justify-center transition active:scale-95 lg:h-20 lg:w-20"
        />

        <button
          type="button"
          onClick={handleScanButton}
          disabled={isLoading}
          className="hidden min-h-20 min-w-20 flex-col items-center justify-center gap-1 rounded-[34px] border-[3px] border-black bg-white px-3 text-center text-black shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition active:scale-95 disabled:opacity-60 sm:min-h-24 sm:min-w-24 sm:px-4 lg:flex lg:min-h-28 lg:min-w-36"
          aria-label={selectedFile ? "Phân tích ảnh nguyên liệu" : "Chọn ảnh để quét"}
        >
          {selectedFile ? (
            <ScanLine className={`h-8 w-8 ${isLoading ? "animate-pulse" : ""}`} />
          ) : (
            <Camera className="h-8 w-8" />
          )}
          <span className="text-xs font-black leading-tight">
            {isLoading ? "Đang phân tích" : selectedFile ? "Thử lại" : "Chụp ảnh"}
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
