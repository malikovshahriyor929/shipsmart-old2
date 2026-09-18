"use client";

import React from "react";
import {
  RowField,
  RowFieldGreen,
  RowFieldPurple,
  RowFieldWarning,
} from "@core/components/profile/row-fields";
import { PiFilePdf } from "react-icons/pi";
import formatFileSize from "@core/utils/file-size-finder";
import forceDownload from "@core/utils/downlaod";

type ProfileRowVariant = "blue" | "green" | "purple" | "warning";

const VARIANT_COMPONENT_MAP: Record<
  ProfileRowVariant,
  (props: {
    id?: string;
    icon: React.ReactNode;
    label: string;
    value?: React.ReactNode;
    type?: "file" | "text";
    onFileClick?: () => void;
    onFileDownload?: () => Promise<void>;
  }) => React.ReactElement
> = {
  blue: RowField,
  green: RowFieldGreen,
  purple: RowFieldPurple,
  warning: RowFieldWarning,
};

export interface ProfileSectionField {
  id?: string;
  icon?: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  variant?: ProfileRowVariant;
  type?: "file" | "text";
  href?: string;
  target?: string;

  fileLabel?: string;
  fileSize?: number;
  filePreviewUrl?: string;
}

export interface ProfileSectionProps {
  title: React.ReactNode;
  className?: string;
  fields?: ProfileSectionField[];
  columns?: 1 | 2;
  emptyMessage?: React.ReactNode;
  children?: React.ReactNode;
}

export function ProfileSection({
  title,
  className,
  fields,
  columns = 2,
  emptyMessage,
  children,
}: ProfileSectionProps) {
  const hasFields = fields && fields.length > 0;

  return (
    <section
      className={`rounded-xl border border-gray-200 bg-white dark:bg-gray-100 p-5 shadow-sm ${
        className ?? ""
      }`}
    >
      <h3 className="text-[22px] font-semibold text-[#0F274F]">{title}</h3>
      <div className="mt-2 h-px w-full border-t border-dashed border-slate-200" />

      {!hasFields && emptyMessage && (
        <div className="mt-4 rounded-md bg-gray-50 p-4 text-sm text-gray-600">
          {emptyMessage}
        </div>
      )}

      {hasFields && (
        <div
          className={`mt-6 grid grid-cols-1 gap-6 ${
            columns > 1 ? "sm:grid-cols-2" : ""
          }`}
        >
          {fields!.map((field, idx) => {
            const {
              id,
              icon,
              label,
              value,
              variant = "blue",
              type = "text",
              href,
              fileLabel,
              fileSize,
              filePreviewUrl,
            } = field;

            const onFileClick =
              type === "file" && href
                ? () =>
                    window.open(
                      href,
                      field.target ?? "_blank",
                      "noopener,noreferrer"
                    )
                : undefined;
            const onFileDownload =
              type === "file" && href
                ? async () => await forceDownload(href ?? "", fileLabel)
                : undefined;

            const FieldComponent = VARIANT_COMPONENT_MAP[variant] ?? RowField;
            const fileSizeLabel = formatFileSize(fileSize as number);

            // --- icon ---
            let finalIcon = icon;
            if (!finalIcon && type === "file") {
              if (filePreviewUrl) {
                finalIcon = (
                  <img
                    src={filePreviewUrl}
                    alt={label}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                );
              } else {
                finalIcon = <PiFilePdf className="h-6 w-6" />;
              }
            }

            // --- value ---
            let finalValue = value;
            if (
              !finalValue &&
              type === "file" &&
              (fileLabel || fileSizeLabel)
            ) {
              finalValue = (
                <div className="flex items-center gap-1">
                  <span onClick={onFileClick} className="cursor-pointer">
                    {fileLabel}
                  </span>
                  {fileSizeLabel && (
                    <span className="text-xs text-gray-600 font-normal">
                      ({fileSizeLabel})
                    </span>
                  )}
                </div>
              );
            }

            return (
              <FieldComponent
                key={id ?? `${label}-${idx}`}
                id={id}
                icon={finalIcon ?? <PiFilePdf className="h-6 w-6" />} // fallback
                label={label}
                value={finalValue}
                type={type}
                onFileClick={onFileClick}
                onFileDownload={onFileDownload}
              />
            );
          })}

          {children}
        </div>
      )}
    </section>
  );
}
