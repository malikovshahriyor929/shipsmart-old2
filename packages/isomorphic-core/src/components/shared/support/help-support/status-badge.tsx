import React from 'react';
import cn from '@core/utils/class-names';

// Update the type to allow any string but provide specific styling for known values
interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Map status to a standard format (lower case, hyphenated)
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-');

  // Define styling for known statuses
  const getStatusClasses = (status: string) => {
    switch (normalizedStatus) {
      case 'pending':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'resolved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'closed':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400';
      default:
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'; // Default styling
    }
  };

  // Format display text (capitalize first letter of each word)
  const getDisplayText = (status: string) => {
    return status
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Determine badge dot color
  const getDotColor = (status: string) => {
    switch (normalizedStatus) {
      case 'pending':
        return 'bg-amber-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'resolved':
        return 'bg-green-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-purple-500';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        getStatusClasses(normalizedStatus)
      )}
    >
      <span
        className={cn(
          'mr-1.5 h-1.5 w-1.5 rounded-full',
          getDotColor(normalizedStatus)
        )}
      ></span>
      {getDisplayText(normalizedStatus)}
    </span>
  );
};

export default StatusBadge;
