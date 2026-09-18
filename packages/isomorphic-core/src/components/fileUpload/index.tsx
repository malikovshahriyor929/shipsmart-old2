"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { t } from "i18next";
import { PiFilePdf } from "react-icons/pi";
import { BsX } from "react-icons/bs";
import { Button } from "rizzui/button";
import { Tooltip } from "rizzui/tooltip";
import { getSession } from "next-auth/react";
import { UploadResult } from "@core/types";

type Props = {
  value?: UploadResult[];
  onChange: (next: UploadResult[]) => void;
  uploadedFiles: UploadResult[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadResult[]>> | ((next: UploadResult[]) => void);
  label?: string;
  error?: string;
  accept?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  uploadUrl?: string;
  filesFieldName?: string;
  maxCount?: number;
  maxSizeBytes?: number;
  oneTime?: boolean;
  placeHoleder?: string;
  tooltip?: string;
  tooltipPlacement?:
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "top-start"
    | "top-end"
    | "right-start"
    | "right-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end";
};

function isValidUpload(u: UploadResult | undefined | null): u is UploadResult {
  return (
    !!u &&
    typeof u.public_id === "string" &&
    u.public_id.trim() !== "" &&
    typeof u.file_name === "string" &&
    u.file_name.trim() !== ""
  );
}

function humanSize(bytes?: number): string | null {
  if (!bytes || bytes <= 0) return null;
  const units = ["B", "KB", "MB", "GB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function normalizeUploadResponse(payload: any): UploadResult[] {
  const data = payload?.data ?? payload;
  if (!data) return [];
  const list = Array.isArray(data) ? data : [data];
  return list.filter(isValidUpload);
}

export default function MultiAttachmentPicker({
  value,
  onChange,
  label = "Attachments",
  uploadedFiles,
  setUploadedFiles,
  uploadUrl = "/v1/attachments/upload",
  filesFieldName = "files[]",
  accept,
  disabled,
  className,
  buttonClassName,
  oneTime,
  placeHoleder,
  error,
  tooltip,
  tooltipPlacement = "top",
  maxCount,
  maxSizeBytes,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const currentRaw = Array.isArray(value) ? value : [];
  const current = useMemo(() => currentRaw.filter(isValidUpload), [currentRaw]);

  useEffect(() => {
    if (currentRaw.length !== current.length) {
      onChange(current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRaw.length, current.length]);

  const reachedMax =
    typeof maxCount === "number" && maxCount > 0
      ? current.length >= maxCount
      : false;

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    e.currentTarget.value = "";
    if (!file) return;

    if (maxSizeBytes && file.size > maxSizeBytes) return;
    if (reachedMax) return;

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append(filesFieldName, file, file.name);

      const session = await getSession();
      const token = (session as any)?.user?.accessToken as string | undefined;
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: fd,
        credentials: "include",
        headers,
      });

      const body: any = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          body?.message || `Upload failed with status ${res.status}`
        );
      }

      const cleaned = normalizeUploadResponse(body);
      const next = [
        ...current,
        ...cleaned.filter(
          (u) => !current.some((x) => x.public_id === u.public_id)
        ),
      ];
      onChange(next);

      const merged = [
        ...(Array.isArray(uploadedFiles) ? uploadedFiles : []),
        ...cleaned.filter(
          (u) =>
            !(Array.isArray(uploadedFiles) ? uploadedFiles : []).some(
              (x) => x.public_id === u.public_id
            )
        ),
      ];
      setUploadedFiles(merged);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const removeById = (id: string) => {
    const next = current.filter((x) => x.public_id !== id);
    onChange(next);
    setUploadedFiles(next);
  };

  return (
    <div className={`flex w-full flex-col gap-2 ${className || ""}`}>
      <div className="flex items-end gap-4">
        <div>
          {label &&
            (tooltip ? (
              <Tooltip placement={tooltipPlacement} content={tooltip}>
                <label
                  className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-600"
                  htmlFor="attachments"
                >
                  {label}
                </label>
              </Tooltip>
            ) : (
              <label
                className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-600"
                htmlFor="attachments"
              >
                {label}
              </label>
            ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className={`${buttonClassName || ""} dark:bg-transparent dark:text-gray-600 dark:border-[#424242] dark:hover:border-gray-600 dark:hover:text-gray-600 `}
            disabled={disabled || isUploading || reachedMax}
          >
            <PiFilePdf className="h-4 w-4" />
            <span className="ml-2">
              {isUploading ? "Uploading..." : placeHoleder || "Upload"}
            </span>
          </Button>

          {error ? <p className="mt-1 text-sm text-red-500">{error}</p> : null}
          {reachedMax ? (
            <p className="mt-1 text-xs text-gray-500">
              {t('commons.max-files-allowed', { count: maxCount }) ??
                `Maximum ${maxCount} file(s) allowed.`}
            </p>
          ) : null}
        </div>

        <input
          id="attachments"
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept={accept}
          multiple={false}
          onChange={handleUpload}
          disabled={disabled}
        />
      </div>

      {current.length > 0 && (
        <div className="mb-1 flex max-w-full flex-wrap gap-2">
          {current.map((item) => {
            const displayName = item.file_name?.trim() || "Attachment";
            const sizeStr = humanSize(item.file_size);

            return (
              <div
                key={item.public_id}
                className="flex flex-nowrap items-center gap-2 rounded-full bg-gray-100 px-3 py-1 "
              >
                <PiFilePdf className="h-4 w-4" />
                <span className="max-w-[240px] truncate text-sm">
                  {displayName}
                </span>
                {sizeStr ? (
                  <span className="max-w-[240px] truncate text-sm">
                    {sizeStr}
                  </span>
                ) : null}
                <button
                  type="button"
                  aria-label={`Remove ${displayName}`}
                  onClick={() => removeById(item.public_id)}
                  className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <BsX className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
