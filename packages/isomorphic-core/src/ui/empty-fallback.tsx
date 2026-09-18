import cn from "@core/utils/class-names";
import React from "react";
import { Empty, EmptyProductBoxIcon } from "rizzui";

interface GenericEmptyProps {
  className?: string;
  withBorder?: boolean;
  borderClassname?: string;
  text?: string;
  textClassName?: string;
  image?: React.ReactNode;
  imageClassName?: string;
}

export const EmptyFallback: React.FC<GenericEmptyProps> = ({
  className,
  withBorder = true,
  borderClassname = "rounded-md border border-dashed p-6",
  text = "No items added yet",
  textClassName,
  image,
  imageClassName = "size-40 w-full",
}) => {
  const defaultImage = <EmptyProductBoxIcon className={imageClassName} />;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 text-center",
        withBorder ? borderClassname : "",
        className
      )}
    >
      <Empty
        image={image || defaultImage}
        imageClassName={imageClassName}
        text={text}
        textClassName={textClassName}
      />
    </div>
  );
};
