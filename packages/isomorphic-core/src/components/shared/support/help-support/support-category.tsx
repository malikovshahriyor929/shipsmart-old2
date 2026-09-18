import React from 'react';
import cn from '@core/utils/class-names';

interface SupportCategoryProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  active: boolean;
}

const SupportCategory: React.FC<SupportCategoryProps> = ({
  icon,
  title,
  description,
  onClick,
  active,
}) => {
  return (
    <div
      className={cn(
        'flex flex-1 cursor-pointer flex-col items-center rounded-lg border p-5 text-center transition-all duration-200',
        active
          ? 'border-blue-300 bg-blue-50 shadow-md dark:border-blue-800/30 dark:bg-blue-900/20'
          : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/50 dark:border-gray-300 dark:bg-gray-100/50 dark:hover:border-blue-800/20 dark:hover:bg-blue-900/10'
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'rounded-full p-3 transition-colors duration-200',
          active
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-800/30 dark:text-blue-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-200 dark:text-gray-600'
        )}
      >
        {icon}
      </div>
      <h3
        className={cn(
          'mt-4 text-lg font-semibold transition-colors duration-200',
          active
            ? 'text-blue-700 dark:text-blue-400'
            : 'text-gray-800 dark:text-gray-600'
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          'mt-1 text-sm transition-colors duration-200',
          active
            ? 'text-blue-600 dark:text-blue-300'
            : 'text-gray-500 dark:text-gray-500'
        )}
      >
        {description}
      </p>
    </div>
  );
};

export default SupportCategory;
