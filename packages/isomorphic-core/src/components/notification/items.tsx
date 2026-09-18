import { NotificationItem } from "@core/types";
import cn from "@core/utils/class-names";
import { PiBellBold, PiCalendarPlusBold, PiChatCircleDotsBold, PiChatTeardropTextBold, PiClipboardTextBold, PiClockBold, PiHeadsetBold, PiWarningBold, PiXCircleBold } from "react-icons/pi";
import { Badge } from "rizzui/badge";
import { Button } from "rizzui/button";
import { Title } from "rizzui/typography";

export function TabItem({ notifications, markAsRead }: { notifications: NotificationItem[], markAsRead?: (id: string) => void }) {
  return <div className="grid grid-cols-1 gap-4">{
    notifications.map((n) => (
      <div
        key={ n.id }
        className={ cn(
          'flex items-start gap-3 rounded-lg border p-4 shadow-sm transition-all duration-200',
          n.is_read
            ? 'border-gray-200 bg-white dark:border-gray-100 dark:bg-gray-100/40'
            : 'border-blue-200 bg-blue-50/50 dark:border-gray-700 dark:bg-blue-300/10'
        ) }
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#043764]/10 dark:bg-gray-700/60">
          { getNotificationIcon(n.type.label) }
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="grid grid-cols-[1fr_250px]">
            <Title
              as="h4"
              className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-800 truncate"
            >
              { n.title }
            </Title>
            <div className='flex items-center justify-end gap-3 '>
              <Badge
                color={ n.is_read ? 'success' : 'primary' }
                variant={ n.is_read ? 'flat' : 'solid' }
                className="dark:bg-white dark:text-mainBlue    "
                size="sm"
              >
                { n.type.label }
              </Badge>
              <div className="flex items-center gap-3 ">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <PiClockBold className="h-3 w-3" />
                  { n.created_at }
                </div>
                { !n.is_read && (
                  <Button
                    size="sm"
                    variant="text"
                    color="danger"
                    className='p-0 m-0 h-6'
                    onClick={ () =>
                      markAsRead?.(n?.id?.toString())
                    }
                  >
                    <PiXCircleBold className="h-4 w-4" />
                  </Button>
                ) }
              </div>
            </div>
          </div>
          <div dangerouslySetInnerHTML={ { __html: n.message ?? "" } } className='whitespace-pre-wrap break-all text-gray-600 dark:text-gray-600' />
        </div>


      </div>
    )) }
  </div>
}
export function NotificationsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4">
      { Array.from({ length: 4 }).map((_, i) => (
        <div
          key={ i }
          className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white dark:border-gray-700/60 dark:bg-gray-800/40 p-4 shadow-sm"
        >
          {/* Icon placeholder */ }
          <div className="h-10 w-10 animate-pulse rounded-full bg-[#043764]/10 dark:bg-gray-700/60" />

          {/* Content placeholder */ }
          <div className="flex-1 space-y-3">
            {/* Top row: title + badge + time */ }
            <div className="grid grid-cols-[1fr_250px] gap-3">
              <div className="h-4 w-3/5 animate-pulse rounded-md bg-gray-200 dark:bg-gray-600" />
              <div className="flex items-center justify-end gap-3">
                <div className="h-4 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-600" />
                <div className="h-3 w-16 animate-pulse rounded-md bg-gray-200 dark:bg-gray-600" />
              </div>
            </div>

            {/* Message lines */ }
            <div className="space-y-2">
              <div className="h-3 w-11/12 animate-pulse rounded-md bg-gray-200 dark:bg-gray-600" />
              <div className="h-3 w-9/12 animate-pulse rounded-md bg-gray-200 dark:bg-gray-600" />
            </div>
          </div>
        </div>
      )) }
    </div>
  );
}

export const getNotificationIcon = (typeLabel: string) => {
  switch (typeLabel) {
    case 'Chat Message':
      return (
        <PiChatCircleDotsBold className="h-5 w-5 text-blue-500 dark:text-blue-400" />
      );
    case 'Session Create':
      return (
        <PiCalendarPlusBold className="h-5 w-5 text-green-600 dark:text-green-400" />
      );
    case 'Session Missing':
      return (
        <PiWarningBold className="h-5 w-5 text-amber-500 dark:text-amber-400" />
      );
    case 'Task Assign':
      return (
        <PiClipboardTextBold className="h-5 w-5 text-purple-500 dark:text-purple-400" />
      );
    case 'Task Comment':
      return (
        <PiChatTeardropTextBold className="h-5 w-5 text-teal-500 dark:text-teal-400" />
      );
    case 'Ticket Reply':
      return (
        <PiHeadsetBold className="h-5 w-5 text-red-500 dark:text-red-400" />
      );
    default:
      return (
        <PiBellBold className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      );
  }
};