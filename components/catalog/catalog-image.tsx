"use client";

import Image from "next/image";
import { useState } from "react";

interface CatalogImageProps {
  src: string;
  alt: string;
  label: string;
  className?: string;
}

export function CatalogImage({
  src,
  alt,
  label,
  className
}: CatalogImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-[var(--color-muted)] text-center text-xs font-medium text-[var(--color-ink-soft)] ${className ?? ""}`}>
        {label}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={640}
      height={480}
      unoptimized
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
