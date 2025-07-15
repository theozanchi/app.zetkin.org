export const SUPPORTED_LANGUAGES = [
  'da',
  'de',
  'en',
  'fr',
  'nl',
  'nn',
  'sv',
] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
