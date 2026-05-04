import Image from "next/image";

interface LocationBadgeIconProps {
  className?: string;
}

export function LocationBadgeIcon({ className }: LocationBadgeIconProps) {
  return (
    <span className={`inline-flex items-center justify-center ${className ?? ""}`}>
      <Image
        src="/assets/buttons/button-028.png"
        alt="Location"
        width={96}
        height={96}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
