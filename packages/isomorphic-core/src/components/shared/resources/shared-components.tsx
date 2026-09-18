import React, { ReactNode } from 'react';
import cn from '@core/utils/class-names';
import {
  PiLightbulbBold,
  PiWarningBold,
  PiShieldCheckBold,
  PiCheckCircleBold,
} from 'react-icons/pi';

// InfoBadge component
interface InfoBadgeProps {
  children: ReactNode;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  icon?: ReactNode;
  className?: string;
}
export const InfoBadge: React.FC<InfoBadgeProps> = ({
  children,
  color = 'blue',
  icon,
  className,
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    green:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    amber:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    purple:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
        colorClasses[color],
        className
      )}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};

// Alert box component
interface AlertBoxProps {
  type?: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  children: ReactNode;
}
export const AlertBox: React.FC<AlertBoxProps> = ({
  type = 'info',
  title,
  children,
}) => {
  const typeClasses = {
    info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800/30 dark:bg-blue-900/20 dark:text-blue-300',
    warning:
      'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/30 dark:bg-amber-900/20 dark:text-amber-300',
    danger:
      'border-red-200 bg-red-50 text-red-800 dark:border-red-800/30 dark:bg-red-900/20 dark:text-red-300',
    success:
      'border-green-200 bg-green-50 text-green-800 dark:border-green-800/30 dark:bg-green-900/20 dark:text-green-300',
  };

  const icons = {
    info: <PiLightbulbBold className="h-5 w-5" />,
    warning: <PiWarningBold className="h-5 w-5" />,
    danger: <PiShieldCheckBold className="h-5 w-5" />,
    success: <PiCheckCircleBold className="h-5 w-5" />,
  };

  return (
    <div className={cn('my-4 rounded-lg border p-4', typeClasses[type])}>
      <div className="flex items-center gap-2 font-semibold">
        {icons[type]}
        {title}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
};
// Score level badge component
interface ScoreLevelBadgeProps {
  level: number;
  label: string;
}

export const ScoreLevelBadge: React.FC<ScoreLevelBadgeProps> = ({ level, label }) => {
  const getLevelColor = () => {
    switch (level) {
      case 1: return { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", ring: "ring-red-500/30" };
      case 2: return { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", ring: "ring-amber-500/30" };
      case 3: return { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", ring: "ring-blue-500/30" };
      case 4: return { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", ring: "ring-green-500/30" };
      default: return { bg: "bg-gray-100", text: "text-gray-700", ring: "ring-gray-500/30" };
    }
  };

  const { bg, text, ring } = getLevelColor();

  return (
    <div>
      <div className={`flex items-center gap-2 rounded-full ${bg} px-3 py-1 ${text} ring-1 ${ring}`}>
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-gray-50/40 text-xs font-bold">
          {level}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
};

// Navigation step component
interface NavStepProps {
  number: number;
  children: ReactNode;
}
export const NavStep: React.FC<NavStepProps> = ({ number, children }) => {
  return (
    <div className="mb-2 flex items-start gap-2">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
        {number}
      </div>
      <div>{children}</div>
    </div>
  );
};

