import React from "react";
import { PiDownloadSimple } from "react-icons/pi";
import { Tooltip } from "rizzui";
import { t } from "i18next";

type RowFieldVariant = "blue" | "purple" | "green" | "warning";

const VARIANT_STYLES: Record<
  RowFieldVariant,
  {
    iconBg: string;
    iconText: string;
    fileBg: string;
    fileText: string;
  }
> = {
  blue: {
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconText: "text-blue-600 dark:text-blue-400",
    fileBg: "bg-blue-100 dark:bg-blue-900/40",
    fileText: "text-blue-600 dark:text-blue-400",
  },
  purple: {
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    iconText: "text-purple-600 dark:text-purple-400",
    fileBg: "bg-purple-100 dark:bg-purple-900/40",
    fileText: "text-purple-600 dark:text-purple-400",
  },
  green: {
    iconBg: "bg-green-100 dark:bg-green-900/40",
    iconText: "text-green-600 dark:text-green-400",
    fileBg: "bg-green-100 dark:bg-green-900/40",
    fileText: "text-green-600 dark:text-green-400",
  },
  warning: {
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconText: "text-amber-600 dark:text-amber-400",
    fileBg: "bg-amber-100 dark:bg-amber-900/40",
    fileText: "text-amber-600 dark:text-amber-400",
  },
};

export interface BaseRowFieldProps {
  id?: string;
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  type?: "file" | "text";
  variant?: RowFieldVariant;
  onFileDownload?: () => void;
}

function GenericRowField({
  id,
  icon,
  label,
  value,
  type = "text",
  variant = "blue",
  onFileDownload,
}: BaseRowFieldProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div id={id} className="flex items-center gap-4 w-full">
      <div
        className={`flex h-12 w-12 min-w-12 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconText}`}
      >
        {icon}
      </div>
      <div className="min-w-0 w-full">
        <div className="text-sm text-slate-500 flex items-center justify-start gap-3">
          <p className="dark:text-gray-500">{label ?? "—"}</p>
          {type === "file" && (
            <Tooltip size="sm" color="invert" content={t("commons.download") ?? "Download"}>
              <button
                type="button"
                onClick={onFileDownload}
                className={`rounded-md px-1 py-1 ${styles.fileBg}`}
              >
                <PiDownloadSimple className={`size-4 ${styles.fileText}`} />
              </button>
            </Tooltip>
          )}
        </div>
        <div className="truncate text-[15px] font-semibold leading-6 text-[#0F274F] dark:text-white">
          {value || "—"}
        </div>
      </div>
    </div>
  );
}

/**
 * Backwards-compatible named exports using the generic component
 */

export function RowField(
  props: Omit<BaseRowFieldProps, "variant" | "type"> & {
    type?: "file" | "text";
  }
) {
  return <GenericRowField {...props} variant="blue" />;
}

export function RowFieldPurple(props: Omit<BaseRowFieldProps, "variant">) {
  return <GenericRowField {...props} variant="purple" />;
}

export function RowFieldGreen(props: Omit<BaseRowFieldProps, "variant">) {
  return <GenericRowField {...props} variant="green" />;
}

export function RowFieldWarning(
  props: Omit<BaseRowFieldProps, "variant" | "type"> & {
    type?: "file" | "text";
  }
) {
  return <GenericRowField {...props} variant="warning" />;
}
