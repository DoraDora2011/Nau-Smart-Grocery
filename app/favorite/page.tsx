import { Suspense } from "react";

import { FavoritePage } from "@/components/favorite/FavoritePage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <FavoritePage />
    </Suspense>
  );
}
