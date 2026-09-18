"use client";

import React from "react";
import { Text, Title, Button, Badge } from "rizzui";
import {
  PiFile,
  PiDownload,
  PiEye,
  PiNewspaperClipping,
  PiNewspaper,
  PiFilePdfBold,
  PiFileDocBold,
  PiFileXlsBold,
  PiFileImageBold,
  PiFilePdfDuotone,
} from "react-icons/pi";
import cn from "@core/utils/class-names";
import { formatDate } from "@core/utils/format-date";
import Link from "next/link";
import { EmptyFallback } from "@core/ui/empty-fallback";
import forceDownload from "@core/utils/downlaod";
import { t } from "i18next";


interface TranscriptFile {
  fileName: string;
  extension: string;
  url: string;
  uploadedAt?: string;
  sizeBytes?: number;
}

interface TranscriptsTabProps {
  transcripts:
    | {
        file_name?: string;
        extension?: string;
        file_size?: number;
        url?: string;
        created_at?: string;
        from?: string;
      }[]
    | [];
}

function humanSize(bytes?: number) {
  if (!bytes || bytes <= 0) return "—";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

const TranscriptsTab: React.FC<TranscriptsTabProps> = ({ transcripts }) => {
  if (!transcripts?.length) {
    return <EmptyFallback withBorder text={t("profile.fallbacks.no-data")} />;
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-transparent">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-full bg-blue-50 p-2 dark:bg-blue-900/20">
            <PiFilePdfDuotone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <Title as="h3" className="text-lg font-semibold">
            {t("commons.files") ?? "Files"}
          </Title>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {transcripts.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-transparent"
            >
              {/* Preview thumbnail */}
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                title={t("profile.transcripts.open-transcript") ?? "Open transcript"}
              >
                {/* image preview; if non-image, browser will still open url in new tab */}
                {/* <img
                  src={file.url}
                  alt={file.fileName}
                  className="h-24 w-36 rounded-md border object-cover"
                /> */}
                {/* { getFileIconByExt(file.extension ?? '') } */}
              </a>

              <div className="min-w-0 flex-1">
                <Text className="truncate font-medium">{file.file_name}</Text>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                  {file.from && (
                    <span>{t("profile.transcripts.uploaded-from") ?? "Uploaded from"}: {file.from}</span>
                    // <span>Uploaded: { formatDate(new Date(file.created_at)) }</span>
                  )}
                  <span>{t("profile.transcripts.size") ?? "Size"}: {humanSize(file.file_size)}</span>
                </div>

                <div className="mt-2 flex gap-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-white dark:hover:bg-gray-800"
                  >
                    <PiEye className="h-4 w-4" />
                    {t("commons.open") ?? "Open"}
                  </a>
                  <Link
                    href={file.url ?? "#"}
                    download={file.url}
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        await forceDownload(file.url ?? "#", `${file.file_name}`);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-white dark:hover:bg-gray-800"
                  >
                    <PiDownload className="h-4 w-4" />
                    {t("commons.download") ?? "Download"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TranscriptsTab;
