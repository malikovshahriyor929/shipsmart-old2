import { Avatar } from 'rizzui';
import cn from '@core/utils/class-names';

export default function ContactSkeleton({ count = 6, type }: { count?: number, type: string }) {
  return (
    <div className="flex-1 overflow-y-auto animate-pulse">
      { Array.from({ length: count }).map((_, i) => (
        <div
          key={ i }
          className={ cn(
            'flex items-center border-b border-gray-100 dark:border-gray-200 px-4 py-3'
          ) }
        >
          <div className="relative mr-3">
            <div className='h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700' />
          </div>
  
          <div className="flex flex-1 justify-between items-center overflow-hidden">
            {/* Chat name */ }
            <div className="flex flex-col gap-1 ">
              <div className="h-3.5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-40 rounded bg-gray-200 dark:bg-gray-700" />
            </div>

            { type == "chat" && (
              <div className='flex flex-col items-end gap-2'>
                <div className="h-2 w-10 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
            ) }
            {/* Last message */ }
          </div>
        </div>
      )) }
    </div>
  );
}
