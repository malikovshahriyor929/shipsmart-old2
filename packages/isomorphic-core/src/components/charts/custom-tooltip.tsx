"use client";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { TooltipProps } from "recharts";
import { Text } from "rizzui";
import cn from "../../utils/class-names";
import { addSpacesToCamelCase } from "../../utils/add-spaces-to-camel-case";
import { formatNumber } from "../../utils/format-number";

// Improved color validation to handle more formats
function getValidColor(
  color: string | undefined,
  fallbackColor: string | undefined
) {
  // If color is undefined, use fallback
  if (!color) return fallbackColor || "#cccccc";

  // Handle hex colors
  if (color.startsWith("#")) return color;

  // Handle rgb/rgba colors
  if (color.startsWith("rgb")) return color;

  // Handle named colors
  if (typeof color === "string" && color.match(/^[a-zA-Z]+$/)) return color;

  // Default fallback
  return fallbackColor || "#cccccc";
}

export interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  prefix?: string;
  postfix?: string;
  className?: string;
  formattedNumber?: boolean;
}

export function CustomTooltip({
  label,
  prefix,
  active,
  postfix,
  payload,
  className,
  formattedNumber,
}: CustomTooltipProps) {
  if (!active) return null;

  return (
    <div
      className={cn(
        "rounded-md border border-gray-300 bg-gray-0 shadow-2xl dark:bg-gray-100",
        className
      )}
    >
      <Text className="label mb-0.5 block bg-gray-100 p-2 px-2.5 text-center font-lexend text-xs font-semibold capitalize text-gray-600 dark:bg-gray-200/60 dark:text-gray-700 rounded-t-md">
        {label}
      </Text>
      <div className="px-3 py-1.5 text-xs">
        {payload?.map((item: any, index: number) => {
          // Get the color in this order: color → fill → stroke → fallback
          const dotColor = getValidColor(
            item.color || (item.fill !== "#fff" ? item.fill : null),
            item.stroke
          );

          return (
            <div
              key={item.dataKey + index}
              className="chart-tooltip-item flex items-center py-1.5"
            >
              <span
                className="me-1.5 h-2 w-2 rounded-full"
                style={{ backgroundColor: dotColor }}
              />
              <Text>
                <Text as="span" className="capitalize">
                  {addSpacesToCamelCase(item.dataKey)}:
                </Text>{" "}
                <Text
                  as="span"
                  className="font-medium text-gray-900 dark:text-gray-700"
                >
                  {prefix && prefix}
                  {formattedNumber ? formatNumber(item.value) : item.value}
                  {postfix && postfix}
                </Text>
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
}
