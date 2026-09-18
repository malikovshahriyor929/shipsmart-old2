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
  labelWidth = 'max-w-30',
}) => {
  return (
    <div className="flex flex-1 items-start gap-2">
      {icon && <span className="text-gray-500 dark:text-gray-400">{icon}</span>}
      <div className="flex flex-1">
        <Text className={`min-w-24 font-semibold text-gray-500 dark:text-gray-500/80`}>
          {label}:
        </Text>
        <Text className="flex-1 font-medium text-start">{value}</Text>
      </div>
    </div>
  );
};

export default InfoRow;
