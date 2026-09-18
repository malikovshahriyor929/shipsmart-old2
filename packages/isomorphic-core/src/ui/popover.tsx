"use client";

import cn from "@core/utils/class-names";
import React from "react";
import { Popover, Title, Text, Button } from "rizzui";

interface ConfirmPopoverProps {
  trigger: React.ReactElement;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  contentClassName?: string;
  cancelClassName?: string;
  confirmClassName?: string;
  titleClassName?: string;
  textClassName?: string;
}

export default function ConfirmPopover({
  trigger,
  title = "Confirm",
  description = "Are you sure?",
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
  contentClassName,
  cancelClassName,
  confirmClassName,
  titleClassName,
  textClassName,
}: ConfirmPopoverProps) {
  return (
    <Popover>
      <Popover.Trigger>{trigger}</Popover.Trigger>
      <Popover.Content>
        {({ setOpen }) => (
          <div className={` ${contentClassName}`}>
            <Title
              as="h5"
              className={cn(
                "text-sm font-semibold text-gray-900",
                titleClassName
              )}
            >
              {title}
            </Title>
            <Text className={cn("text-sm text-gray-600", textClassName)}>
              {description}
            </Text>
            <div className="flex justify-end gap-3 mt-3">
              <Button
                size="sm"
                variant="outline"
                className={cancelClassName}
                onClick={() => {
                  setOpen(false);
                  onCancel?.();
                }}
              >
                {cancelText}
              </Button>
              <Button
                className={confirmClassName}
                size="sm"
                color="danger"
                onClick={() => {
                  setOpen(false);
                  onConfirm?.();
                }}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
}
