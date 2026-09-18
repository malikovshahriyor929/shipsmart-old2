'use client';

import { Badge } from 'rizzui';
import cn from '../utils/class-names';

const classes = {
  base: 'text-xs px-2 duration-200 py-0.5 font-normal capitalize border tracking-wider font-lexend bg-opacity-50 dark:bg-opacity-40 dark:text-opacity-90 dark:text-gray-900 dark:backdrop-blur',
  color: {
    success: 'border-green bg-green/30 text-green-lighter dark:bg-green',
    danger: 'border-red bg-red/70 text-white dark:bg-red',
    // add more colors here if needed
  },
  layout: {
    helium: {
      base: 'bg-opacity-40 text-opacity-90 text-gray-0 dark:text-gray-900 backdrop-blur group-hover:bg-opacity-100 group-hover:text-opacity-100',
      success: 'bg-green',
      danger: 'bg-red',
    },
    // other layouts can go here
  },
};

interface StatusBadgeProps {
  /** one of the keys in classes.color */
  color: keyof typeof classes.color;
  /** text or number to display inside the badge */
  content: string | number;
}

export default function StatusBadge({ color, content }: StatusBadgeProps) {

  return (
    <Badge
      variant="flat"
      size="sm"
      color={color}
      className={cn("bg-opacity-40 text-opacity-90 text-gray-0 dark:text-gray-900 backdrop-blur-md group-hover:bg-opacity-100 group-hover:text-opacity-100",
        classes.base,
        classes.color[color],
      )}
    >
      {content}
    </Badge>
  );
}
