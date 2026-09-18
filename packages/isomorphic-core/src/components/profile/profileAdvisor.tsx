"use client";

import { PLACEHOLDER_AVATAR } from "@core/config/constants";
import SmartImage from "@core/ui/smart-image";
import clsx from "clsx";
import React from "react";
import { Title, Text, Avatar, Button } from "rizzui";
import {
  PiMapPin,
  PiCalendar,
  PiPencilSimple,
  PiGraduationCap,
  PiPhone,
  PiChartLineUp,
  PiMailbox,
  PiHouse,
  PiBuildings,
  PiArrowLeft,
  PiArrowRightBold,
  PiFolder,
  PiListNumbers,
  PiFlag,
  PiFlagPennant,
  PiMapPinArea,
  PiCalendarCheck,
  PiEye,
  PiGenderIntersex,
  PiUser,
  PiFilePdf,
  PiDotBold,
  PiEnvelope,
  PiGlobe,
} from "react-icons/pi";
import { ProfileType } from "@core/types";
import { t } from "i18next";
import { ProfileSection, ProfileSectionField } from "./profile-section";
import formatFileSize from "@core/utils/file-size-finder";

const BG_SRC = "/advisor-student-profile-header-2.png";

const isEmptyArray = (value: any) => Array.isArray(value) && value.length === 0;

export interface ProfileSectionProps {
  isForStudent?: boolean;
  data: any;
  className?: string;
  title?: string;
}

interface ProfileHeaderProps {
  isAdmin?: boolean;
  student: any;
  OtherPaylaod?: ProfileType | null;
  from?: string;
  activeTab?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
  isEdit?: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  tabs: { key: string; label: string; icon: React.ReactNode }[];
  children?: React.ReactNode;
  handleEdit?: () => void;
}

/* ---------- Component ---------- */
const Profile = ({
  isAdmin = false,
  student,
  activeTab,
  setActiveTab,
  tabs = [],
  setIsEdit,
  isEdit,
  children,
  handleEdit,
}: ProfileHeaderProps) => {
  const data = student;

  // const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("identity");
  return (
    <div className="w-full">
      {/* Container with big corner radius */ }
      <div className="relative overflow-hidden rounded-[20px]  shadow-sm">
        {/* Navy cover with watermark / your bg image */ }
        <div className="relative h-[220px] sm:h-[215px]">
          {/* Gradient fallback underneath, then image on top */ }
          <div className="absolute inset-0 bg-[#123271]" />
          <SmartImage
            src={ BG_SRC }
            alt={ t("profile.media.profile-cover-alt") }
            className="absolute inset-0 h-full w-full object-cover opacity-95"
          />
        </div>

        {/* White strip area */ }
        <div className="relative bg-white  pb-6 dark:bg-gray-100/50 px-5 pt-[100px] sm:px-8">
          {/* Avatar overlapping seam */ }
          <div className="absolute left-1/2 top-0 -translate-y-1/2 -translate-x-1/2">
            <Avatar
              name={data.first_name + " " + data.last_name}
              customSize={170}
              src={data?.avatar?.url || PLACEHOLDER_AVATAR}
              className="rounded-full ring-8 ring-white dark:ring-gray-600 shadow-md text-2xl"
            />
          </div>

          {/* Name + Title */ }
          <div className="flex flex-col items-center">
            <Title
              as="h2"
              className="text-xl font-semibold text-[#0f2039] sm:text-2xl"
            >
              { data.first_name } { data.last_name }
            </Title>
            <Text className="mt-1 text-base text-slate-500">
              { data.role?.label || t("profile.role-label-advisor") }
            </Text>
          </div>

          {/* Metrics row (left) + Edit button (right) */ }
          <div className="flex flex-col gap-3 items-end min-[1000px]:-mt-10 mt-2">
            <Button
              onClick={ () => {
                if (isAdmin) {
                  handleEdit?.();
                } else {
                  setIsEdit(!isEdit);
                }
              } }
              variant="outline"
              className="flex items-center gap-2 rounded-md  px-4 py-2"
            >
              { !isAdmin &&
                (isEdit ? (
                  <PiArrowLeft className="h-5 w-5" />
                ) : (
                  <PiPencilSimple className="h-5 w-5" />
                )) }
              <span>
                { isEdit ? t("commons.go-back") : t("commons.edit-profile") }
              </span>
              { isAdmin && <PiArrowRightBold className="h-5 w-5" /> }
            </Button>
          </div>
        </div>

        <div className="relative bg-white dark:bg-gray-100">
          <div className="mt-6 rounded-b-[16px] w-full max-[810px]:overflow-x-aut border-t border-slate-200 bg-slate-50 dark:border-gray-200 dark:bg-gray-100 px-3 sm:px-6">
            <div className="flex w-full justify-end max-[810px]:flex-wrap max-[810px]:justify-start  gap-2 py-3 sm:gap-4">
              { tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab?.(t.key)}
                  className={clsx(
                    "group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#123271] dark:text-gray-800",
                    activeTab === t.key && "text-[#123271] dark:text-gray-800"
                  )}
                >
                  {t.icon}
                  <span>{t.label}</span>
                  {activeTab === t.key && (
                    <span className="absolute inset-x-2 -bottom-[6px] h-[3px] rounded-full bg-[#123271] dark:bg-gray-800" />
                  )}
                </button>
              )) }
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">{ children }</div>
    </div>
  );
};

export function PersonalInfo({
  isForStudent = true,
  data,
  className,
  title = t("profile.headings.personal-info"),
}: ProfileSectionProps) {
  if (!data) {
    return (
      <ProfileSection
        title={ title }
        className={ className }
        emptyMessage={t("profile.empty.personal-info") ?? "No Personal Information."}
      />
    );
  }

  const _firstName = data?.first_name ?? null;
  const _lastName = data?.last_name ?? null;
  const _middleName = data?.middle_name ?? null;
  const _dateOfBirth = data?.date_of_birth ?? null;
  const _genderLabel = data?.gender.label ?? null;
  const _phone = data?.phone_number ?? null;
  const _email = data?.email ?? null;
  const _last_login = data?.last_login ?? null;

  const fields: ProfileSectionField[] = [
    {
      id: "first-name",
      icon: <PiUser className="h-6 w-6" />,
      label: t("profile.fields.first-name"),
      value: _firstName,
    },
    {
      id: "last-name",
      icon: <PiUser className="h-6 w-6" />,
      label: t("profile.fields.last-name"),
      value: _lastName,
    },
    {
      id: "middle-name",
      icon: <PiUser className="h-6 w-6" />,
      label: t("profile.fields.patronymic-name"),
      value: _middleName,
    },
    {
      id: "date-of-birth",
      icon: <PiCalendar className="h-6 w-6" />,
      label: t("profile.fields.date-of-birth"),
      value: _dateOfBirth,
    },
    {
      id: "gender",
      icon: <PiGenderIntersex className="h-6 w-6" />,
      label: t("profile.fields.gender"),
      value: _genderLabel,
    },
    {
      id: "email",
      icon: <PiEnvelope className="h-6 w-6" />,
      label: t("profile.fields.email"),
      value: _email,
    },
    {
      id: "phone",
      icon: <PiPhone className="h-6 w-6" />,
      label: t("profile.fields.phone"),
      value: _phone,
    },
  ];

  return (
    <ProfileSection
      title={ title }
      className={ className }
      fields={ fields }
      columns={ 2 }
    />
  );
}

export function SchoolInfo({
  data,
  className,
  title = t("profile.headings.education-info"),
}: ProfileSectionProps) {
  if (!data) {
    return (
      <ProfileSection
        title={ title }
        className={ className }
        emptyMessage={t("profile.empty.school-info") ?? "No School Information."}
      />
    );
  }

  const _schoolType = data.type.label ?? null;
  const _region = data.region?.label ?? null;
  const _district = data.district?.label ?? null;
  const _schoolName = data.name ?? null;
  const _address = data.address ?? null;
  const _postalCode = data.postal_code ?? null;
  const _phone = data.phone_number ?? null;

  const fields: ProfileSectionField[] = [
    {
      id: "school-type",
      icon: <PiGraduationCap className="h-6 w-6" />,
      label: t("profile.education.school-type"),
      value: _schoolType,
      variant: "green",
    },
    {
      id: "region",
      icon: <PiMapPin className="h-6 w-6" />,
      label: t("profile.education.region"),
      value: _region,
      variant: "green",
    },
    {
      id: "district",
      icon: <PiHouse className="h-6 w-6" />,
      label: t("profile.education.district"),
      value: _district,
      variant: "green",
    },
    {
      id: "school-name",
      icon: <PiBuildings className="h-6 w-6" />,
      label: t("profile.education.school-name"),
      value: _schoolName,
      variant: "green",
    },
    {
      id: "address",
      icon: <PiMapPin className="h-6 w-6" />,
      label: t("profile.education.address"),
      value: _address,
      variant: "green",
    },
    {
      id: "postal-code",
      icon: <PiMailbox className="h-6 w-6" />,
      label: t("profile.education.postal-code"),
      value: _postalCode,
      variant: "green",
    },
    {
      id: "phone",
      icon: <PiPhone className="h-6 w-6" />,
      label: t("profile.education.phone"),
      value: _phone,
      variant: "green",
    },
  ];

  return (
    <ProfileSection
      title={ title }
      className={ className }
      fields={ fields }
      columns={ 2 }
    />
  );
}

export function PassportInfo({
  data,
  className,
  title = t("profile.form.ui.passport-info"),
}: ProfileSectionProps) {
  if (!data || isEmptyArray(data)) {
    return (
      <ProfileSection
        title={ title }
        className={ className }
        emptyMessage={t("profile.empty.passport-info") ?? "No Passport Information."}
      />
    );
  }

  const _file = data.passport_file || null;
  const hasFile = !!_file?.url;
  const _passportPhoto = data.passport_photo || null;

  const _passportNumber = data.passport_number || null;
  const _pinfl = data.pinfl || null;
  const _citizenship = data.citizenship?.label || null;
  const _nationality = data.nationality?.label || null;
  const _givenPlace = data.given_place || null;
  const _givenDate = data.given_date || null;
  const _expireDate = data.expire_date || null;

  const fields: ProfileSectionField[] = [
    {
      id: "passport-number",
      icon: <PiFolder className="h-6 w-6" />,
      label: t("profile.fields.passport-number") ?? "Passport Number",
      value: _passportNumber,
      variant: "purple",
    },
    {
      id: "passport-pinfl",
      icon: <PiListNumbers className="h-6 w-6" />,
      label: t("profile.fields.pinfl") ?? "PINFL",
      value: _pinfl,
      variant: "purple",
    },
    {
      id: "passport-citizenship",
      icon: <PiFlag className="h-6 w-6" />,
      label: t("profile.fields.citizenship") ?? "Citizenship",
      value: _citizenship,
      variant: "purple",
    },
    {
      id: "passport-nationality",
      icon: <PiFlagPennant className="h-6 w-6" />,
      label: t("profile.fields.nationality") ?? "Nationality",
      value: _nationality,
      variant: "purple",
    },
    {
      id: "passport-given-place",
      icon: <PiMapPinArea className="h-6 w-6" />,
      label: t("profile.fields.given-place") ?? "Given Place",
      value: _givenPlace,
      variant: "purple",
    },
    {
      id: "passport-given-date",
      icon: <PiCalendarCheck className="h-6 w-6" />,
      label: t("profile.fields.given-date") ?? "Given Date",
      value: _givenDate,
      variant: "purple",
    },
    {
      id: "passport-expire-date",
      icon: <PiCalendarCheck className="h-6 w-6" />,
      label: t("profile.form.labels.expiryDate") ?? "Expiry Date",
      value: _expireDate,
      variant: "purple",
    },
  ];

  // File row
  if (hasFile) {
    const fileLabel = _file.file_name;
    const fileSize = _file.file_size ?? 0;

    fields.push({
      id: "passport-file",
      label: t("profile.fields.passport-file") ?? "Passport File",
      type: "file",
      variant: "purple",
      href: _file.url,
      fileLabel,
      fileSize,
      filePreviewUrl: _passportPhoto?.url,
    });
  } else {
    fields.push({
      id: "passport-file",
      label: t("profile.fields.passport-file") ?? "Passport File",
      type: "file",
      variant: "purple",
      // no fileLabel / size → ProfileSection will show "—"
    });
  }

  return (
    <ProfileSection
      title={ title }
      className={ className }
      fields={ fields }
      columns={ 2 }
    />
  );
}

//only for student profile
export function StudentEducationInfo({
  data,
  className,
  title = t("profile.headings.education-info"),
}: ProfileSectionProps) {
  if (!data || isEmptyArray(data) || !data.school) {
    return (
      <ProfileSection
        title={ title }
        className={ className }
        emptyMessage={t("profile.empty.education-info") ?? "No Education Information."}
      />
    );
  }

  const school = data.school ?? {};

  const _schoolType = school.type?.label ?? null;
  const _region = school.region?.label ?? null;
  const _district = school.district?.label ?? null;
  const _schoolName = school.name ?? null;
  const _address = school.address ?? null;
  const _postalCode = school.postal_code ?? null;
  const _phone = school.phone_number ?? null;
  const _graduationYear = data.graduation_year ?? null;
  const _gpa = data.gpa ?? null;
  const _transcriptFile = data.transcript_file ?? null;

  const fields: ProfileSectionField[] = [
    {
      id: "school-type",
      icon: <PiGraduationCap className="h-6 w-6" />,
      label: t("profile.education.school-type"),
      value: _schoolType,
      variant: "green",
    },
    {
      id: "region",
      icon: <PiMapPin className="h-6 w-6" />,
      label: t("profile.education.region"),
      value: _region,
      variant: "green",
    },
    {
      id: "district",
      icon: <PiHouse className="h-6 w-6" />,
      label: t("profile.education.district"),
      value: _district,
      variant: "green",
    },
    {
      id: "school-name",
      icon: <PiBuildings className="h-6 w-6" />,
      label: t("profile.education.school-name"),
      value: _schoolName,
      variant: "green",
    },
    {
      id: "graduation-year",
      icon: <PiCalendar className="h-6 w-6" />,
      label: t("profile.education.graduation-year"),
      value: _graduationYear,
      variant: "green",
    },
    {
      id: "gpa",
      icon: <PiChartLineUp className="h-6 w-6" />,
      label: t("profile.education.gpa"),
      value: _gpa,
      variant: "green",
    },
    {
      id: "address",
      icon: <PiMapPin className="h-6 w-6" />,
      label: t("profile.education.address"),
      value: _address,
      variant: "green",
    },
    {
      id: "postal-code",
      icon: <PiMailbox className="h-6 w-6" />,
      label: t("profile.education.postal-code"),
      value: _postalCode,
      variant: "green",
    },
    {
      id: "phone",
      icon: <PiPhone className="h-6 w-6" />,
      label: t("profile.education.phone"),
      value: _phone,
      variant: "green",
    },
  ];

  // Transcript file row (reusing the file field helpers we built)
  if (_transcriptFile?.url) {
    fields.push({
      id: "transcript-file",
      label: t("profile.education.certificate-file"),
      type: "file",
      variant: "green",
      href: _transcriptFile.url,
      fileLabel: _transcriptFile.file_name,
      fileSize: _transcriptFile.file_size ?? 0,
      // filePreviewUrl: some thumb if you have it
    });
  } else {
    fields.push({
      id: "transcript-file",
      label: t("profile.education.certificate-file"),
      type: "file",
      variant: "green",
    });
  }

  return (
    <ProfileSection
      title={ title }
      className={ className }
      fields={ fields }
      columns={ 2 }
    />
  );
}

export function StudentContactInfo({
  data,
  className,
  title = t("profile.headings.contact-info"),
}: ProfileSectionProps) {
  if (!data || isEmptyArray(data)) {
    return (
      <ProfileSection
        title={ title }
        className={ className }
        emptyMessage={t("profile.empty.contact-info") ?? "No Contact Information."}
      />
    );
  }

  const _parentFullName = data?.parent_full_name ?? null;
  const _parentPhone = data?.parent_phone ?? null;
  const _region = data?.region?.label ?? null;
  const _district = data?.district?.label ?? null;
  const _address = data?.address ?? null;

  const fields: ProfileSectionField[] = [
    {
      id: "parent-full-name",
      icon: <PiGlobe className="h-6 w-6" />,
      label: t("profile.fields.parent-full-name"),
      value: _parentFullName,
      variant: "warning",
    },
    {
      id: "parent-phone",
      icon: <PiGlobe className="h-6 w-6" />,
      label: t("profile.fields.parent-phone"),
      value: _parentPhone,
      variant: "warning",
    },
    {
      id: "region-city",
      icon: <PiMailbox className="h-6 w-6" />,
      label: t("profile.fields.region-city"),
      value: _region,
      variant: "warning",
    },
    {
      id: "district",
      icon: <PiMapPin className="h-6 w-6" />,
      label: t("profile.fields.district"),
      value: _district,
      variant: "warning",
    },
    {
      id: "address",
      icon: <PiMapPin className="h-6 w-6" />,
      label: t("profile.fields.address"),
      value: _address,
      variant: "warning",
    },
  ];

  return (
    <ProfileSection
      title={ title }
      className={ className }
      fields={ fields }
      columns={ 2 }
    />
  );
}

export default Profile;
