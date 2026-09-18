import React from 'react';
import cn from '@core/utils/class-names';
import { Text } from 'rizzui';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  icon,
  children,
  className,
}) => (
  <div className={cn('mb-6', className)}>
    <div className="mb-4 flex items-center border-b border-dashed border-gray-200 pb-2 dark:border-gray-800">
      <div className="mr-2 rounded-md bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-mainBlue dark:text-gray-600">
        {title}
      </h3>
    </div>
    <div>{children}</div>
  </div>
);

export default Section;
