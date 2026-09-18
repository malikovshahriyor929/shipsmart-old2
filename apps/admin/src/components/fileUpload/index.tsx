'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { t } from 'i18next';
import { PiFilePdfBold } from 'react-icons/pi';
import { BsX } from 'react-icons/bs';
import axiosInstance from '@/server/api';
import { Button } from 'rizzui/button';
import { UploadResult } from '@core/types';
import { Tooltip } from 'rizzui/tooltip';

type Props = {
  value?: UploadResult[];
  onChange: (next: UploadResult[]) => void;
  uploadedFiles: UploadResult[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadResult[]>>;
  label?: string | React.ReactNode;
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
  placeHoleder?: string; // keeping original prop name for compatibility
  tooltip?: string;
  tooltipPlacement?: 'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end';
};

function isValidUpload(u: UploadResult | undefined | null): u is UploadResult {
  return !!u && typeof u.public_id === 'string' && u.public_id.trim() !== '' &&
         typeof u.file_name === 'string' && u.file_name.trim() !== '';
}

function humanSize(bytes?: number): string | null {
  if (!bytes || bytes <= 0) return null; // <= 0 bo‘lsa hech narsa ko‘rsatmaymiz
  const units = ['B', 'KB', 'MB', 'GB'];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export default function MultiAttachmentPicker({
  value,
  onChange,
  label = 'Attachments',
  uploadedFiles,
  setUploadedFiles,
  uploadUrl = '/v1/attachments/upload',
  filesFieldName = 'files[]',
  accept,
  disabled,
  className,
  buttonClassName,
  oneTime,
  placeHoleder,
  error,
  tooltip,
  tooltipPlacement = 'top',
  maxCount,
  maxSizeBytes,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const currentRaw = useMemo(() => (Array.isArray(value) ? value : []), [value]);

  // Placeholder/bo'sh elementlarni ekranga chiqarmaslik uchun display ro'yxat
  const current = useMemo(() => currentRaw.filter(isValidUpload), [currentRaw]);

  // Agar tashqaridan placeholder kelib qolsa, state’ni tozalab yuboramiz (1 marta diff bo‘lsa)
  useEffect(() => {
    if (currentRaw.length !== current.length) {
      onChange(current); // tozalangan ro'yxatni qaytarib yozamiz
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRaw.length, current.length]);

  const reachedMax = typeof maxCount === 'number' && maxCount > 0 ? current.length >= maxCount : false;

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    e.currentTarget.value = ''; // input reset
    if (!file) return;

    if (maxSizeBytes && file.size > maxSizeBytes) {
      // ixtiyoriy: bu yerda toast qo'yishingiz mumkin
      console.warn('File too large');
      return;
    }
    if (reachedMax) {
      console.warn('Max file count reached');
      return;
    }

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append(filesFieldName, file, file.name);

      const res = await axiosInstance.post(uploadUrl, fd);
      const payload = res?.data?.data ?? res?.data;

      // API bitta yoki massiv qaytarishi mumkin
      const uploadedList: UploadResult[] = Array.isArray(payload) ? payload : [payload];

      // Faqat to‘liq (valid) elementlarni olamiz va duplicate’larni olmaslik
      const cleaned = uploadedList.filter(isValidUpload);

      const next = [
        ...current,
        ...cleaned.filter((u) => !current.some((x) => x.public_id === u.public_id)),
      ];
      onChange(next);
      setUploadedFiles((prev) => {
        const base = Array.isArray(prev) ? prev : [];
        const merged = [
          ...base,
          ...cleaned.filter((u) => !base.some((x) => x.public_id === u.public_id)),
        ];
        return merged;
      });
    } catch (err) {
      console.error('Upload failed:', err);
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
    <div className={`flex w-full flex-col gap-2 ${className || ''}`}>
      <div className="flex items-end gap-4">
        <div>
          {label && (
            tooltip ? (
              <Tooltip placement={tooltipPlacement} content={tooltip}>
                <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-white" htmlFor="attachments">
                  {label}
                </label>
              </Tooltip>
            ) : (
              <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-white" htmlFor="attachments">
                {label}
              </label>
            )
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className={`${buttonClassName || ''} dark:bg-transparent dark:text-white `}
            disabled={disabled || isUploading || reachedMax}
          >
            <PiFilePdfBold className="h-4 w-4" />
            <span className="ml-2">
              {isUploading ? 'Uploading...' : (placeHoleder || 'Upload')}
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
            const displayName = item.file_name?.trim() || 'Attachment';
            const sizeStr = humanSize(item.file_size); // null bo‘lsa ko‘rsatilmaydi

            return (
              <div
                key={item.public_id}
                className="flex flex-nowrap items-center gap-2 rounded-full bg-gray-100 px-3 py-1 "
              >
                <PiFilePdfBold className="h-4 w-4" />
                <span className="max-w-[240px] truncate text-sm">{displayName}</span>
                {sizeStr ? (
                  <span className="max-w-[240px] truncate text-sm">{sizeStr}</span>
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
