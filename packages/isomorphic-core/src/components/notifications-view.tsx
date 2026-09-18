import React from 'react';
import { Tab } from 'rizzui';
import { NotificationItem } from '@core/types';
import { NotificationsSkeleton, TabItem } from '@core/components/notification/items';
import { t } from 'i18next';
import cn from '@core/utils/class-names';

type NotificationsViewProps = {
  tab: number;
  onTabChange: (index: number) => void;
  notifications: NotificationItem[];
  unreadNotifications: NotificationItem[];
  isLoadingAll: boolean;
  isLoadingUnread: boolean;
  onMarkAsRead: (id: string) => Promise<void> | void;
};

export function NotificationsView({
  tab,
  onTabChange,
  notifications,
  unreadNotifications,
  isLoadingAll,
  isLoadingUnread,
  onMarkAsRead,
}: NotificationsViewProps) {
  return (
    <div className="mx-auto w-full  rounded-2xl bg-white/10  border border-white/20 dark:bg-transparent dark:border-none ">
      <Tab onChange={ onTabChange } selectedIndex={ tab }>
        <Tab.List className={ "w-full grid grid-cols-2 gap-6" }>
          <Tab.ListItem className={ cn("flex justify-center dark:hover:text-gray-600 dark:font-semibold  ",
            { "dark:text-white": tab == 0 }
          ) }>
            { t("commons.all") }
          </Tab.ListItem>
          <Tab.ListItem className={ cn("flex justify-center dark:hover:text-gray-600 dark:font-semibold  ",
            { "dark:text-white": tab == 1 }
          ) }>
            { t("commons.unread") }
          </Tab.ListItem>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            { isLoadingAll && (
              <NotificationsSkeleton />
            ) }
            {/* { !isLoadingAll && notifications.length === 0 && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-10 text-center dark:border-gray-300 dark:bg-gray-100/50">
                <NotFound
                  title={ t("notifications.not-found") }
                  btnshow={ false }
                />
              </div>
            ) } */}
            <TabItem notifications={ notifications } markAsRead={ onMarkAsRead } />
          </Tab.Panel>
          <Tab.Panel>
            { isLoadingUnread && (
              <NotificationsSkeleton />
            ) }
            {/* { !isLoadingUnread && unreadNotifications.length === 0 && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-10 text-center dark:border-gray-300 dark:bg-gray-100/50">
                <NotFound
                  title={ t("notifications.not-found") }
                  btnshow={ false }
                />
              </div>
            ) } */}
            <TabItem notifications={ unreadNotifications } markAsRead={ onMarkAsRead } />
          </Tab.Panel>
        </Tab.Panels>
      </Tab>
    </div>
  );
}
