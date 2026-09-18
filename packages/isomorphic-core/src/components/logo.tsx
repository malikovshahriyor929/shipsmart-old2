import React from "react";
interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  iconOnly?: boolean;
}

export default function Logo({ iconOnly = false, ...props }: IconProps) {
  return (
    <span className="inline-flex items-center gap-3 text-slate-950" {...props}>
      {!iconOnly && <span className="text-lg font-semibold">Admin Portal</span>}
    </span>
  );
}
