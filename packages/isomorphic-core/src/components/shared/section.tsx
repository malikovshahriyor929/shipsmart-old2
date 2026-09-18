import React from 'react';
import cn from '@core/utils/class-names';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  additional?: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  icon,
  children,
  additional,
  className,
}) => (
  <div className={cn('mb-6', className)}>
    <div className="mb-5 flex items-center border-b border-dashed border-mainBlue/20 pb-2 dark:border-gray-800">
      <div className="flex items-center">
        <div className="mr-2 rounded-md bg-blue-50 p-2 text-mainBlue dark:bg-blue-900/30 dark:text-blue-400">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-mainBlue dark:text-gray-600">
          {title}
        </h3>
      </div>
        {additional && <div className="ml-auto">{additional}</div>}
    </div>
    <div>{children}</div>
  </div>
);

export default Section;
