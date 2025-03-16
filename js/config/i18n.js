import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        addManga: 'Add Manga',
        // ... outras traduções
      }
    },
    pt: {
      translation: {
        addManga: 'Adicionar Mangá',
        // ... outras traduções
      }
    }
  },
  lng: localStorage.getItem('lang') || 'pt',
  fallbackLng: 'en'
});

export default i18n; 