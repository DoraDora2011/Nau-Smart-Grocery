"use client";

import { FormEvent, useEffect, useState } from "react";

import { useLanguage } from "@/components/providers/language-provider";
import { saveDeliveryAddress } from "@/lib/utils/delivery-address";
import {
  clearAnonymousOnboardingState,
  readStoredUserProfile,
  saveStoredUserProfile,
  type StoredUserProfile
} from "@/lib/utils/user-profile";
import { clearSeenNotificationIds } from "@/lib/utils/website-notifications";

type FormErrors = Partial<Record<"name" | "address" | "email" | "storage", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function submitUserProfileToSheet(profile: StoredUserProfile) {
  const webhookUrl = process.env.NEXT_PUBLIC_USER_SHEET_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("User Sheet webhook is not configured. The local user profile was still saved.");
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(profile)
    });

    if (!response.ok) {
      console.warn(`User Sheet submission returned ${response.status}. The local user profile was still saved.`);
    }
  } catch (error) {
    console.warn("Could not submit the user profile to Google Sheet. The local user profile was still saved.", error);
  }
}

export function UserLoginOnboardingModal() {
  const { dictionary } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const storedProfile = readStoredUserProfile();

    if (!storedProfile) {
      clearAnonymousOnboardingState();
      clearSeenNotificationIds();
    }

    setIsOpen(!storedProfile);
    setIsReady(true);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedAddress = address.trim();
    const trimmedEmail = email.trim();
    const nextErrors: FormErrors = {};

    if (!trimmedName) {
      nextErrors.name = dictionary.loginOnboarding.nameError;
    }

    if (!trimmedAddress) {
      nextErrors.address = dictionary.loginOnboarding.addressError;
    }

    if (!trimmedEmail) {
      nextErrors.email = dictionary.loginOnboarding.emailRequiredError;
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = dictionary.loginOnboarding.emailInvalidError;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const profile: StoredUserProfile = {
      name: trimmedName,
      address: trimmedAddress,
      email: trimmedEmail,
      createdAt: new Date().toISOString(),
      hasReceivedNotification: false
    };

    if (!saveStoredUserProfile(profile)) {
      setErrors({
        storage: dictionary.loginOnboarding.storageError
      });
      return;
    }

    saveDeliveryAddress(profile.address);
    setErrors({});
    setIsOpen(false);
    void submitUserProfileToSheet(profile);
  };

  if (!isReady || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/45 px-5 py-[calc(1.25rem+env(safe-area-inset-top))] text-black backdrop-blur-[2px]">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-login-title"
        className="w-full max-w-md rounded-[30px] bg-white px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:px-7"
      >
        <p className="text-xs font-black uppercase leading-tight text-[#4a7890]">
          {dictionary.loginOnboarding.eyebrow}
        </p>
        <h2 id="user-login-title" className="mt-2 text-2xl font-black leading-tight">
          {dictionary.loginOnboarding.title}
        </h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-black/62">
          {dictionary.loginOnboarding.description}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          <label className="block">
            <span className="mb-1.5 block text-sm font-black">{dictionary.loginOnboarding.name}</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-12 w-full rounded-2xl border border-black/15 bg-[#f7f7f7] px-4 text-sm font-bold outline-none transition focus:border-[#cd6cfd]"
              autoComplete="name"
              autoFocus
            />
            {errors.name ? <span className="mt-1.5 block text-xs font-bold text-red-600">{errors.name}</span> : null}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-black">{dictionary.loginOnboarding.address}</span>
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="h-12 w-full rounded-2xl border border-black/15 bg-[#f7f7f7] px-4 text-sm font-bold outline-none transition focus:border-[#cd6cfd]"
              autoComplete="street-address"
            />
            {errors.address ? (
              <span className="mt-1.5 block text-xs font-bold text-red-600">{errors.address}</span>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-black">{dictionary.loginOnboarding.email}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-2xl border border-black/15 bg-[#f7f7f7] px-4 text-sm font-bold outline-none transition focus:border-[#cd6cfd]"
              autoComplete="email"
            />
            {errors.email ? <span className="mt-1.5 block text-xs font-bold text-red-600">{errors.email}</span> : null}
          </label>

          {errors.storage ? <p className="text-sm font-bold text-red-600">{errors.storage}</p> : null}

          <button
            type="submit"
            className="mt-1 flex h-12 w-full items-center justify-center rounded-full bg-[#ffe467] px-6 text-base font-black text-black transition active:scale-[0.98]"
          >
            {dictionary.loginOnboarding.submit}
          </button>
        </form>
      </section>
    </div>
  );
}
