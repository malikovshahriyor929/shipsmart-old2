"use client";

import { useState } from "react";
import { PiPencilSimple, PiTrash, PiNoteBold } from "react-icons/pi";
import ConfirmPopover from "../../ui/popover";
import cn from "@core/utils/class-names";
import { getRelativeTime } from "@core/utils/get-relative-time";
import { Id } from "@core/types";
import { t } from "i18next";

interface NoteCardProps {
  id: Id;
  note: string;
  created_at?: string;
  updated_at?: string;
  onEdit?: (id: Id, text: string) => void;
  onDelete?: (id: Id) => void;
}

export default function NoteCard({
  id,
  note,
  created_at,
  updated_at,
  onEdit,
  onDelete,
}: NoteCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = (note || "").length > 180;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white dark:bg-gray-100 p-5 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <PiNoteBold className="h-9 w-9 rounded-full bg-blue-50 p-2 text-mainBlue ring-1 ring-blue-100" />
          <div className="leading-tight min-w-0">
            <h3 className="text-sm font-semibold text-mainBlue">{t("commons.note")}</h3>
            <div className="text-[11px] text-gray-500">
              {getRelativeTime(updated_at || created_at || "")}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mt-4 flex-1 min-w-0">
        <p
          className={cn(
            // preserve newlines, wrap anywhere (even mid-word), add hyphenation, and never overflow
            "px-1 text-gray-700 whitespace-pre-wrap break-words hyphens-auto break-all",
            !expanded && isLong && "line-clamp-3"
          )}
        >
          {note}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-2 text-sm font-medium text-mainBlue hover:underline"
          >
            {expanded ? t("commons.view-less") : t("commons.view-more")}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center justify-end gap-3">
        <button
          onClick={() => onEdit?.(id, note)}
          className="rounded-full bg-mainBlue px-3 py-1.5 text-xs font-medium text-white hover:bg-mainBlue/90"
        >
          <PiPencilSimple className="mr-1 inline-block size-4" />
          {t("commons.edit")}
        </button>
        <ConfirmPopover
          trigger={
            <button className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200">
              <PiTrash className="mr-1 inline-block size-4 text-gray-600" />
              {t("commons.delete")}
            </button>
          }
          title={t("commons.note-card-delete-title") ?? "Delete Note"}
          description={
            t("commons.note-card-delete-desc") ??
            "Are you sure you want to delete this note?"
          }
          onConfirm={() => onDelete?.(id)}
        />
      </div>
    </div>
  );
}
