import React from 'react';
import { PiUser } from 'react-icons/pi';
import { Text, Badge } from 'rizzui';
import Section from '@core/components/shared/section';
import { useTranslations } from 'next-intl';

interface PersonalInfoSectionProps {
  advisor: any;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  advisor,
}) => {
  const t = useTranslations();
  return (
    <Section
      title={t('profile.headings.personal-info') ?? 'Personal Information'}
      icon={<PiUser className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {t('profile.staff.full-name-fish') ?? 'Full Name (F.I.Sh.)'}
              </Text>
              <Text className="font-medium">{advisor.name}</Text>
            </div>

            <div>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {t('profile.fields.date-of-birth') ?? 'Date of Birth'}
              </Text>
              <Text className="font-medium">{advisor.dateOfBirth}</Text>
            </div>

            <div>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {t('profile.fields.gender') ?? 'Gender'}
              </Text>
              <Text className="font-medium">{advisor.gender}</Text>
            </div>

            <div>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {t('profile.staff.place-of-birth') ?? 'Place of Birth'}
              </Text>
              <Text className="font-medium">{advisor.placeOfBirth}</Text>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <Text className="mb-2 font-medium">
            {t('profile.staff.passport-id-details') ?? 'Passport/ID Details'}
          </Text>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {t('profile.staff.document-number') ?? 'Document Number'}
              </Text>
              <Text className="font-medium">{advisor.passport.number}</Text>
            </div>

            <div>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {t('profile.staff.issue-date') ?? 'Issue Date'}
              </Text>
              <Text className="font-medium">{advisor.passport.issueDate}</Text>
            </div>

            <div>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {t('profile.staff.valid-until') ?? 'Valid Until'}
              </Text>
              <Text className="font-medium">{advisor.passport.validity}</Text>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {t('profile.staff.document-scan') ?? 'Document Scan'}
            </Text>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="flat" color="info" className='text-white'>
                {t('profile.staff.passport-scan') ?? 'Passport Scan'}
              </Badge>
              <a
                href={advisor.passport.scanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                {t('profile.staff.view-document') ?? 'View Document'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default PersonalInfoSection;
