"use client";
import cn from "@core/utils/class-names";

export default function Shimmer({
  className,
  rounded = "rounded-md",
}: {
  className?: string;
  rounded?: string; 
}) {
  return (
    <div
      className={cn("relative overflow-hidden bg-gray-200", rounded, className)}
    >
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/20"
        style={{ animation: "tg-shimmer 1.4s infinite" }}
      />
      <style>{`
        @keyframes tg-shimmer {
          to {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
