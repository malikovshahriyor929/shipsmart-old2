"use client";

import EyeIcon from "@core/components/icons/eye";
import PencilIcon from "@core/components/icons/pencil";
import { ActionIcon, Flex, Tooltip } from "rizzui";
import Link from "next/link";
import cn from "@core/utils/class-names";
import DeletePopover from "../delete-popover";
import { t } from "i18next";

export default function TableRowActionGroup({
  onDelete,
  editUrl = "#",
  viewUrl = "#",
  deletePopoverTitle = t("commons.delete-the-appointment") ?? "Delete the appointment",
  deletePopoverDescription = t("commons.are-you-sure-delete-item") ?? "Are you sure you want to delete this item?",
  className,
}: {
  onDelete?: () => void;
  editUrl?: string;
  viewUrl?: string;
  deletePopoverTitle?: string;
  deletePopoverDescription?: string;
  className?: string;
}) {
  return (
    <Flex
      align="center"
      justify="end"
      gap="3"
      className={cn("pe-3", className)}
    >
      <Tooltip size="sm" content={t("commons.edit-item") ?? "Edit Item"} placement="top" color="invert">
        <Link href={editUrl}>
          <ActionIcon
            as="span"
            size="sm"
            variant="outline"
            aria-label={t("commons.edit-item") ?? "Edit Item"}
          >
            <PencilIcon className="size-4" />
          </ActionIcon>
        </Link>
      </Tooltip>
      <Tooltip size="sm" content={t("commons.view-item") ?? "View Item"} placement="top" color="invert">
        <Link href={viewUrl}>
          <ActionIcon
            as="span"
            size="sm"
            variant="outline"
            aria-label={t("commons.view-item") ?? "View Item"}
          >
            <EyeIcon className="size-4" />
          </ActionIcon>
        </Link>
      </Tooltip>
      <DeletePopover
        title={deletePopoverTitle}
        description={deletePopoverDescription}
        onDelete={onDelete}
      />
    </Flex>
  );
}
