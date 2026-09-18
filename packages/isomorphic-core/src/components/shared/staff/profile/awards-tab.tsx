import React from 'react';
import { Text, Title } from 'rizzui';
import {
  PiMedal,
  PiCalendar,
  PiBuildings,
  PiCurrencyDollar,
} from 'react-icons/pi';
import cn from '@core/utils/class-names';

interface Award {
  name: string;
  organization: string;
  year: string;
  amount?: string;
}

interface AwardsTabProps {
  awards: Award[];
}

const AwardsTab: React.FC<AwardsTabProps> = ({ awards }) => {
  // Award type colors
  const getAwardColor = (name: string) => {
    if (name.toLowerCase().includes('grant')) {
      return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/40';
    } else if (
      name.toLowerCase().includes('award') ||
      name.toLowerCase().includes('excellence')
    ) {
      return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/40';
    } else if (name.toLowerCase().includes('best')) {
      return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/40';
    } else {
      return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800/40';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {awards.map((award, index) => (
        <div
          key={index}
          className={cn(
            'relative overflow-hidden rounded-xl border p-5',
            getAwardColor(award.name)
          )}
        >
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-full bg-white/80 p-1.5 backdrop-blur-sm dark:bg-gray-900/80">
                <PiMedal className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              </div>
              <Title as="h3" className="text-lg font-bold">
                {award.name}
              </Title>
            </div>

            <div className="mb-3 space-y-2">
              <div className="flex items-center gap-2">
                <PiBuildings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Text className="text-sm text-gray-700 dark:text-gray-300">
                  {award.organization}
                </Text>
              </div>

              <div className="flex items-center gap-2">
                <PiCalendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Text className="text-sm text-gray-700 dark:text-gray-300">
                  {award.year}
                </Text>
              </div>

              {award.amount && (
                <div className="flex items-center gap-2">
                  <PiCurrencyDollar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {award.amount}
                  </Text>
                </div>
              )}
            </div>
          </div>

          {/* Decorative medal icon */}
          <div className="absolute -bottom-4 -right-4 opacity-10">
            <PiMedal className="h-24 w-24 text-amber-600 dark:text-amber-500" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AwardsTab;
