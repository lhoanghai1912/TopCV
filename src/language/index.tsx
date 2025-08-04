import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as resources from './Resource';
console.log(resources);

const formattedResources = Object.entries(resources).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: {
      translation: value,
    },
  }),
  {},
);

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: formattedResources,
  lng: 'en', // Ngôn ngữ mặc định khi khởi chạy
  fallbackLng: 'en', // Nếu không tìm thấy key -> dùng tiếng Việt
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
