"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import styles from "./Mascot3DViewer.module.css";

type OutfitKey = "default" | "outfit1" | "outfit2" | "outfit3";

type Mascot3DViewerProps = {
  modelPath?: string;
  className?: string;
  showControls?: boolean;
};

type CharacterParts = {
  body: THREE.Object3D[];
  outfitBase: THREE.Object3D[];
  optionalExtra: THREE.Object3D[];
  hiddenByDefault: THREE.Object3D[];
  hairRoot: THREE.Object3D[];
  hairBangs: THREE.Object3D[];
  hairEars: THREE.Object3D[];
  allOutfits: THREE.Object3D[];
  outfits: Record<OutfitKey, THREE.Object3D[]>;
};

type ViewerState = {
  characterParts: CharacterParts;
  characterRoot: THREE.Object3D;
  controls: OrbitControls;
};

const CHARACTER_PARTS = {
  body: ["Body"],
  outfitBase: ["Chef_Rolerskate"],
};

const OUTFITS: Record<OutfitKey, string[]> = {
  default: ["Chef_Helmet", "Chef_Shirt"],
  outfit1: ["Pine_Overall", "Acorn", "Candy"],
  outfit2: ["Maid_Apron", "Maid_Broom", "Maid_Headwear"],
  outfit3: ["Raincoat", "Umbrella"],
};

const OPTIONAL_EXTRA_PARTS: string[] = [];
const HIDDEN_BY_DEFAULT_PARTS = ["Hair"];
const ALL_OUTFIT_NAMES = [...new Set(Object.values(OUTFITS).flat())];
const HEAD_BASE_MATERIAL_NAMES = ["Head base"];
const HEAD_BASE_ALPHA_TEST = 0.82;
const MODEL_SATURATION = 0.82;

const OUTFIT_OPTIONS: Array<{ key: OutfitKey; label: string }> = [
  { key: "default", label: "Default" },
  { key: "outfit1", label: "Outfit 1" },
  { key: "outfit2", label: "Outfit 2" },
  { key: "outfit3", label: "Outfit 3" },
];

export default function Mascot3DViewer({
  modelPath = "/models/mascot-webready.glb",
  className,
  showControls = true,
}: Mascot3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewerPanelRef = useRef<HTMLDivElement | null>(null);
  const viewerStateRef = useRef<ViewerState | null>(null);
  const selectedOutfitRef = useRef<OutfitKey>("default");
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitKey>("default");
  const [loadingText, setLoadingText] = useState("Loading character...");
  const [hasError, setHasError] = useState(false);
  const rootClassName = className ? `${styles.root} ${className}` : styles.root;

  useEffect(() => {
    const canvas = canvasRef.current;
    const viewerPanel = viewerPanelRef.current;

    if (!canvas || !viewerPanel || typeof window === "undefined") {
      return;
    }

    let isDisposed = false;
    let animationFrameId = 0;
    const solidMaterialCache = new Map<THREE.Material, THREE.MeshBasicMaterial>();

    setHasError(false);
    setLoadingText("Loading character...");
    canvas.style.filter = `saturate(${MODEL_SATURATION})`;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 1000);
    camera.position.set(0, 1.3, 4);

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
    } catch (error) {
      console.error("Could not initialize WebGL renderer:", error);
      setHasError(true);
      setLoadingText("Không thể khởi tạo mascot 3D trong trình duyệt hiện tại.");
      disposeObject(scene);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 1;
    controls.maxDistance = 12;
    controls.target.set(0, 1, 0);

    setupLights(scene);

    const fitCameraToObject = (object: THREE.Object3D) => {
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);

      if (!Number.isFinite(maxDimension) || maxDimension === 0) {
        console.warn("Could not fit camera because the model bounds are empty.");
        return;
      }

      const fitHeightDistance =
        maxDimension / (2 * Math.tan((Math.PI * camera.fov) / 360));
      const fitWidthDistance = fitHeightDistance / camera.aspect;
      const distance = Math.max(fitHeightDistance, fitWidthDistance) * 1.25;
      const direction = new THREE.Vector3(0, 0.18, 1).normalize();

      camera.position.copy(center).add(direction.multiplyScalar(distance));
      camera.near = Math.max(distance / 100, 0.01);
      camera.far = distance * 100;
      camera.updateProjectionMatrix();

      controls.target.copy(center);
      controls.update();
    };

    const resizeRenderer = () => {
      const width = viewerPanel.clientWidth;
      const height = viewerPanel.clientHeight;

      if (width === 0 || height === 0) {
        return;
      }

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      if (viewerStateRef.current?.characterRoot) {
        fitCameraToObject(viewerStateRef.current.characterRoot);
      }
    };

    const resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(viewerPanel);
    window.addEventListener("resize", resizeRenderer);
    resizeRenderer();

    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        if (isDisposed) {
          disposeObject(gltf.scene);
          return;
        }

        const characterRoot = gltf.scene;
        scene.add(characterRoot);

        prepareModel(characterRoot, solidMaterialCache);
        const characterParts = collectCharacterParts(characterRoot);
        hideAllOutfits(characterParts);
        selectOutfit(characterParts, selectedOutfitRef.current);
        fitCameraToObject(characterRoot);

        viewerStateRef.current = {
          characterParts,
          characterRoot,
          controls,
        };

        setLoadingText("");
      },
      (event) => {
        if (isDisposed || !event.total) {
          return;
        }

        const percent = Math.round((event.loaded / event.total) * 100);
        setLoadingText(`Loading character... ${percent}%`);
      },
      (error) => {
        if (isDisposed) {
          return;
        }

        console.error("Could not load GLB:", error);
        setHasError(true);
        setLoadingText("Could not load character. Check the GLB path.");
      },
    );

    const animate = () => {
      if (isDisposed) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      viewerStateRef.current = null;
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeRenderer);
      resizeObserver.disconnect();
      controls.dispose();
      disposeObject(scene);
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [modelPath]);

  useEffect(() => {
    selectedOutfitRef.current = selectedOutfit;

    const viewerState = viewerStateRef.current;

    if (!viewerState) {
      return;
    }

    selectOutfit(viewerState.characterParts, selectedOutfit);
    viewerState.controls.update();
  }, [selectedOutfit]);

  return (
    <section className={rootClassName} aria-label="3D mascot viewer">
      <div className={styles.viewerPanel} ref={viewerPanelRef}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          aria-label="Nau Smart Grocery mascot 3D preview"
        />
        {loadingText ? (
          <div
            className={`${styles.loadingText} ${hasError ? styles.errorText : ""}`}
            role={hasError ? "alert" : "status"}
          >
            {loadingText}
          </div>
        ) : null}
      </div>

      {showControls ? (
        <div className={styles.controlsPanel} aria-label="Outfit controls">
          <div className={styles.brandBlock}>
            <p className={styles.eyebrow}>Character Viewer</p>
            <h2 className={styles.title}>Dress-Up Studio</h2>
          </div>

          <div className={styles.outfitControls} role="group" aria-label="Select outfit">
            {OUTFIT_OPTIONS.map((outfit) => {
              const isActive = outfit.key === selectedOutfit;

              return (
                <button
                  className={`${styles.outfitButton} ${
                    isActive ? styles.outfitButtonActive : ""
                  }`}
                  type="button"
                  key={outfit.key}
                  aria-pressed={isActive}
                  onClick={() => setSelectedOutfit(outfit.key)}
                >
                  {outfit.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function setupLights(scene: THREE.Scene) {
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x8aa1a9, 2.2);
  scene.add(hemisphereLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
  keyLight.position.set(3, 5, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xbdefff, 1.2);
  fillLight.position.set(-4, 2.2, 3);
  scene.add(fillLight);
}

function prepareModel(
  root: THREE.Object3D,
  solidMaterialCache: Map<THREE.Material, THREE.MeshBasicMaterial>,
) {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;

    if (!mesh.isMesh && !(mesh as THREE.SkinnedMesh).isSkinnedMesh) {
      return;
    }

    mesh.castShadow = false;
    mesh.receiveShadow = false;

    if (!mesh.material) {
      return;
    }

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const solidMaterials = materials.map((material) => {
      const solidMaterial = createSolidMaterial(material, solidMaterialCache);
      fixCutoutMaterial(solidMaterial);
      solidMaterial.needsUpdate = true;
      return solidMaterial;
    });

    mesh.material = Array.isArray(mesh.material) ? solidMaterials : solidMaterials[0];
  });
}

function createSolidMaterial(
  material: THREE.Material,
  solidMaterialCache: Map<THREE.Material, THREE.MeshBasicMaterial>,
) {
  if (solidMaterialCache.has(material)) {
    return solidMaterialCache.get(material)!;
  }

  const sourceMaterial = material as THREE.MeshStandardMaterial;
  const solidMaterial = new THREE.MeshBasicMaterial({
    name: material.name,
    color: sourceMaterial.color?.clone() ?? new THREE.Color(0xffffff),
    map: sourceMaterial.map ?? null,
    alphaMap: sourceMaterial.alphaMap ?? null,
    opacity: material.opacity,
    transparent: material.transparent,
    alphaTest: material.alphaTest,
    side: material.side,
    depthWrite: material.depthWrite,
    depthTest: material.depthTest,
    vertexColors: material.vertexColors,
  });

  solidMaterial.toneMapped = false;
  applyLowSaturationLook(solidMaterial);
  solidMaterialCache.set(material, solidMaterial);
  return solidMaterial;
}

function applyLowSaturationLook(material: THREE.MeshBasicMaterial) {
  const colorHsl = { h: 0, s: 0, l: 0 };
  material.color.getHSL(colorHsl);
  material.color.setHSL(colorHsl.h, colorHsl.s * MODEL_SATURATION, colorHsl.l);
}

function fixCutoutMaterial(material: THREE.MeshBasicMaterial) {
  if (!HEAD_BASE_MATERIAL_NAMES.includes(material.name)) {
    return;
  }

  material.transparent = false;
  material.alphaTest = HEAD_BASE_ALPHA_TEST;
  material.depthWrite = true;
  material.depthTest = true;
  material.side = THREE.DoubleSide;
}

function collectCharacterParts(root: THREE.Object3D): CharacterParts {
  const characterParts: CharacterParts = {
    body: findObjectsByNames(root, CHARACTER_PARTS.body, { required: true }),
    outfitBase: findObjectsByNames(root, CHARACTER_PARTS.outfitBase),
    optionalExtra: findObjectsByNames(root, OPTIONAL_EXTRA_PARTS),
    hiddenByDefault: findObjectsByNames(root, HIDDEN_BY_DEFAULT_PARTS),
    hairRoot: findObjectsByNames(root, ["Hair"]),
    hairBangs: findDirectChildrenByMaterial(root, "Hair", "Head base"),
    hairEars: findDirectChildrenByMaterial(root, "Hair", "Ears"),
    allOutfits: findObjectsByNames(root, ALL_OUTFIT_NAMES, { required: true }),
    outfits: {
      default: [],
      outfit1: [],
      outfit2: [],
      outfit3: [],
    },
  };

  Object.entries(OUTFITS).forEach(([outfitKey, outfitNames]) => {
    characterParts.outfits[outfitKey as OutfitKey] = findObjectsByNames(root, outfitNames, {
      required: outfitKey !== "default",
    });
  });

  return characterParts;
}

function selectOutfit(characterParts: CharacterParts, selectedOutfit: OutfitKey) {
  setObjectsVisible(characterParts.body, true);
  setObjectsVisible(characterParts.outfitBase, true);
  setObjectsVisible(characterParts.optionalExtra, true);
  setObjectsVisible(characterParts.hiddenByDefault, false);

  hideAllOutfits(characterParts);
  setObjectsVisible(characterParts.outfits[selectedOutfit] ?? [], true);
  setObjectsVisible(characterParts.hiddenByDefault, false);
  updateHairForOutfit(characterParts, selectedOutfit);
}

function hideAllOutfits(characterParts: CharacterParts) {
  setObjectsVisible(characterParts.allOutfits, false);
}

function updateHairForOutfit(characterParts: CharacterParts, selectedOutfit: OutfitKey) {
  const shouldShowBangs = selectedOutfit === "outfit3";
  const shouldShowEars = selectedOutfit === "default";

  setObjectsVisible(characterParts.hairRoot, shouldShowBangs || shouldShowEars);
  setObjectsVisible(characterParts.hairBangs, shouldShowBangs);
  setObjectsVisible(characterParts.hairEars, shouldShowEars);
}

function setObjectsVisible(objects: THREE.Object3D[], isVisible: boolean) {
  objects.forEach((object) => {
    object.visible = isVisible;
  });
}

function findObjectsByNames(
  root: THREE.Object3D,
  names: string[],
  options: { required?: boolean } = {},
) {
  if (!root || names.length === 0) {
    return [];
  }

  const foundObjects: THREE.Object3D[] = [];

  names.forEach((name) => {
    const matches: THREE.Object3D[] = [];

    root.traverse((object) => {
      if (isMatchingBlenderName(object.name, name)) {
        matches.push(object);
      }
    });

    if (matches.length === 0) {
      const log = options.required ? console.warn : console.info;
      log(`Missing mesh or group: ${name}`);
      return;
    }

    foundObjects.push(...matches);
  });

  return [...new Set(foundObjects)];
}

function findDirectChildrenByMaterial(
  root: THREE.Object3D,
  parentName: string,
  materialName: string,
) {
  const parent = root.getObjectByName(parentName);

  if (!parent) {
    console.warn(`Missing mesh or group: ${parentName}`);
    return [];
  }

  return parent.children.filter((child) => hasMaterialName(child, materialName));
}

function hasMaterialName(object: THREE.Object3D, materialName: string) {
  const mesh = object as THREE.Mesh;

  if (!mesh.material) {
    return false;
  }

  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

  return materials.some((material) => material.name === materialName);
}

function isMatchingBlenderName(actualName: string, expectedName: string) {
  return (
    actualName === expectedName ||
    actualName.startsWith(`${expectedName}.`) ||
    actualName.startsWith(`${expectedName}_`)
  );
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;

    if (mesh.geometry) {
      mesh.geometry.dispose();
    }

    if (!mesh.material) {
      return;
    }

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => material.dispose());
  });
}
