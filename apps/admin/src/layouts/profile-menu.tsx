'use client';

import { useEffect, useState } from 'react';
import { Title, Text, Avatar, Button, Popover } from 'rizzui';
import cn from '@core/utils/class-names';
import { signOut } from 'next-auth/react';
import { usePathname } from '@core/i18n/routing';
import { PLACEHOLDER_AVATAR } from '@core/config/constants';
import { t } from 'i18next';

export default function ProfileMenu({
  buttonClassName,
  avatarClassName,
  username = false,
}: {
  buttonClassName?: string;
  avatarClassName?: string;
  username?: boolean;
}) {
  const pathname = usePathname();
  const triggerAvatar = PLACEHOLDER_AVATAR;
  const triggerName = 'Admin';

  return (
    <ProfileMenuPopover>
      <Popover.Trigger>
        <button
          className={cn(
            'w-9 shrink-0 rounded-full outline-none focus-visible:ring-[1.5px] focus-visible:ring-gray-400 focus-visible:ring-offset-2 active:translate-y-px sm:w-10',
            buttonClassName
          )}
          aria-label={t('profileMenu.openAriaLabel') ?? 'Open profile menu'}
        >
          <Avatar
            src={triggerAvatar}
            name={triggerName}
            className={cn('!h-9 w-9 sm:!h-10 sm:!w-10', avatarClassName)}
          />
          {!!username && (
            <span className="username hidden text-gray-200 dark:text-gray-700 md:inline-flex">
              {/* Hi, { profile?.first_name || t('profileMenu.userFallback') } */}
              {t('profileMenu.hi', { name: 'Admin' })}
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Content className="z-[9999] p-0 dark:border-gray-200 dark:bg-gray-100 [&>svg>path]:dark:stroke-gray-200 [&>svg]:dark:fill-gray-100">
        <DropdownMenu />
      </Popover.Content>
    </ProfileMenuPopover>
  );
}

function ProfileMenuPopover({ children }: React.PropsWithChildren<{}>) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Popover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      shadow="sm"
      placement="bottom-end"
    >
      {children}
    </Popover>
  );
}

function DropdownMenu() {
  const name = 'Admin';
  return (
    <div className="w-72 text-left rtl:text-right">
      <div className="flex w-full items-center gap-3 overflow-clip border-b border-gray-300 p-5">
        <Avatar src={PLACEHOLDER_AVATAR} name={name} />
        <div className="flex max-w-48 flex-col items-start overflow-hidden">
          <Title as="h6" className="font-semibold">
            {name}
          </Title>
          <Text className="max-w-[200px] truncate text-gray-600">
            admin@local
          </Text>
        </div>
      </div>

      <div className="px-6 py-5">
        <Button
          className="h-auto w-full justify-start p-0 font-medium text-gray-700 outline-none focus-within:text-gray-600 hover:text-gray-900 focus-visible:ring-0"
          variant="text"
          onClick={() => signOut()}
        >
          {/* Sign Out */}
          {t('profileMenu.signOut')}
        </Button>
      </div>
    </div>
  );
}
