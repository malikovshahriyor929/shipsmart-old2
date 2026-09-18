'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ActionIcon, Drawer } from 'rizzui';
import { useDrawer } from '@core/components/shared/drawer-views/use-drawer';
import cn from '@core/utils/class-names';
import { PiXBold } from 'react-icons/pi';

export default function GlobalDrawer() {
  const { isOpen, view, placement, containerClassName, closeDrawer, withIcon } =
    useDrawer();
  const pathname = usePathname();
  useEffect(() => {
    closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeDrawer}
      placement={placement}
      overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-md backdrop-blur-sm"
      containerClassName={cn(
        'min-w-[320px] max-w-[420px] dark:bg-gray-100',
        containerClassName
      )}
      className="z-[9999] h-screen"
    >
      {view}
      {withIcon && (
        <ActionIcon
          size="sm"
          variant="text"
          className="absolute right-1 top-1 z-10"
          onClick={closeDrawer}
        >
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      )}
    </Drawer>
  );
}
