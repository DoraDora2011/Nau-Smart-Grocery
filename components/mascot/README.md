# Mascot 3D Viewer

Reusable 3D mascot viewer for later UI integration. Do not import it into a page/layout directly with SSR enabled.

## Required packages

```bash
npm install three
npm install -D @types/three
```

## Later usage

```tsx
import dynamic from "next/dynamic";

const Mascot3DViewer = dynamic(
  () => import("@/components/mascot/Mascot3DViewer"),
  { ssr: false }
);

export function MascotPreview() {
  return (
    <Mascot3DViewer
      modelPath="/models/mascot-webready.glb"
      showControls={false}
    />
  );
}
```

Default model path:

```txt
/models/mascot-webready.glb
```
