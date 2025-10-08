export type Locale = 'en' | 'zh';
const dictionaries = {
  en: () => import('@/i18n/messages/en.json').then((m) => m.default),
  zh: () => import('@/i18n/messages/zh.json').then((m) => m.default),
};
export async function getDict(locale: Locale) {
  return dictionaries[locale]();
}
export function isLocale(v: string): v is Locale {
  return v === 'en' || v === 'zh';
}
