import {
  readStoredUserProfile,
  updateStoredUserProfileAddress
} from "@/lib/utils/user-profile";

export const DELIVERY_ADDRESS_STORAGE_KEY = "nau-smart-grocery:delivery-address";

export const DEFAULT_DELIVERY_ADDRESS = "Nhập địa chỉ của bạn";

export function readStoredDeliveryAddress() {
  if (typeof window === "undefined") {
    return DEFAULT_DELIVERY_ADDRESS;
  }

  const storedAddress = window.localStorage.getItem(DELIVERY_ADDRESS_STORAGE_KEY)?.trim();
  const profileAddress = readStoredUserProfile()?.address.trim();

  return storedAddress || profileAddress || DEFAULT_DELIVERY_ADDRESS;
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
  updateStoredUserProfileAddress(nextAddress);
  window.dispatchEvent(new CustomEvent("nau-smart-grocery:delivery-address-updated"));
}
