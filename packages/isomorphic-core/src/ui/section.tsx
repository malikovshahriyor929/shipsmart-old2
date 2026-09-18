import React from "react";
import cn from "@core/utils/class-names";

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  additional?: React.ReactNode;
  className?: string;
  childrenClassName?: string;
  iconClassName?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  icon,
  children,
  additional,
  className,
  childrenClassName,
  iconClassName,
}) => (
  <div className={cn("mb-6", className)}>
    <div className="mb-5 flex flex-wrap gap-3 flex-row justify-between items-center border-b border-dashed border-mainBlue/20 pb-2 dark:border-gray-800">
      <div className="flex items-center">
        <div
          className={cn(
            "rounded-md  p-2 bg-lightBlue/10 mr-2 text-mainBlue dark:bg-gray-700 dark:text-gray-100",
            iconClassName
          )}
        >
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-mainBlue dark:text-gray-800">
          {title}
        </h3>
      </div>
      {additional && <div className="mx-auto sm:mx-0">{additional}</div>}
    </div>
    <div className={childrenClassName}>{children}</div>
  </div>
);

export default Section;
