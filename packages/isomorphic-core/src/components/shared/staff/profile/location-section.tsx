import React from 'react';
import {
  PiMapPin,
  PiFlag,
  PiHouse,
  PiBuildings,
  PiCalendar,
} from 'react-icons/pi';
import { useTranslations } from 'next-intl';
import Section from '@core/components/shared/section';
import InfoBlock from '@core/components/shared/info-block';

interface LocationSectionProps {
  advisor: any; // Replace with proper type
}

const LocationSection: React.FC<LocationSectionProps> = ({ advisor }) => {
  const t = useTranslations();
  return (
    <Section
      title={t('profile.headings.location-info') ?? 'Location Information'}
      icon={<PiMapPin className="h-5 w-5" />}
    >
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        <InfoBlock
          icon={<PiFlag className="h-5 w-5 text-blue-600" />}
          title={t('profile.education.region') ?? 'Region'}
          value={advisor.location.region}
        />
        <InfoBlock
          icon={<PiHouse className="h-5 w-5 text-green-600" />}
          title={t('profile.education.district') ?? 'District'}
          value={advisor.location.district}
        />
        <InfoBlock
          icon={<PiBuildings className="h-5 w-5 text-amber-600" />}
          title={t('profile.fields.address') ?? 'Address'}
          value={advisor.location.address}
        />
        <InfoBlock
          icon={<PiCalendar className="h-5 w-5 text-purple-600" />}
          title={t('profile.fields.date-of-birth') ?? 'Date of Birth'}
          value={advisor.dateOfBirth}
        />
      </div>
    </Section>
  );
};

export default LocationSection;
