import React from 'react';
import { Text } from 'rizzui';

interface InfoBlockProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ icon, title, value }) => {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 h-fit w-fit rounded-md bg-gray-100 p-2 dark:bg-gray-200/70">
        {icon}
      </div>
      <div>
        <Text className="font-medium text-gray-500 dark:text-gray-400">
          {title}
        </Text>
        <Text className="mt-0.5 font-medium text-primary" >{value}</Text>
      </div>
    </div>
  );
};

export default InfoBlock;
