import React from 'react';
import cn from '@core/utils/class-names';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl md:rounded-2xl ring-1 ring-inset ring-mainBlue/30 bg-white shadow-sm dark:bg-gray-100/40 dark:ring-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';

export default Card;
