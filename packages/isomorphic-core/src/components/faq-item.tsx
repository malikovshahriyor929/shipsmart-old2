import React, { ReactNode } from 'react';
import { Button, Text } from 'rizzui';
import {
  PiCaretDownBold,
  PiCaretUpBold,
  PiQuestionBold,
  PiMathOperations,
  PiNotePencilBold,
  PiUsersThreeBold,
  PiBookOpenBold,
  PiChartLineBold,
  PiArrowSquareOutBold,
  PiChatCenteredTextBold,
} from 'react-icons/pi';
import cn from '@core/utils/class-names';

interface FaqItemProps {
  question: string;
  answer: ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  category: string;
  Icon: ReactNode;
}

const FaqItem: React.FC<FaqItemProps> = ({
  question,
  answer,
  isExpanded,
  onToggle,
  category,
  Icon
}) => {
  return (
    <div
      className={ cn(
        'mb-4 overflow-hidden rounded-lg border transition-all duration-300 ease-in-out',
        isExpanded
          ? 'border-blue-200 shadow-md dark:border-blue-800/50'
          : 'border-gray-200 dark:border-gray-300'
      ) }
    >
      <div
        className={ cn(
          'flex cursor-pointer items-center justify-between p-4 transition-colors duration-200',
          isExpanded
            ? 'bg-blue-50/70 dark:bg-blue-900/20'
            : 'bg-white dark:bg-gray-100/50'
        ) }
        onClick={ onToggle }
      >
        <div className="flex items-center gap-3">
          <span
            className={ cn(
              'rounded-full p-2 transition-colors duration-200',
              isExpanded
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-400'
                : 'bg-[#043764]/10 text-[#043764] dark:bg-gray-200/50 dark:text-blue-400'
            ) }
          >
            { Icon }
          </span>
          <Text
            className={ cn(
              'text-base font-medium transition-colors duration-200',
              isExpanded
                ? 'text-blue-700 dark:text-blue-300'
                : 'dark:text-gray-600'
            ) }
          >
            { question }
          </Text>
        </div>
        <Button
          variant="text"
          className={ cn(
            'h-auto p-0 transition-colors duration-200',
            isExpanded
              ? 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          ) }
        >
          { isExpanded ? (
            <PiCaretUpBold className="h-5 w-5" />
          ) : (
            <PiCaretDownBold className="h-5 w-5" />
          ) }
        </Button>
      </div>

      <div
        className={ cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        ) }
      >
        <div className="border-t border-gray-200 bg-white p-5 dark:border-gray-300 dark:bg-gray-100/50">
          <div className="prose dark:prose-invert max-w-none">{ answer }</div>
        </div>
      </div>
    </div>
  );
};

export const categoryIcon = (name: string) => {
  const key = name.toLowerCase();
  if (key.includes('record')) return <PiNotePencilBold className="h-5 w-5" />;
  if (key.includes('student')) return <PiUsersThreeBold className="h-5 w-5" />;
  if (key.includes('platforma')) return <PiBookOpenBold className="h-5 w-5" />;
  if (key.includes('math')) return <PiMathOperations className="h-5 w-5" />;
  if (key.includes('metric') || key.includes('analytic')) return <PiChartLineBold className="h-5 w-5" />;
  if (key.includes('referral')) return <PiArrowSquareOutBold className="h-5 w-5" />;
  if (key.includes('comm')) return <PiChatCenteredTextBold className="h-5 w-5" />;
  return <PiQuestionBold className="h-5 w-5" />;
};
export default FaqItem;

