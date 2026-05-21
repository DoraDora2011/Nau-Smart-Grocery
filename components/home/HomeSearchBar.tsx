import { Search, X } from "lucide-react";

interface HomeSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function HomeSearchBar({ value, onChange, className }: HomeSearchBarProps) {
  return (
    <div
      className={`relative flex h-12 items-center gap-3 rounded-full bg-white py-0 pl-4 pr-4 shadow-sm ring-1 ring-black/5 ${className ?? ""}`}
    >
      <Search className="h-5 w-5 shrink-0 text-black" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Tìm nguyên liệu tại đây ..."
        className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-black outline-none placeholder:text-black/70"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-black transition hover:bg-black/10"
          aria-label="Xóa từ khóa tìm kiếm"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
