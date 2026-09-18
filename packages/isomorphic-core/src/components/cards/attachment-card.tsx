"use client";

import { Button, Tooltip } from "rizzui";
import {
  PiFilePdf,
  PiFile,
  PiFileDoc,
  PiFileXls,
  PiFileZip,
} from "react-icons/pi";
import { PLACEHOLDER_THUMB } from "@core/config/constants";
import { t } from "i18next";
import { ApiThumb } from "@core/types";

interface AttachmentCardProps {
  attachment: ApiThumb;
}

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
const MAX_ATTACHMENT_TITLE = 36;

function getFileIcon(ext: string = "") {
  const extension = ext.toLowerCase().replace(".", "");
  if (extension === "pdf")
    return <PiFilePdf className="h-8 w-8 text-red-500" />;
  if (["doc", "docx"].includes(extension))
    return <PiFileDoc className="h-8 w-8 text-blue-500" />;
  if (["xls", "xlsx"].includes(extension))
    return <PiFileXls className="h-8 w-8 text-green-500" />;
  if (["zip", "rar", "7z"].includes(extension))
    return <PiFileZip className="h-8 w-8 text-yellow-500" />;
  return <PiFile className="h-8 w-8 text-gray-400" />;
}

export default function AttachmentCard({ attachment }: AttachmentCardProps) {
  const ext = (attachment?.extension || "").toLowerCase().replace(".", "");
  const isImage = IMAGE_EXTENSIONS.includes(ext);
  const name = attachment?.file_name || t("commons.attachment") || "Attachment";
  const isLongTitle = name.length > MAX_ATTACHMENT_TITLE;
  const displayName = isLongTitle
    ? `${name.slice(0, MAX_ATTACHMENT_TITLE - 1)}…`
    : name;

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
          {isImage ? (
            <img
              src={attachment?.url || PLACEHOLDER_THUMB}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            getFileIcon(ext)
          )}
        </div>
        <div className="min-w-0 flex-1">
          {isLongTitle ? (
            <Tooltip content={name} color="invert" placement="top-start" size="sm">
              <p className="max-w-[220px] truncate font-medium text-gray-900 dark:text-gray-100 sm:max-w-[280px]">
                {displayName}
              </p>
            </Tooltip>
          ) : (
            <p className="max-w-[220px] truncate font-medium text-gray-900 dark:text-gray-100 sm:max-w-[280px]">
              {displayName}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="uppercase">{ext || "file"}</span>
            {attachment?.size && (
              <>
                <span>•</span>
                <span>{attachment.size}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="ml-auto shrink-0"
        onClick={() => window.open(attachment?.url, "_blank")}
      >
        {t("commons.open") || "Open"}
      </Button>
    </div>
  );
}
