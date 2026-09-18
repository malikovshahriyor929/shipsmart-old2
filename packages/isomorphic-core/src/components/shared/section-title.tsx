import React from 'react';

interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ icon, title }) => (
  <div className="my-3 mr-2 flex flex-1 items-center border-b border-dashed border-gray-500 pb-3">
    <span className="mr-2 rounded-md bg-[#043764]/10 p-2 text-mainBlue dark:bg-gray-100 dark:text-blue-600">
      {icon}
    </span>
    <h3 className="text-lg font-bold text-mainBlue dark:text-gray-600">{title}</h3>
  </div>
);

export default SectionTitle;
