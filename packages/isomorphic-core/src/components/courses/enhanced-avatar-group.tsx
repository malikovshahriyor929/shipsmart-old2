"use client";

import { fullName } from "@core/utils/course-utils";
import { t } from "i18next";
import React from "react";
import { Text, Avatar, Popover } from "rizzui";

interface EnhancedAvatarGroupProps<T> {
  items: T[];
  students?: any[];
  maxDisplay?: number;
  onlyAvatars?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | string;
  renderPopover?: (item: T, onClose: () => void) => React.ReactNode;
  getAvatarName?: (item: T, index: number) => string;
  getAvatarSrc?: (item: T) => string | undefined;
  getKey?: (item: T, index: number) => string | number;
  countSuffix?: string | ((count: number) => string);
  className?: string;
  showCount?: boolean;
  spacing?: string;
  remainingCountBgColor?: string;
  remainingCountTextColor?: string;
}

export default function EnhancedAvatarGroup<T>({
  items,
  students,
  maxDisplay = 6,
  size = "sm",
  onlyAvatars = true,
  renderPopover,
  getAvatarName,
  getAvatarSrc,
  getKey,
  countSuffix,
  className = "",
  showCount = true,
  spacing = "-space-x-3",
  remainingCountBgColor = "bg-gray-100",
  remainingCountTextColor = "text-gray-600",
}: EnhancedAvatarGroupProps<T>) {
  const itemsToRender = items || students || [];

  const displayedItems = itemsToRender.slice(0, maxDisplay);
  const remaining = itemsToRender.length - maxDisplay;

  const defaultGetAvatarName = (item: any, index: number) =>
    item.name || item.fullName || item.title || `${t('commons.item')} ${index + 1}`;

  const defaultGetAvatarSrc = (item: any) =>
    item.avatar || item.image || item.avatarUrl || item.imageUrl;

  const defaultGetKey = (item: any, index: number) =>
    item.id || `${t('commons.item')}${index}`;
  const getEmail = (item: any) => item.email || item.user?.email || "";

  const getShortenedName = (item: any, index: number) => {
    const nameParts = getName(item, index).split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0].charAt(0)}. ${nameParts.slice(1).join(" ")}`;
    }
    return getName(item, index);
  };
  const getName = getAvatarName || defaultGetAvatarName;
  const getSrc = getAvatarSrc || defaultGetAvatarSrc;
  const getItemKey = getKey || defaultGetKey;

  // const getSuffix = (count: number) => {
  //   if (!countSuffix) {
  //     if (students) {
  //       return count === 1 ? "student" : "students";
  //     }
  //     return count === 1 ? "item" : "items";
  //   }

  //   return typeof countSuffix === "function" ? countSuffix(count) : countSuffix;
  // };
  const getSuffix = (count: number) => {
    if (typeof countSuffix === 'function') return countSuffix(count);
    if (typeof countSuffix === 'string') return countSuffix;

    // Default: smart plural for students vs generic items using existing keys
    if (students) {
      return count === 1
        ? t('commons.role.student')
        : t('courses.header-students');
    }
    return count === 1 ? t('commons.item') : t('commons.items');
  };

  return (
    <div className={ `flex items-center ${className}` }>
      {/* Stacked avatar group */ }
      <div className={ `flex ${spacing}` }>
        { displayedItems.map((item, index) => (
          <div className="relative" key={ getItemKey(item, index) }>
            { renderPopover ? (
              <Popover
                enableOverlay={ false }
                placement="bottom-start"
                arrowClassName="dark:text-gray-200"
              >
                <Popover.Trigger>
                  <div className="relative flex items-center gap-2 cursor-pointer">
                    <Avatar
                      src={ getSrc(item) }
                      name={ getName(item, index) }
                      size={
                        ["sm", "md", "lg", "xl", undefined].includes(
                          size as any
                        )
                          ? (size as "sm" | "md" | "lg" | "xl" | undefined)
                          : undefined
                      }
                      customSize={
                        !["sm", "md", "lg", "xl", undefined].includes(
                          size as any
                        )
                          ? size
                          : undefined
                      }
                      className="border-2 border-white ring-1 ring-transparent transition hover:z-10 hover:ring-mainBlue"
                    />
                    <div className="flex flex-col items-start gap-0.5 text-xs">
                      <p className="font-semibold text-gray-800">
                        { getName(item, index) }
                      </p>
                      <span className=" truncate max-w-52 text-gray-600">
                        { getEmail(item) }
                      </span>
                    </div>
                  </div>
                </Popover.Trigger>
                <Popover.Content className="z-[999] dark:bg-gray-200 dark:border-gray-300 ">
                  { ({ setOpen }) => renderPopover(item, () => setOpen(false)) }
                </Popover.Content>
              </Popover>
            ) : (
              <div className="flex items-center gap-2">
                {/* Simple avatar and name without popover */ }
                <Avatar
                  src={ getSrc(item) }
                  name={ getName(item, index) }
                  size={
                    ["sm", "md", "lg", "xl", undefined].includes(size as any)
                      ? (size as "sm" | "md" | "lg" | "xl" | undefined)
                      : undefined
                  }
                  customSize={
                    !["sm", "md", "lg", "xl", undefined].includes(size as any)
                      ? size
                      : undefined
                  }
                  className="border border-white ring-1 ring-transparent transition hover:z-10 hover:ring-mainBlue"
                />

                { !onlyAvatars ? (
                  <div className="flex flex-col items-start gap-0.5 text-xs">
                    <p className="font-semibold text-gray-800">
                      { getName(item, index) }
                    </p>
                    <span className="truncate max-w-52 text-gray-600">
                      { getEmail(item) }
                    </span>
                  </div>
                ) : (
                  <p className="text-xs font-semibold text-white">
                    { getShortenedName(item, index) }
                  </p>
                ) }
              </div>
            ) }
          </div>
        )) }
        { remaining > 0 && (
          <div
            className={ `z-10 flex items-center justify-center rounded-full border-2 border-white ${remainingCountBgColor} text-xs font-semibold ${remainingCountTextColor}` }
          >
            +{ remaining }
          </div>
        ) }
      </div>

      {/* Total items count */ }
      { showCount && (
        <Text className="ml-3">
          { itemsToRender.length } { getSuffix(itemsToRender.length) }
        </Text>
      ) }
    </div>
  );
}
