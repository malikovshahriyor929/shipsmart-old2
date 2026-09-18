'use client';

import { routes } from '@/config/routes';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PiChartPieSlice, PiTruck } from 'react-icons/pi';

export function useMenuItems() {
  const { t } = useTranslation();

  return useMemo(
    () => [
      { name: t('menu.sections.operations') },
      {
        name: t('menu.dashboard'),
        href: routes.dashboard.overview,
        icon: <PiChartPieSlice />,
      },
      {
        name: 'Shipments',
        href: routes.shipments.list,
        icon: <PiTruck />,
      },
    ],
    [t]
  );
}
