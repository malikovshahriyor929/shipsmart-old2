import translationEN from '../../messages/en.json';
import translationRU from '../../messages/ru.json';
import translationUZ from '../../messages/uz.json';
import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import RUFlagIcon from '@core/components/icons/language/RUFlag';
import UZFlagIcon from '@core/components/icons/language/UZFlag';
import USFlagIcon from '@core/components/icons/language/USFlag';

const resources = {
  en: {
    translation: translationEN,
  },
  ru: {
    translation: translationRU,
  },
  uz: {
    translation: translationUZ,
  },
};
// const savedLanguage = localStorage.getItem('language') || 'en';
const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: pathname.includes('/uz')
      ? 'uz'
      : pathname.includes('/ru')
        ? 'ru'
        : pathname.includes('/en')
          ? 'en'
          : 'en',
    resources,
    debug: false,
    detection:{
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },
    fallbackLng: 'en',
  });

export const languageMenu = [
  {
    id: 1,
    title: 'English',
    shortTitle: 'En',
    code: 'en',
    img: USFlagIcon,
  },
  {
    id: 2,
    title: 'Uzbekistan',
    shortTitle: 'Uz',
    code: 'uz',
    img: UZFlagIcon,
  },
  {
    id: 3,
    title: 'Russian',
    shortTitle: 'Ru',
    code: 'ru',
    img: RUFlagIcon,
  },
];
//   let [check, setCheck] = useState(false);
// let changelang = (code) => {
//   i18next.changeLanguage(code);
//   localStorage.setItem("language", code);
// };
