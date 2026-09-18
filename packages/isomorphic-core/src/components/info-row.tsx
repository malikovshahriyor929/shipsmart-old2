import React from 'react';
import { Text } from 'rizzui';

interface InfoRowProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
  labelWidth?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  labelWidth = 'min-w-32',
}) => {
  return (
    <div className="flex items-center gap-2">
      {icon && <span className="text-gray-500 dark:text-gray-400">{icon}</span>}
      <div className="flex flex-1">
        <Text className={`${labelWidth} font-semibold text-gray-500 dark:text-gray-500/80`}>
          {label}:
        </Text>
        <Text className="flex-1 font-medium">{value}</Text>
      </div>
    </div>
  );
};

export default InfoRow;
