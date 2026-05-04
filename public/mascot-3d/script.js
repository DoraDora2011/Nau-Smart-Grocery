import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const MODEL_URL = "/models/mascot-webready.glb";

const CHARACTER_PARTS = {
  body: ["Body"],
  outfitBase: ["Chef_Rolerskate"],
};

const OUTFITS = {
  default: ["Chef_Helmet", "Chef_Shirt"],
  outfit1: ["Pine_Overall", "Acorn", "Candy"],
  outfit2: ["Maid_Apron", "Maid_Broom", "Maid_Headwear"],
  outfit3: ["Raincoat", "Umbrella"],
};

const OPTIONAL_EXTRA_PARTS = [];
const HIDDEN_BY_DEFAULT_PARTS = ["Hair"];
const ALL_OUTFIT_NAMES = [...new Set(Object.values(OUTFITS).flat())];
const HEAD_BASE_MATERIAL_NAMES = ["Head base"];
const HEAD_BASE_ALPHA_TEST = 0.82;
const MODEL_SATURATION = 0.82;
const solidMaterialCache = new Map();

const canvas = document.querySelector("#characterCanvas");
const loadingText = document.querySelector("#loadingText");
const outfitButtons = document.querySelectorAll(".outfit-button");
canvas.style.filter = `saturate(${MODEL_SATURATION})`;

const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 1000);
camera.position.set(0, 1.3, 4);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  preserveDrawingBuffer: true,
});
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

const characterParts = {
  body: [],
  outfitBase: [],
  optionalExtra: [],
  hiddenByDefault: [],
  hairRoot: [],
  hairBangs: [],
  hairEars: [],
  allOutfits: [],
  outfits: {},
};
let characterRoot = null;
let selectedOutfitKey = "default";

setupLights();
resizeRenderer();
window.addEventListener("resize", resizeRenderer);

loadCharacter();
bindOutfitButtons();
setActiveButton(document.querySelector(".outfit-button.active"));
animate();

function setupLights() {
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

function loadCharacter() {
  const loader = new GLTFLoader();

  loader.load(
    MODEL_URL,
    (gltf) => {
      characterRoot = gltf.scene;
      scene.add(characterRoot);

      prepareModel(characterRoot);
      collectCharacterParts(characterRoot);
      hideAllOutfits();
      selectOutfit("default");
      fitCameraToObject(characterRoot);

      loadingText.classList.add("hidden");
    },
    (event) => {
      if (!event.total) return;

      const percent = Math.round((event.loaded / event.total) * 100);
      loadingText.textContent = `Loading character... ${percent}%`;
    },
    (error) => {
      console.error("Could not load GLB:", error);
      loadingText.textContent = "Could not load character. Check the GLB path.";
    },
  );
}

function prepareModel(root) {
  root.traverse((object) => {
    if (!object.isMesh && !object.isSkinnedMesh) return;

    object.castShadow = false;
    object.receiveShadow = false;

    if (object.material) {
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      const solidMaterials = materials.map((material) => {
        const solidMaterial = createSolidMaterial(material);
        fixCutoutMaterial(solidMaterial);
        solidMaterial.needsUpdate = true;
        return solidMaterial;
      });

      object.material = Array.isArray(object.material)
        ? solidMaterials
        : solidMaterials[0];
    }
  });
}

function createSolidMaterial(material) {
  if (solidMaterialCache.has(material)) {
    return solidMaterialCache.get(material);
  }

  const solidMaterial = new THREE.MeshBasicMaterial({
    name: material.name,
    color: material.color ? material.color.clone() : new THREE.Color(0xffffff),
    map: material.map || null,
    alphaMap: material.alphaMap || null,
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

function applyLowSaturationLook(material) {
  const colorHsl = {};
  material.color.getHSL(colorHsl);
  material.color.setHSL(colorHsl.h, colorHsl.s * MODEL_SATURATION, colorHsl.l);
}

function fixCutoutMaterial(material) {
  if (!HEAD_BASE_MATERIAL_NAMES.includes(material.name)) {
    return;
  }

  material.transparent = false;
  material.alphaTest = HEAD_BASE_ALPHA_TEST;
  material.depthWrite = true;
  material.depthTest = true;
  material.side = THREE.DoubleSide;
}

function collectCharacterParts(root) {
  characterParts.body = findObjectsByNames(root, CHARACTER_PARTS.body, {
    required: true,
  });
  characterParts.outfitBase = findObjectsByNames(root, CHARACTER_PARTS.outfitBase);
  characterParts.optionalExtra = findObjectsByNames(root, OPTIONAL_EXTRA_PARTS);
  characterParts.hiddenByDefault = findObjectsByNames(root, HIDDEN_BY_DEFAULT_PARTS);
  characterParts.hairRoot = findObjectsByNames(root, ["Hair"]);
  characterParts.hairBangs = findDirectChildrenByMaterial("Hair", "Head base");
  characterParts.hairEars = findDirectChildrenByMaterial("Hair", "Ears");
  characterParts.allOutfits = findObjectsByNames(root, ALL_OUTFIT_NAMES, {
    required: true,
  });

  Object.entries(OUTFITS).forEach(([outfitKey, outfitNames]) => {
    characterParts.outfits[outfitKey] = findObjectsByNames(root, outfitNames, {
      required: outfitKey !== "default",
    });
  });
}

function bindOutfitButtons() {
  outfitButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectOutfit(button.dataset.outfit);
      setActiveButton(button);
    });
  });
}

function selectOutfit(selectedOutfit) {
  selectedOutfitKey = selectedOutfit || "default";
  setObjectsVisible(characterParts.body, true);
  setObjectsVisible(characterParts.outfitBase, true);
  setObjectsVisible(characterParts.optionalExtra, true);
  setObjectsVisible(characterParts.hiddenByDefault, false);

  hideAllOutfits();
  setObjectsVisible(characterParts.outfits[selectedOutfit] || [], true);
  setObjectsVisible(characterParts.hiddenByDefault, false);
  updateHairForOutfit(selectedOutfit);
}

function hideAllOutfits() {
  setObjectsVisible(characterParts.allOutfits, false);
}

function updateHairForOutfit(selectedOutfit) {
  const shouldShowBangs = selectedOutfit === "outfit3";
  const shouldShowEars = selectedOutfit === "default";

  setObjectsVisible(characterParts.hairRoot, shouldShowBangs || shouldShowEars);
  setObjectsVisible(characterParts.hairBangs, shouldShowBangs);
  setObjectsVisible(characterParts.hairEars, shouldShowEars);
}

function setObjectsVisible(objects, isVisible) {
  objects.forEach((object) => {
    object.visible = isVisible;
  });
}

function findObjectsByNames(root, names, options = {}) {
  if (!root || names.length === 0) {
    return [];
  }

  const foundObjects = [];

  names.forEach((name) => {
    const matches = [];

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

function findDirectChildrenByMaterial(parentName, materialName) {
  const parent = characterRoot?.getObjectByName(parentName);

  if (!parent) {
    console.warn(`Missing mesh or group: ${parentName}`);
    return [];
  }

  return parent.children.filter((child) => hasMaterialName(child, materialName));
}

function hasMaterialName(object, materialName) {
  if (!object.material) {
    return false;
  }

  const materials = Array.isArray(object.material)
    ? object.material
    : [object.material];

  return materials.some((material) => material.name === materialName);
}

function isMatchingBlenderName(actualName, expectedName) {
  if (!actualName) {
    return false;
  }

  return (
    actualName === expectedName ||
    actualName.startsWith(`${expectedName}.`) ||
    actualName.startsWith(`${expectedName}_`)
  );
}

function setActiveButton(activeButton) {
  outfitButtons.forEach((button) => {
    const isActive = button === activeButton;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function fitCameraToObject(object) {
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
}

function resizeRenderer() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (width === 0 || height === 0) {
    return;
  }

  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  if (characterRoot) {
    fitCameraToObject(characterRoot);
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin) {
    return;
  }

  if (event.data?.type !== "NAU_MASCOT_CAPTURE") {
    return;
  }

  try {
    if (characterRoot) {
      controls.update();
      renderer.render(scene, camera);
    }

    const imageDataUrl = canvas.toDataURL("image/png");

    window.parent.postMessage(
      {
        type: "NAU_MASCOT_CAPTURED",
        outfit: selectedOutfitKey,
        imageDataUrl,
      },
      event.origin,
    );
  } catch (error) {
    window.parent.postMessage(
      {
        type: "NAU_MASCOT_CAPTURE_FAILED",
        message: error?.message ?? "Capture failed",
      },
      event.origin,
    );
  }
});
