export const appLanguages = ['en', 'bg'] as const;

const browserLanguage = navigator.language.split('-')[0];

export const defaultLanguage =
  appLanguages.find((language) => language === browserLanguage) || 'en';
