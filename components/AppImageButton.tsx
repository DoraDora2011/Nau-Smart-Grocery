"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, CSSProperties, MouseEventHandler } from "react";

import { getButtonAsset, type ButtonId } from "@/data/buttonAssets";

type ButtonType = "button" | "submit" | "reset";

interface AppImageButtonProps {
  buttonId: ButtonId;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  className?: string;
  imgClassName?: string;
  disabled?: boolean;
  size?: number | string;
  href?: ComponentProps<typeof Link>["href"] | `#${string}`;
  type?: ButtonType;
  "data-tour-id"?: string;
}

const baseOuterStyle: CSSProperties = {
  background: "transparent",
  border: "none",
  padding: 0,
  cursor: "pointer"
};

const baseImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
  display: "block"
};

function getSizeStyle(size: AppImageButtonProps["size"]): CSSProperties {
  if (!size) {
    return {};
  }

  return {
    width: typeof size === "number" ? `${size}px` : size,
    height: typeof size === "number" ? `${size}px` : size
  };
}

export function AppImageButton({
  buttonId,
  onClick,
  className,
  imgClassName,
  disabled,
  size = 48,
  href,
  type = "button",
  "data-tour-id": dataTourId
}: AppImageButtonProps) {
  const asset = getButtonAsset(buttonId);
  const imageSize = typeof size === "number" ? size : 128;
  const outerStyle = {
    ...baseOuterStyle,
    ...getSizeStyle(size),
    cursor: disabled ? "not-allowed" : baseOuterStyle.cursor,
    opacity: disabled ? 0.55 : 1
  };

  const image = (
    <Image
      src={asset.src}
      alt={asset.label}
      width={imageSize}
      height={imageSize}
      className={imgClassName}
      style={baseImageStyle}
      priority={false}
    />
  );

  if (typeof href === "string" && href.startsWith("#")) {
    return (
      <a
        href={href}
        aria-label={asset.label}
        aria-disabled={disabled}
        className={className}
        data-tour-id={dataTourId}
        style={outerStyle}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
            return;
          }

          onClick?.(event);
        }}
      >
        {image}
      </a>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        aria-label={asset.label}
        aria-disabled={disabled}
        className={className}
        data-tour-id={dataTourId}
        style={outerStyle}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
            return;
          }

          onClick?.(event);
        }}
      >
        {image}
      </Link>
    );
  }

  return (
    <button
      type={type}
      aria-label={asset.label}
      disabled={disabled}
      className={className}
      data-tour-id={dataTourId}
      style={outerStyle}
      onClick={onClick}
    >
      {image}
    </button>
  );
}
