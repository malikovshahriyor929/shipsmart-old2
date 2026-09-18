import React from 'react';
import {
  PiFlag,
  PiHouse,
  PiMapPinArea,
  PiStack,
  PiTextAa,
  PiGraduationCap,
  PiPhoneCall,
  PiGlobe,
  PiMapPin,
} from 'react-icons/pi';
import { useTranslations } from 'next-intl';
import Section from '@core/components/shared/section';
import InfoBlock from '@core/components/shared/info-block';

interface SchoolSectionProps {
  advisor: any; // API shape
}

const SchoolSection: React.FC<SchoolSectionProps> = ({ advisor }) => {
  const t = useTranslations();
  const school = advisor?.school || null;

  if (!school) {
    return (
      <Section
        title={t('staff.school-information') ?? 'School Information'}
        icon={<PiGraduationCap className="h-5 w-5" />}
      >
        <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-600">
          {t('staff.no-school-info') ?? 'No school information.'}
        </div>
      </Section>
    );
  }

  return (
    <Section
      title={t('staff.school-information') ?? 'School Information'}
      icon={<PiGraduationCap className="h-5 w-5" />}
    >
      <div className="grid grid-cols-1 px-2 gap-5 md:grid-cols-2">
        <InfoBlock
          icon={<PiTextAa className="h-5 w-5 text-blue-600" />}
          title={t('profile.education.school-name') ?? 'School Name'}
          value={school.name || '—'}
        />
        <InfoBlock
          icon={<PiStack className="h-5 w-5 text-green-600" />}
          title={t('profile.education.school-type') ?? 'School Type'}
          value={school.type?.label || '—'}
        />
        <InfoBlock
          icon={<PiFlag className="h-5 w-5 text-amber-600" />}
          title={t('profile.education.region') ?? 'Region'}
          value={school.region?.label || '—'}
        />
        <InfoBlock
          icon={<PiHouse className="h-5 w-5 text-purple-600" />}
          title={t('profile.education.district') ?? 'District'}
          value={school.district?.label || '—'}
        />
        <InfoBlock
          icon={<PiMapPinArea className="h-5 w-5 text-indigo-600" />}
          title={t('staff.full-address') ?? 'Full Address'}
          value={school.address || '—'}
        />
        <InfoBlock
          icon={<PiMapPin className="h-5 w-5 text-emerald-600" />}
          title={t('profile.education.postal-code') ?? 'Postal Code'}
          value={school.postal_code || '—'}
        />
        <InfoBlock
          icon={<PiPhoneCall className="h-5 w-5 text-cyan-600" />}
          title={t('staff.phone-number') ?? 'Phone Number'}
          value={school.phone_number || '—'}
        />
        <InfoBlock
          icon={<PiGlobe className="h-5 w-5 text-blue-600" />}
          title={t('staff.school-website') ?? 'School Website'}
          value={school.website_url || '—'}
        />
      </div>
    </Section>
  );
};

export default SchoolSection;
