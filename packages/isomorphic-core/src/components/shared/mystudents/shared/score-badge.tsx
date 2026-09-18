import React from 'react';

interface ScoreBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  icon,
  label,
  value,
  color,
}) => {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full ${color} px-3 py-1 text-white`}
    >
      {icon}
      <span className="text-sm font-medium">{label}:</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
};

export default ScoreBadge;
