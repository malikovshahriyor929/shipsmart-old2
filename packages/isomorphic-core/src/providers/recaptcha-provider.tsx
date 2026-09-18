"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from "react";
import Script from "next/script";

declare global {
  interface Window {
    grecaptcha?: {
      ready(cb: () => void): void;
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  }
}

type RecaptchaContextValue = {
  executeRecaptcha: (action: string) => Promise<string>;
};

const RecaptchaContext = createContext<RecaptchaContextValue | null>(null);

type RecaptchaProviderProps = {
  siteKey: string; 
  children: ReactNode;
};

export function RecaptchaProvider({
  siteKey,
  children,
}: RecaptchaProviderProps) {
  const executeRecaptcha = useCallback(
    (action: string) =>
      new Promise<string>((resolve, reject) => {
        if (typeof window === "undefined") {
          reject(new Error("reCAPTCHA can only run in the browser."));
          return;
        }

        if (!window.grecaptcha) {
          reject(new Error("reCAPTCHA is not loaded yet."));
          return;
        }

        window.grecaptcha.ready(() => {
          window
            .grecaptcha!.execute(siteKey, { action })
            .then((token) => resolve(token))
            .catch((err) => reject(err));
        });
      }),
    [siteKey]
  );

  return (
    <>
      {/* Load v3 script once, globally */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
        strategy="afterInteractive"
      />

      <RecaptchaContext.Provider value={{ executeRecaptcha }}>
        {children}
      </RecaptchaContext.Provider>
    </>
  );
}

export function useRecaptcha() {
  const ctx = useContext(RecaptchaContext);
  if (!ctx) {
    throw new Error("useRecaptcha must be used within <RecaptchaProvider>.");
  }
  return ctx;
}
