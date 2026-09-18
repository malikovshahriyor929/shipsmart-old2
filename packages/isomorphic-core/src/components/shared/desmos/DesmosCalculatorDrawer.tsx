'use client';

import { useEffect, useRef } from 'react';
import { Button, Title } from 'rizzui';
import { PiXBold } from 'react-icons/pi'; // Or use any X icon you have
import { useDrawer } from '@core/components/shared/drawer-views/use-drawer';
import { useTranslation } from 'react-i18next';
export default function DesmosCalculatorDrawer() {
  const { t } = useTranslation();
  const calculatorRef = useRef<HTMLDivElement>(null);
  const { closeDrawer } = useDrawer();
  useEffect(() => {
    // Only load Desmos once
    if (
      typeof window !== 'undefined' &&
      calculatorRef.current &&
      // @ts-ignore
      !window.Desmos
    ) {
      const script = document.createElement('script');
      script.src =
        'https://www.desmos.com/api/v1.11/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
      script.async = true;
      script.onload = () => {
        // @ts-ignore
        if (window.Desmos && calculatorRef.current) {
          // @ts-ignore
          window.calculator = window.Desmos.GraphingCalculator(
            calculatorRef.current,
            {
              keypad: true,
              expressions: true,
              settingsMenu: true,
            }
          );
        }
      };
      document.body.appendChild(script);
    }
    //@ts-ignore
    if (window.Desmos && calculatorRef.current) {
      // @ts-ignore
      window.calculator = window.Desmos.GraphingCalculator(
        calculatorRef.current,
        {
          keypad: true,
          expressions: true,
          settingsMenu: true,
        }
      );
    }
    // Optional: destroy calculator on unmount
    return () => {
      // @ts-ignore
      if (window.calculator) {
        // @ts-ignore
        window.calculator.destroy();
        // @ts-ignore
        window.calculator = null;
      }
    };
  }, []);

  return (
    <div className="relative h-[80vh] w-[90vw] min-w-[320px] max-w-full p-2">
      <Button
        variant="text"
        size="sm"
        aria-label={t('commons.close-calculator') ?? 'Close calculator'}
        className="absolute right-3 top-3 z-20 text-gray-500 hover:text-mainBlue"
        onClick={closeDrawer}
      >
        <PiXBold className="h-6 w-6" />
      </Button>
      <Title
        as="h4"
        className="mb-3 rounded-lg border border-mainBlue/30 px-3 py-4 text-center text-xl font-semibold text-mainBlue"
      >
        {t('commons.desmos-calculator') ?? 'Desmos Calculator'}
      </Title>
      <div
        ref={calculatorRef}
        style={{
          width: '100%',
          height: '80vh',
          minHeight: 500,
          background: '#fff',
          borderRadius: 12,
        }}
      />
    </div>
  );
}
