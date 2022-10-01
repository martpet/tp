export const appLanguages = ['en', 'bg'] as const;

export const browserLanguage = navigator.language.split('-')[0];

export const initialLanguage = appLanguages.find((x) => x === browserLanguage) || 'en';
