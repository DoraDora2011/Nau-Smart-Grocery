export const DELIVERY_ADDRESS_STORAGE_KEY = "nau-smart-grocery:delivery-address";

export const DEFAULT_DELIVERY_ADDRESS = "702 Nguyễn Văn Linh...";

export function readStoredDeliveryAddress() {
  if (typeof window === "undefined") {
    return DEFAULT_DELIVERY_ADDRESS;
  }

  const storedAddress = window.localStorage.getItem(DELIVERY_ADDRESS_STORAGE_KEY)?.trim();

  return storedAddress || DEFAULT_DELIVERY_ADDRESS;
}

export function saveDeliveryAddress(address: string) {
  if (typeof window === "undefined") {
    return;
  }

  const nextAddress = address.trim();

  if (!nextAddress) {
    return;
  }

  window.localStorage.setItem(DELIVERY_ADDRESS_STORAGE_KEY, nextAddress);
  window.dispatchEvent(new CustomEvent("nau-smart-grocery:delivery-address-updated"));
}
