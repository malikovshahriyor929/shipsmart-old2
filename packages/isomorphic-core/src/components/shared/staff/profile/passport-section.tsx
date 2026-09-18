'use client';

import React from 'react';
import Section from '@core/components/shared/section';
import InfoBlock from '@core/components/shared/info-block';
import { Button, Text } from 'rizzui';
import {
  PiEye,
  PiIdentificationCard,
  PiCalendarCheck,
  PiMapPinArea,
  PiListNumbers,
  PiFlag,
  PiFlagPennant,
  PiFolderDuotone,
} from 'react-icons/pi';
import { isImageExt } from '@core/utils/course-utils';
import { useTranslations } from 'next-intl';

interface PassportSectionProps {
  passport: any | null | undefined;
  hasPreview?: boolean;
}

const PassportSection: React.FC<PassportSectionProps> = ({
  passport,
  hasPreview = true,
}) => {
  const t = useTranslations();
  if (!passport) {
    return (
      <Section
        title={t('staff.passport') ?? 'Passport'}
        icon={<PiIdentificationCard className="h-5 w-5" />}
      >
        <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-600">
          {t('staff.no-passport-info') ?? 'No passport information.'}
        </div>
      </Section>
    );
  }

  const photo = passport.passport_photo || null;
  const file = passport.passport_file || null;

  const photoIsImage = isImageExt(photo?.extension);
  const photoUrl = photo?.url || '';
  const fileUrl = file?.url || photoUrl || '';

  return (
    <Section
      title={t('staff.passport') ?? 'Passport'}
      icon={<PiIdentificationCard className="h-5 w-5" />}
    >
      <div
        className={`grid grid-cols-1 gap-6 ${hasPreview ? 'md:grid-cols-5 lg:grid-cols-1 xl:grid-cols-5' : ''}`}
      >
        {/* Left: visual preview */}
        {hasPreview && (
          <div className="relative col-span-2 grid aspect-[16/9] place-content-center overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            {photoIsImage && photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={t('staff.passport') ?? 'Passport'}
                src={photoUrl}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
                <PiIdentificationCard className="size-32 shrink-0" />
                <Text className="text-sm">
                  {t('staff.no-image-preview') ?? 'No image preview available'}
                </Text>
              </div>
            )}
          </div>
        )}

        {/* Right: details */}
        <div
          className={
            hasPreview
              ? 'col-span-3 grid grid-cols-1 gap-5'
              : 'grid grid-cols-1 gap-5'
          }
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InfoBlock
              icon={<PiFolderDuotone className="h-5 w-5 text-yellow-500" />}
              title={t('profile.fields.passport-number') ?? 'Passport Number'}
              value={passport?.passport_number || '—'}
            />
            <InfoBlock
              icon={<PiListNumbers className="h-5 w-5 text-indigo-500" />}
              title={t('profile.fields.pinfl') ?? 'PINFL'}
              value={passport?.pinfl || '—'}
            />
            <InfoBlock
              icon={<PiFlag className="h-5 w-5 text-blue-500" />}
              title={t('profile.fields.citizenship') ?? 'Citizenship'}
              value={passport?.citizenship?.label || '—'}
            />
            <InfoBlock
              icon={<PiFlagPennant className="h-5 w-5 text-blue-500" />}
              title={t('profile.fields.nationality') ?? 'Nationality'}
              value={passport?.nationality?.label || '—'}
            />
            <InfoBlock
              icon={<PiMapPinArea className="h-5 w-5 text-purple-500" />}
              title={t('profile.fields.given-place') ?? 'Given Place'}
              value={passport?.given_place || '—'}
            />
            <InfoBlock
              icon={<PiCalendarCheck className="h-5 w-5 text-green-500" />}
              title={t('profile.fields.given-date') ?? 'Given Date'}
              value={passport?.given_date || '—'}
            />
            <InfoBlock
              icon={<PiCalendarCheck className="h-5 w-5 text-green-500" />}
              title={t('profile.form.labels.expiryDate') ?? 'Expiry Date'}
              value={passport?.expire_date || '—'}
            />
          </div>

          {/* Extra file quick actions */}
          <div className="flex flex-wrap gap-2">
            {file?.url && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  window.open(file.url, '_blank', 'noopener,noreferrer')
                }
              >
                <PiEye className="mr-1 h-4 w-4" />
                {t('staff.view-file') ?? 'View File'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default PassportSection;
