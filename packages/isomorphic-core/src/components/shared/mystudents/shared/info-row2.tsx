import React from 'react';
import { Text } from 'rizzui';

interface InfoRow2Props {
  label: string;
  value: string;
}

const InfoRow2: React.FC<InfoRow2Props> = ({ label, value }) => {
  return (
    <div className="flex w-full">
      <Text className="min-w-32 text-gray-500 dark:text-gray-400">
        {label}:
      </Text>
      <Text className="flex-1 font-medium">{value}</Text>
    </div>
  );
};

export default InfoRow2;
