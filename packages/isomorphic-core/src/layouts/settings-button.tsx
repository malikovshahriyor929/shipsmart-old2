'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
// import { useTheme } from "next-themes";
import dynamic from 'next/dynamic';
import { useDirection } from '@core/hooks/use-direction';
import CogSolidIcon from '@core/components/icons/cog-solid';
import { ActionIcon } from 'rizzui';
import cn from '@core/utils/class-names';
import { usePresets } from '@core/config/color-presets';
import {
  useApplyColorPreset,
  useColorPresets,
} from '@core/layouts/settings/use-theme-color';
import { useDrawer } from '@core/components/shared/drawer-views/use-drawer';

export default function SettingsButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const t = useTranslations();
  const COLOR_PRESETS = usePresets();
  const { openDrawer, closeDrawer } = useDrawer();
  const { direction } = useDirection();
  const { colorPresets } = useColorPresets();
  // const { theme } = useTheme();

  useApplyColorPreset<any>(colorPresets ?? COLOR_PRESETS[0].colors);

  // to set html dir attribute on direction change
  useEffect(() => {
    document.documentElement.dir = direction ?? 'ltr';
  }, [direction]);

  return (
    <ActionIcon
      aria-label={t('commons.settings') ?? 'Settings'}
      variant="text"
      className={cn(
        'relative h-[34px] w-[34px] shadow backdrop-blur-md dark:bg-gray-100 md:h-9 md:w-9',
        className
      )}
      onClick={() =>
        openDrawer({
          view: (
            <>
            </>
          ),
          placement: 'right',
          containerClassName: 'max-w-[420px]',
        })
      }
    >
      {children ? (
        children
      ) : (
        <CogSolidIcon
          strokeWidth={1.8}
          className="h-[22px] w-auto animate-spin-slow"
        />
      )}
    </ActionIcon>
  );
}
