// "use client";
// import RUFlagIcon from "@core/components/icons/language/RUFlag";
// import UZFlagIcon from "@core/components/icons/language/UZFlag";
// import USFlagIcon from "@core/components/icons/language/USFlag";
// import { Select } from "rizzui";
// import cn from "@core/utils/class-names";
// import { useLocale } from "next-intl";
// import { JSX, useState, useTransition } from "react";
// import { Locale, usePathname, useRouter } from "@core/i18n/routing";
// import i18next from "i18next";

// type LocaleOptionsType = {
//   label: string;
//   value: Locale;
//   icon: ({ ...props }: React.SVGProps<SVGSVGElement>) => JSX.Element;
// };

// const localeOptions = [
//   {
//     label: 'English - EN',
//     value: 'en',
//     icon: USFlagIcon,
//   },
//   {
//     label: 'Uzbek - UZ',
//     value: 'uz',
//     icon: UZFlagIcon,
//   },
//   {
//     label: 'Russian - RU',
//     value: 'ru',
//     icon: RUFlagIcon,
//   },
// ];

// export default function LanguageSwitcher({
//   className,
//   iconClassName,
//   selectClassName,
// }: {
//   className?: string;
//   iconClassName?: string;
//   selectClassName?: string;
// }) {
//   const router = useRouter();
//   const locale = useLocale();
//   const pathname = usePathname();
//   const [_, startTransition] = useTransition();
//   const selectedLocale = localeOptions.filter(
//     (item) => item.value.toLowerCase() === locale.toLowerCase()
//   );
//   const [selected, setSelected] = useState(selectedLocale[0]);
//   //   let [check, setCheck] = useState(false);
//   let changelang = (code: string) => {
//     i18next.changeLanguage(code);
//     localStorage.setItem("language", code);
//   };
//   function handleChange(op: LocaleOptionsType) {
//     setSelected(op);
//     changelang(op.value);
//     startTransition(() => {
//       router.replace(`${pathname}`, { locale: op.value });
//     });
//   }

//   return (
//     <Select
//       size="sm"
//       value={ selected }
//       className={ cn("w-auto", className) }
//       onChange={ handleChange }
//       options={ localeOptions }
//       dropdownClassName="w-40"
//       suffixClassName={ iconClassName }
//       selectClassName={ cn(
//         "ring-0 border-none shadow backdrop-blur-md dark:bg-gray-100  focus:ring-0 focus:border-none focus:ring-transparent focus:ring-offset-0 focus:shadow-none hover:border-none hover:ring-none",
//         selectClassName
//       ) }
//       displayValue={ (op: LocaleOptionsType) => renderDisplayValue(op) }
//       getOptionDisplayValue={ (op: LocaleOptionsType) =>
//         renderOptionDisplayValue(op)
//       }
//     />
//   );
// }

// function renderDisplayValue(op: LocaleOptionsType) {
//   const Icon = op.icon;
//   return <>{ Icon && <Icon className="size-5" /> }</>;
// }

// function renderOptionDisplayValue(op: LocaleOptionsType) {
//   const Icon = op.icon;
//   return (
//     <div className="flex items-center gap-3">
//       { Icon && <Icon className="size-5" /> }
//       <span>{ op.label }</span>
//     </div>
//   );
// }

'use client';
import RUFlagIcon from '@core/components/icons/language/RUFlag';
import UZFlagIcon from '@core/components/icons/language/UZFlag';
import USFlagIcon from '@core/components/icons/language/USFlag';
import { Popover, Select } from 'rizzui';
import cn from '@core/utils/class-names';
import { useLocale } from 'next-intl';
import { JSX, useState, useTransition } from 'react';
import { Locale, usePathname, useRouter } from '@core/i18n/routing';
import i18next from 'i18next';
import { useMedia } from 'react-use';

type LocaleOptionsType = {
  label: string;
  value: string;
  icon: ({ ...props }: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

const localeOptions = [
  {
    label: 'English - EN',
    value: 'en',
    icon: USFlagIcon,
  },
  {
    label: 'Uzbek - UZ',
    value: 'uz',
    icon: UZFlagIcon,
  },
  {
    label: 'Russian - RU',
    value: 'ru',
    icon: RUFlagIcon,
  },
];

export default function LanguageSwitcher({
  className,
  iconClassName,
  selectClassName,
}: {
  className?: string;
  iconClassName?: string;
  selectClassName?: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const [_, startTransition] = useTransition();
  const selectedLocale = localeOptions.filter(
    (item) => item.value.toLowerCase() === locale.toLowerCase()
  );
  const [selected, setSelected] = useState(selectedLocale[0]);
  const [isOpen, setIsOpen] = useState(false);

  let changelang = (code: string) => {
    i18next.changeLanguage(code);
  };

  function handleChange(op: LocaleOptionsType) {
    setSelected(op);
    changelang(op.value);
    startTransition(() => {
      router.replace(`${pathname}`, { locale: op.value });
    });
  }

  const isMobile = useMedia('(max-width: 480px)', false);

  return (
    <Popover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      shadow="sm"
      placement={isMobile ? 'bottom' : 'bottom-end'}
    >
      <Popover.Trigger>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex cursor-pointer items-center justify-center rounded-full border-none p-2 py-2.5 shadow ring-0 backdrop-blur-md dark:bg-gray-100"
        >
          {renderDisplayValue({
            icon: selected.icon,
            label: selected.label,
            value: selected.value as Locale,
          })}
        </div>
      </Popover.Trigger>
      <Popover.Content className="z-[9999] p-2 dark:border-gray-200 dark:bg-gray-100 [&>svg>path]:dark:stroke-gray-200 [&>svg]:dark:fill-gray-100">
        <div className="flex flex-col gap-0.5">
          {localeOptions.map((op, i) => (
            <div
              key={i}
              onClick={() => {
                handleChange(op);
                setSelected(op);
              }}
              className={cn(
                'cursor-pointer rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:bg-gray-200 dark:hover:bg-gray-300',
                selectClassName
              )}
            >
              <>{renderOptionDisplayValue(op as any)}</>
            </div>
          ))}
        </div>
      </Popover.Content>
    </Popover>
  );
}

function renderDisplayValue(op: LocaleOptionsType) {
  const Icon = op.icon;
  return <>{Icon && <Icon className="size-5" />}</>;
}

function renderOptionDisplayValue(op: LocaleOptionsType) {
  const Icon = op.icon;
  return (
    <div className="flex items-center gap-3">
      {Icon && <Icon className="size-5" />}
      <span>{op.label}</span>
    </div>
  );
}
