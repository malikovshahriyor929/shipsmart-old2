"use client";

import React from "react";
import { Text, AvatarProps, Badge } from "rizzui";
import cn from "../utils/class-names";
import Avatar from "@core/components/avatar";

interface AvatarCardProps {
  src: string;
  name: string;
  description?: React.ReactNode;

  className?: string;
  avatarClassName?: string;
  nameClassName?: string;
  descriptionClassName?: string;

  avatarProps?: AvatarProps;

  isOnline?: boolean;
}

export default function AvatarCard({
  src,
  name,
  description,
  className,
  avatarClassName,
  nameClassName,
  descriptionClassName,
  avatarProps,
  isOnline = false,
}: AvatarCardProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative inline-flex", avatarClassName)}>
        <Avatar
          className="size-10 min-h-10 min-w-10"
          name={name}
          src={src}
          {...avatarProps}
        />
        {isOnline && (
          <Badge
            color={isOnline ? "success" : "danger"}
            renderAsDot
            enableOutlineRing
            className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4"
          />
        )}
      </div>

      <div className="flex flex-col">
        <Text className={cn("font-medium text-gray-900", nameClassName)}>
          {name}
        </Text>
        {description != null && (
          <Text
            className={cn("text-[13px] text-gray-500", descriptionClassName)}
          >
            {description}
          </Text>
        )}
      </div>
    </div>
  );
}
