"use client";

import {
  Check,
  ChevronDown,
  ChevronRight,
  Minus,
  PackageCheck,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { AppImageButton } from "@/components/AppImageButton";
import { RecipeMobileBottomNav } from "@/components/recipe/mobile/RecipeMobileBottomNav";
import { useCart } from "@/components/providers/cart-provider";
import logoMascot from "@/assets/brand_logo/logo-mascot-bigsize.png";
import logoText from "@/assets/brand_logo/logo-text.png";
import {
  DEFAULT_DELIVERY_ADDRESS,
  readStoredDeliveryAddress,
  saveDeliveryAddress,
} from "@/lib/utils/delivery-address";
import type { CartItem } from "@/types";

const CHECKOUT_SELECTION_STORAGE_KEY = "nau-smart-grocery:checkout-selection";
const ORDER_PHONE_NUMBER = "028 3776 1300";

const paymentOptions = [
  { id: "cash", label: "Tiền mặt", icon: "/assets/buttons/cash-001.png" },
  { id: "card", label: "Thẻ Ghi nợ/Tín dụng", icon: "/assets/buttons/card-001.png" },
  { id: "bank", label: "Ngân hàng", icon: "/assets/buttons/bank-001.png" },
  { id: "third-party", label: "App thứ ba", icon: "/assets/buttons/momo-001.png" },
] as const;

const voucherOptions = [
  { id: "total-20", label: "20% trên tổng giỏ khi thanh toán", type: "fixed", amount: 50000 },
  { id: "item-5", label: "5% trên từng món khi thanh toán", type: "percent", amount: 0.05 },
  { id: "ship-15", label: "Giảm 15.000đ phí vận chuyển", type: "fixed", amount: 15000 },
] as const;

type PaymentId = (typeof paymentOptions)[number]["id"];
type VoucherId = (typeof voucherOptions)[number]["id"];
type PaymentStatus = "idle" | "processing" | "success";
type OrderView = "checkout" | "final" | "preview";

type OrderSnapshot = {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discountTotal: number;
  paymentTotal: number;
  paymentLabel: string;
  deliveryAddress: string;
  phoneNumber: string;
  selectedVoucherLabels: string[];
  orderCode: string;
  createdAt: string;
  totalQuantity: number;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN").format(Math.max(0, Math.round(value))) + "đ";
}

function shortenText(value: string, maxLength = 18) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}...`;
}

function CheckoutIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d7fdd9] p-1">
      <img src={src} alt={alt} className="h-full w-full object-contain" />
    </span>
  );
}

function CheckoutItemRow({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  item: CartItem;
  onDecrease: (item: CartItem) => void;
  onIncrease: (item: CartItem) => void;
  onRemove: (id: string) => void;
}) {
  const hasImage = Boolean(item.image && !item.image.includes("fallback-product"));

  return (
    <article className="grid grid-cols-[86px_1fr_auto] gap-3 rounded-[22px] bg-white p-2">
      <div className="relative">
        <AppImageButton
          buttonId="button-015"
          onClick={() => onRemove(item.id)}
          size={24}
          className="absolute -left-1 -top-1 z-10 flex h-6 w-6 items-center justify-center"
        />
        <div className="flex h-20 w-20 items-center justify-center rounded-[18px] bg-[#ffe467] p-2">
          {hasImage ? (
            <img src={item.image} alt={item.productName} className="h-full w-full object-contain" />
          ) : (
            <span className="px-1 text-center text-[10px] font-black leading-tight">
              {item.productName}
            </span>
          )}
        </div>
      </div>

      <div className="min-w-0 py-1 text-left">
        <h2 className="line-clamp-2 text-[14px] font-black leading-tight">{item.productName}</h2>
        <p className="mt-0.5 text-[10px] font-bold text-black/70">{item.unit}</p>
        <div className="mt-3 flex h-7 w-[72px] items-center justify-between rounded-full bg-[#6fbd7d] px-2 text-black">
          <button type="button" onClick={() => onDecrease(item)} aria-label={`Giảm ${item.productName}`}>
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-sm font-black">{item.quantity}</span>
          <button type="button" onClick={() => onIncrease(item)} aria-label={`Tăng ${item.productName}`}>
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="self-center whitespace-nowrap text-right text-lg font-black sm:text-xl">
        {formatPrice(item.estimatedPrice * item.quantity)}
      </p>
    </article>
  );
}

function ReadOnlyItemRow({ item }: { item: CartItem }) {
  const hasImage = Boolean(item.image && !item.image.includes("fallback-product"));

  return (
    <article className="grid grid-cols-[78px_1fr_auto] gap-3 rounded-[22px] bg-white p-2">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-[#ffe467] p-2">
        {hasImage ? (
          <img src={item.image} alt={item.productName} className="h-full w-full object-contain" />
        ) : (
          <span className="px-1 text-center text-[10px] font-black leading-tight">
            {item.productName}
          </span>
        )}
      </div>

      <div className="min-w-0 py-1 text-left">
        <h2 className="line-clamp-2 text-[14px] font-black leading-tight">{item.productName}</h2>
        <p className="mt-1 text-[11px] font-bold text-black/70">{item.unit}</p>
        <p className="mt-2 text-xs font-black">Số lượng: {item.quantity}</p>
      </div>

      <p className="self-center whitespace-nowrap text-right text-base font-black">
        {formatPrice(item.estimatedPrice * item.quantity)}
      </p>
    </article>
  );
}

function PaymentLoadingOverlay({ status }: { status: Exclude<PaymentStatus, "idle"> }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/20 px-6 backdrop-blur-[2px]">
      <div className="grid h-[322px] w-full max-w-[378px] place-items-center rounded-[26px] bg-white px-8 py-9 text-center text-black shadow-[0_24px_70px_rgba(0,0,0,0.25)]">
        {status === "processing" ? (
          <>
            <div className="payment-spinner" aria-hidden="true" />
            <p className="text-xl font-black leading-tight sm:text-[26px]">Đang Thanh Toán</p>
          </>
        ) : (
          <>
            <Check className="h-36 w-36 stroke-[#6be17d] stroke-[1.5]" aria-hidden="true" />
            <p className="text-xl font-black leading-tight sm:text-[26px]">Thanh Toán Thành Công</p>
          </>
        )}
      </div>

      <style jsx>{`
        .payment-spinner {
          position: relative;
          width: 148px;
          height: 148px;
          border-radius: 999px;
          background: conic-gradient(
            from -118deg,
            rgba(205, 108, 253, 0) 0deg,
            rgba(205, 108, 253, 0.12) 18deg,
            rgba(205, 108, 253, 0.34) 72deg,
            rgba(205, 108, 253, 0.96) 150deg,
            rgba(205, 108, 253, 0) 151deg,
            rgba(205, 108, 253, 0) 360deg
          );
          animation: payment-spin 0.95s linear infinite;
          transform-origin: center;
        }

        .payment-spinner::before {
          position: absolute;
          inset: 20px;
          border-radius: inherit;
          background: #ffffff;
          content: "";
        }

        @keyframes payment-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

function FinalBillPage({
  order,
  onPreviewOrder,
  onCancelOrder,
}: {
  order: OrderSnapshot;
  onPreviewOrder: () => void;
  onCancelOrder: () => void;
}) {
  return (
    <div className="relative min-h-[100dvh] bg-[#FFF1AF] px-6 pb-36 text-black lg:pb-14">
      <main className="mx-auto max-w-md space-y-14">
        <section className="-mx-6 rounded-b-[38px] bg-[linear-gradient(180deg,#ffffff_0%,#fff6c7_46%,#ffe467_100%)] px-8 pb-7 pt-8 text-center shadow-[0_12px_18px_rgba(0,0,0,0.18)]">
          <img src={logoText.src} alt="Nấu Smart Grocery" className="mx-auto h-24 w-auto object-contain" />
        </section>

        <section className="rounded-[14px] bg-white px-5 py-5 text-[15px] font-bold shadow-sm">
          <div className="grid grid-cols-[1fr_auto] items-center gap-x-5 gap-y-5">
            <span>Chi tiết đơn món : {order.totalQuantity} món</span>
            <button
              type="button"
              onClick={onPreviewOrder}
              className="h-[35px] w-[117px]"
              aria-label="Kiểm tra chi tiết đơn món"
            >
              <img
                src="/assets/buttons/button-018.png"
                alt="Ở Đây"
                className="h-full w-full object-contain"
              />
            </button>
            <span>Số điện thoại :</span>
            <span className="text-right">{order.phoneNumber}</span>
            <span>Mã đơn :</span>
            <span className="text-right">{order.orderCode}</span>
            <span>Thời gian :</span>
            <span className="text-right">{order.createdAt}</span>
            <span>Giao đến :</span>
            <span className="text-right">{shortenText(order.deliveryAddress, 17)}</span>
            <span>Thanh toán :</span>
            <span className="text-right">{order.paymentLabel}</span>
          </div>

          <button
            type="button"
            onClick={onCancelOrder}
            className="mt-5 h-[35px] w-[118px]"
            aria-label="Huỷ đặt đơn"
          >
            <img
              src="/assets/buttons/button-019.png"
              alt="Huỷ Đặt Đơn"
              className="h-full w-full object-contain"
            />
          </button>
        </section>

        <section className="rounded-[14px] bg-white px-5 py-6 shadow-sm">
          <h1 className="flex items-center justify-center gap-2 text-center text-xl font-black leading-tight sm:text-[22px]">
            <PackageCheck className="h-6 w-6" />
            Quá trình vận chuyển :
          </h1>

          <div className="mt-8 grid grid-cols-[72px_1fr] gap-1">
            <ShipmentTimeline />
            <MapPreview />
          </div>
        </section>
      </main>

      <RecipeMobileBottomNav />
    </div>
  );
}

function ShipmentTimeline() {
  const steps = ["Siêu thị", "Shiper đã\nnhận đơn", "Shipper đã\nlấy hàng", "Nhà bạn"];

  return (
    <div className="grid min-h-[356px] grid-rows-[auto_1fr_auto_1fr_auto_1fr_auto] justify-items-start text-sm font-black">
      {steps.map((step, index) => (
        <div key={step} className="contents">
          <p className="whitespace-pre-line leading-snug">{step}</p>
          {index < steps.length - 1 ? <AnimatedRouteArrow delay={index * 0.45} /> : null}
        </div>
      ))}
    </div>
  );
}

function AnimatedRouteArrow({ delay }: { delay: number }) {
  return (
    <div className="route-arrow ml-8 my-2" style={{ animationDelay: `${delay}s` }} aria-hidden="true">
      <span />

      <style jsx>{`
        .route-arrow {
          position: relative;
          width: 18px;
          min-height: 56px;
          opacity: 0.28;
          animation: route-arrow-pulse 1.8s ease-in-out infinite;
        }

        .route-arrow span {
          position: absolute;
          left: 8px;
          top: 0;
          bottom: 12px;
          border-left: 2px dashed #000;
        }

        .route-arrow::after {
          position: absolute;
          left: 3px;
          bottom: 0;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 10px solid #000;
          content: "";
        }

        @keyframes route-arrow-pulse {
          0%,
          100% {
            opacity: 0.22;
            transform: translateY(-2px);
          }

          55% {
            opacity: 1;
            transform: translateY(4px);
          }
        }
      `}</style>
    </div>
  );
}

function MapPreview() {
  return (
    <div className="relative -ml-2 flex min-h-[316px] items-center justify-center overflow-hidden bg-transparent">
      <video
        src="/models/file-webm.webm"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[3600px] w-[3600px] -translate-x-[49%] -translate-y-[50%] object-contain"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label="Mascot trượt patin giao hàng"
      />
    </div>
  );
}

function OrderPreviewPage({ order, onBack }: { order: OrderSnapshot; onBack: () => void }) {
  return (
    <div className="relative min-h-[100dvh] bg-[#FFF1AF] px-6 pb-36 text-black lg:pb-14">
      <div className="fixed right-6 top-6 z-40">
        <AppImageButton
          buttonId="button-009"
          onClick={onBack}
          size={58}
          className="flex h-[58px] w-[58px] items-center justify-center rounded-full"
        />
      </div>

      <main className="mx-auto max-w-md space-y-10">
        <section className="-mx-6 rounded-b-[38px] bg-[linear-gradient(180deg,#ffffff_0%,#fff6c7_46%,#ffe467_100%)] px-8 pb-7 pt-10 text-center shadow-[0_12px_18px_rgba(0,0,0,0.18)]">
          <img src={logoText.src} alt="Nấu Smart Grocery" className="mx-auto h-24 w-auto object-contain" />
        </section>

        <section>
          <div className="relative z-10 flex items-end justify-center gap-3 text-center">
            <h1 className="pb-5 text-2xl font-black leading-tight sm:text-[25px]">Tóm tắt</h1>
            <img src={logoMascot.src} alt="Mascot Nấu" className="h-20 w-20 object-contain" />
            <h1 className="pb-5 text-2xl font-black leading-tight sm:text-[25px]">Đơn hàng</h1>
          </div>

          <div className="-mt-3 max-h-[258px] space-y-4 overflow-y-auto rounded-[18px] bg-white p-3">
            {order.items.map((item) => (
              <ReadOnlyItemRow key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="space-y-5 rounded-[18px] bg-white px-7 py-6 text-left">
          <div className="grid grid-cols-[40px_minmax(0,1fr)_minmax(0,1.35fr)] items-center gap-3 border-b border-black/55 pb-4">
            <CheckoutIcon src="/assets/buttons/address-001.png" alt="Địa chỉ" />
            <span className="font-black">Địa Chỉ</span>
            <span className="truncate text-right text-sm font-bold">{order.deliveryAddress}</span>
          </div>

          <div className="grid grid-cols-[40px_minmax(0,1fr)_minmax(96px,auto)] items-center gap-3">
            <CheckoutIcon src="/assets/buttons/payment-001.png" alt="Phương thức thanh toán" />
            <span className="min-w-0 text-[13px] font-black leading-tight sm:text-sm">
              Phương thức
              <br />
              Thanh toán
            </span>
            <span className="shrink-0 whitespace-nowrap text-right text-[12px] font-bold">
              {order.paymentLabel}
            </span>
          </div>

          <div className="space-y-3 pl-10 text-left">
            <div className="flex min-h-8 w-full items-center gap-3 rounded-full bg-[#ffe467] px-2 text-left">
              <CheckoutIcon src="/assets/buttons/cash-001.png" alt={order.paymentLabel} />
              <span className="font-black">{order.paymentLabel}</span>
            </div>
          </div>
        </section>

        <section className="space-y-5 rounded-[18px] bg-white px-7 py-6 text-left">
          <div className="flex w-full items-center gap-3 text-left">
            <CheckoutIcon src="/assets/buttons/voucher-001.png" alt="Voucher" />
            <span className="font-black">Voucher</span>
          </div>

          <div className="space-y-3 text-left">
            {order.selectedVoucherLabels.length > 0 ? (
              order.selectedVoucherLabels.map((label) => (
                <div
                  key={label}
                  className="inline-block rounded-full border border-[#cd6cfd] px-4 py-2 text-left text-sm font-black shadow-[0_0_10px_rgba(205,108,253,0.45)]"
                >
                  {label}
                </div>
              ))
            ) : (
              <p className="text-sm font-bold text-black/60">Không áp dụng voucher</p>
            )}
          </div>
        </section>

        <PaymentDetailsCard order={order} />

      </main>

      <RecipeMobileBottomNav />
    </div>
  );
}

function PaymentDetailsCard({ order }: { order: OrderSnapshot }) {
  return (
    <section className="rounded-[18px] bg-white px-7 py-6 text-left">
      <div className="mb-6 flex items-center gap-3">
        <CheckoutIcon src="/assets/buttons/cart-detailed-001.png" alt="Chi tiết thanh toán" />
        <h2 className="font-black">Chi tiết Thanh toán</h2>
      </div>

      <div className="space-y-5 text-sm font-bold leading-6 sm:text-base">
        <div className="flex justify-between gap-4 text-left">
          <span>Tổng tiền hàng</span>
          <span className="text-right">{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4 text-left">
          <span>Tổng tiền phí vận chuyển</span>
          <span className="text-right">{formatPrice(order.shippingFee)}</span>
        </div>
        <div className="flex justify-between gap-4 text-left">
          <span>Giảm giá</span>
          <span className="text-right">- {formatPrice(order.discountTotal)}</span>
        </div>
        <div className="border-t border-black pt-5">
          <div className="flex justify-between gap-4 text-left">
            <span>Tổng thanh toán</span>
            <span className="text-right">{formatPrice(order.paymentTotal)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CancelOrderModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/20 px-7 backdrop-blur-[1px]">
      <div className="w-full max-w-[348px] overflow-hidden rounded-[26px] border-2 border-black bg-white text-center text-black shadow-[0_24px_70px_rgba(0,0,0,0.25)]">
        <p className="px-7 py-16 text-[15px] font-bold">Xác nhận bạn muốn huỷ đơn này không ?</p>
        <div className="grid grid-cols-2 border-t-2 border-black text-sm font-black">
          <button type="button" onClick={onClose} className="min-h-[58px] border-r border-black">
            Không
          </button>
          <button type="button" onClick={onConfirm} className="min-h-[58px]">
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export function CheckoutPageView() {
  const router = useRouter();
  const { items, removeItem, updateQuantity } = useCart();
  const [selectedIds, setSelectedIds] = useState<Set<string> | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(true);
  const [voucherOpen, setVoucherOpen] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentId>("cash");
  const [selectedVouchers, setSelectedVouchers] = useState<Set<VoucherId>>(
    () => new Set(["total-20"]),
  );
  const [shippingFee, setShippingFee] = useState(2400);
  const [deliveryAddress, setDeliveryAddress] = useState(DEFAULT_DELIVERY_ADDRESS);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [orderView, setOrderView] = useState<OrderView>("checkout");
  const [orderSnapshot, setOrderSnapshot] = useState<OrderSnapshot | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const paymentTimersRef = useRef<number[]>([]);

  useEffect(() => {
    try {
      const rawSelection = window.sessionStorage.getItem(CHECKOUT_SELECTION_STORAGE_KEY);
      const parsedSelection = rawSelection ? (JSON.parse(rawSelection) as string[]) : [];
      setSelectedIds(parsedSelection.length > 0 ? new Set(parsedSelection) : null);
    } catch {
      setSelectedIds(null);
    }
  }, []);

  useEffect(() => {
    setShippingFee(2400 + Math.floor(Math.random() * 6) * 3000);
  }, []);

  useEffect(() => {
    setDeliveryAddress(readStoredDeliveryAddress());
  }, []);

  useEffect(() => {
    return () => {
      paymentTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      paymentTimersRef.current = [];
    };
  }, []);

  const checkoutItems = useMemo(() => {
    if (!selectedIds) {
      return items;
    }

    return items.filter((item) => selectedIds.has(item.id));
  }, [items, selectedIds]);

  const subtotal = useMemo(
    () => checkoutItems.reduce((total, item) => total + item.estimatedPrice * item.quantity, 0),
    [checkoutItems],
  );

  const discountTotal = useMemo(() => {
    return voucherOptions.reduce((total, voucher) => {
      if (!selectedVouchers.has(voucher.id)) {
        return total;
      }

      if (voucher.type === "percent") {
        return total + Math.min(subtotal * voucher.amount, 30000);
      }

      return total + voucher.amount;
    }, 0);
  }, [selectedVouchers, subtotal]);

  const paymentTotal = Math.max(0, subtotal + shippingFee - discountTotal);
  const selectedPayment = paymentOptions.find((option) => option.id === paymentMethod) ?? paymentOptions[0];

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/cart");
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    setSelectedIds((current) => {
      if (!current) {
        return current;
      }

      const next = new Set(current);
      next.delete(id);
      return next;
    });
  };

  const toggleVoucher = (voucherId: VoucherId) => {
    setSelectedVouchers((current) => {
      const next = new Set(current);

      if (next.has(voucherId)) {
        next.delete(voucherId);
      } else {
        next.add(voucherId);
      }

      return next;
    });
  };

  const handleChooseDeliveryAddress = () => {
    const mapQuery =
      deliveryAddress === DEFAULT_DELIVERY_ADDRESS ? "địa chỉ giao hàng gần tôi" : deliveryAddress;

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
      "_blank",
      "noopener,noreferrer",
    );

    const nextAddress = window.prompt(
      "Google Maps đã mở. Sau khi chọn/copy địa chỉ giao hàng, dán địa chỉ vào đây để Nấu lưu lại nhé:",
      deliveryAddress === DEFAULT_DELIVERY_ADDRESS ? "" : deliveryAddress,
    );

    if (!nextAddress?.trim()) {
      return;
    }

    saveDeliveryAddress(nextAddress);
    setDeliveryAddress(nextAddress.trim());
  };

  const createOrderSnapshot = (): OrderSnapshot => {
    const totalQuantity = checkoutItems.reduce((total, item) => total + item.quantity, 0);
    const selectedVoucherLabels = voucherOptions
      .filter((voucher) => selectedVouchers.has(voucher.id))
      .map((voucher) => voucher.label);

    return {
      items: checkoutItems.map((item) => ({ ...item })),
      subtotal,
      shippingFee,
      discountTotal,
      paymentTotal,
      paymentLabel: selectedPayment.label,
      deliveryAddress,
      phoneNumber: ORDER_PHONE_NUMBER,
      selectedVoucherLabels,
      orderCode: `NAU-${Date.now().toString().slice(-6)}`,
      createdAt: new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date()),
      totalQuantity,
    };
  };

  const queuePaymentTimer = (callback: () => void, delay: number) => {
    const timerId = window.setTimeout(callback, delay);
    paymentTimersRef.current.push(timerId);
  };

  const handlePaymentClick = () => {
    if (checkoutItems.length === 0 || paymentStatus !== "idle") {
      return;
    }

    paymentTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    paymentTimersRef.current = [];
    setOrderSnapshot(createOrderSnapshot());
    setPaymentStatus("processing");

    queuePaymentTimer(() => {
      setPaymentStatus("success");
    }, 1200);

    queuePaymentTimer(() => {
      setPaymentStatus("idle");
      setOrderView("final");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2300);
  };

  const handleConfirmCancelOrder = () => {
    setIsCancelModalOpen(false);
    setOrderSnapshot(null);
    setOrderView("checkout");
    router.push("/cart");
  };

  if (orderSnapshot && orderView === "final") {
    return (
      <>
        <FinalBillPage
          order={orderSnapshot}
          onPreviewOrder={() => setOrderView("preview")}
          onCancelOrder={() => setIsCancelModalOpen(true)}
        />
        {isCancelModalOpen ? (
          <CancelOrderModal
            onClose={() => setIsCancelModalOpen(false)}
            onConfirm={handleConfirmCancelOrder}
          />
        ) : null}
      </>
    );
  }

  if (orderSnapshot && orderView === "preview") {
    return <OrderPreviewPage order={orderSnapshot} onBack={() => setOrderView("final")} />;
  }

  return (
    <div className="relative min-h-[100dvh] bg-[#FFF1AF] px-6 pb-36 text-black lg:pb-14">
      <div className="fixed right-6 top-6 z-40">
        <AppImageButton
          buttonId="button-009"
          onClick={handleBack}
          size={58}
          className="flex h-[58px] w-[58px] items-center justify-center rounded-full"
        />
      </div>

      <main className="mx-auto max-w-md space-y-10">
        <section className="-mx-6 rounded-b-[38px] bg-[linear-gradient(180deg,#ffffff_0%,#fff6c7_46%,#ffe467_100%)] px-8 pb-7 pt-11 text-center shadow-[0_12px_18px_rgba(0,0,0,0.18)]">
          <img src={logoText.src} alt="Nấu Smart Grocery" className="mx-auto h-28 w-auto object-contain" />
        </section>

        <section className="-mt-1">
          <div className="relative z-10 flex items-end justify-center gap-4 text-center">
            <h1 className="pb-5 text-2xl font-black leading-tight sm:text-[28px]">Tóm tắt</h1>
            <img src={logoMascot.src} alt="Mascot Nấu" className="h-24 w-24 object-contain" />
            <h1 className="pb-5 text-2xl font-black leading-tight sm:text-[28px]">Đơn hàng</h1>
          </div>

          <div className="-mt-4 max-h-[258px] space-y-4 overflow-y-auto rounded-[18px] bg-white p-3">
            {checkoutItems.length > 0 ? (
              checkoutItems.map((item) => (
                <CheckoutItemRow
                  key={item.id}
                  item={item}
                  onDecrease={(currentItem) => updateQuantity(currentItem.id, Math.max(1, currentItem.quantity - 1))}
                  onIncrease={(currentItem) => updateQuantity(currentItem.id, currentItem.quantity + 1)}
                  onRemove={handleRemoveItem}
                />
              ))
            ) : (
              <div className="rounded-[22px] bg-white px-5 py-10 text-center font-black">
                Giỏ hàng đang trống
              </div>
            )}
          </div>
        </section>

        <section className="space-y-5 rounded-[18px] bg-white px-7 py-6 text-left">
          <button
            type="button"
            onClick={handleChooseDeliveryAddress}
            className="grid w-full grid-cols-[40px_minmax(0,1fr)_minmax(0,1.35fr)_24px] items-center gap-3 border-b border-black/55 pb-4 text-left"
          >
            <CheckoutIcon src="/assets/buttons/address-001.png" alt="Địa chỉ" />
            <span className="font-black">Địa Chỉ</span>
            <span className="truncate text-sm font-bold">{deliveryAddress}</span>
            <ChevronRight className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={() => setPaymentOpen((current) => !current)}
            className="grid w-full grid-cols-[40px_minmax(0,1fr)_minmax(96px,auto)_24px] items-center gap-3 text-left"
          >
            <CheckoutIcon src="/assets/buttons/payment-001.png" alt="Phương thức thanh toán" />
            <span className="min-w-0 text-[13px] font-black leading-tight sm:text-sm">
              Phương thức
              <br />
              Thanh toán
            </span>
            <span className="shrink-0 whitespace-nowrap text-right text-[12px] font-bold">
              {selectedPayment.label}
            </span>
            <ChevronRight className={`h-6 w-6 shrink-0 transition ${paymentOpen ? "rotate-90" : ""}`} />
          </button>

          {paymentOpen ? (
            <div className="space-y-5 pl-10 text-left">
              {paymentOptions.map((option) => {
                const isActive = option.id === paymentMethod;

                return (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => setPaymentMethod(option.id)}
                    className={`flex min-h-8 w-full items-center gap-3 rounded-full px-2 text-left transition ${
                      isActive ? "bg-[#ffe467]" : "bg-transparent"
                    }`}
                  >
                    <CheckoutIcon src={option.icon} alt={option.label} />
                    <span className="font-black">{option.label}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </section>

        <section className="space-y-5 rounded-[18px] bg-white px-7 py-6 text-left">
          <button
            type="button"
            onClick={() => setVoucherOpen((current) => !current)}
            className="flex w-full items-center gap-3 text-left"
          >
            <CheckoutIcon src="/assets/buttons/voucher-001.png" alt="Voucher" />
            <span className="font-black">Voucher</span>
            <ChevronDown className={`ml-auto h-7 w-7 transition ${voucherOpen ? "rotate-180" : ""}`} />
          </button>

          {voucherOpen ? (
            <>
              <label className="flex min-h-12 items-center gap-3 rounded-full bg-[#ffe467] px-3 text-left">
                <CheckoutIcon src="/assets/buttons/discount-typing-001.png" alt="Nhập mã giảm giá" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-left text-sm font-black outline-none"
                  placeholder="Nhập mã giảm giá"
                />
                <Search className="h-6 w-6" />
              </label>

              <div className="space-y-3 text-left">
                {voucherOptions.map((voucher) => {
                  const isSelected = selectedVouchers.has(voucher.id);

                  return (
                    <button
                      type="button"
                      key={voucher.id}
                      onClick={() => toggleVoucher(voucher.id)}
                      className={`block rounded-full px-4 py-2 text-left text-sm font-black transition ${
                        isSelected
                          ? "bg-[#fff7cf] shadow-[0_0_10px_rgba(205,108,253,0.7)]"
                          : "bg-[#f3f3f3]"
                      }`}
                    >
                      {voucher.label}
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}
        </section>

        <section className="rounded-[18px] bg-white px-7 py-6 text-left">
          <div className="mb-6 flex items-center gap-3">
            <CheckoutIcon src="/assets/buttons/cart-detailed-001.png" alt="Chi tiết thanh toán" />
            <h2 className="font-black">Chi tiết Thanh toán</h2>
          </div>

          <div className="space-y-5 text-sm font-bold leading-6 sm:text-base">
            <div className="flex justify-between gap-4 text-left">
              <span>Tổng tiền hàng</span>
              <span className="text-right">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4 text-left">
              <span>Tổng tiền phí vận chuyển</span>
              <span className="text-right">{formatPrice(shippingFee)}</span>
            </div>
            <div className="flex justify-between gap-4 text-left">
              <span>Giảm giá</span>
              <span className="text-right">- {formatPrice(discountTotal)}</span>
            </div>
            <div className="border-t border-black pt-5">
              <div className="flex justify-between gap-4 text-left">
                <span>Tổng thanh toán</span>
                <span className="text-right">{formatPrice(paymentTotal)}</span>
              </div>
            </div>
          </div>
        </section>

        <button
          type="button"
          disabled={checkoutItems.length === 0 || paymentStatus !== "idle"}
          onClick={handlePaymentClick}
          className="mx-auto flex h-[74px] w-[242px] items-center justify-center disabled:opacity-50"
          aria-label="Thanh toán"
        >
          <img
            src="/assets/buttons/button-017.png"
            alt="Thanh toán"
            className="h-full w-full object-contain"
          />
        </button>
      </main>

      {paymentStatus !== "idle" ? <PaymentLoadingOverlay status={paymentStatus} /> : null}

      <RecipeMobileBottomNav />
    </div>
  );
}
