import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './lang/en.json';
import ja from './lang/ja.json';

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: false,
    fallbackLng: localStorage.getItem('lang') || 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: en
      },
      ja: {
        translation: ja
      }
    }
  });

export default i18n;