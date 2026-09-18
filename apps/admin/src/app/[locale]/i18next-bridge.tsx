'use client';

import i18next from 'i18next';
import { useMemo } from 'react';
import { initReactI18next } from 'react-i18next';

type Messages = Record<string, unknown>;

export default function I18nextBridge({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: Messages;
  children: React.ReactNode;
}) {
  useMemo(() => {
    const resources = {
      [locale]: {
        translation: messages,
      },
    };

    if (!i18next.isInitialized) {
      i18next.use(initReactI18next).init({
        lng: locale,
        fallbackLng: 'en',
        resources,
        debug: false,
        initImmediate: false,
        interpolation: {
          escapeValue: false,
        },
      });
    } else {
      i18next.addResourceBundle(locale, 'translation', messages, true, true);
      if (i18next.language !== locale) {
        i18next.changeLanguage(locale);
      }
    }
  }, [locale, messages]);

  return children;
}
