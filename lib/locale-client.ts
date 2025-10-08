'use client';
import {usePathname, useRouter} from 'next/navigation';
import type {Locale} from './dict';

export function useCurrentLocale(): Locale {
  const pathname = usePathname() || '/zh';
  const seg = pathname.split('/').filter(Boolean)[0] || 'zh';
  return (seg === 'en' ? 'en' : 'zh');
}
export function useLocalePath() {
  const pathname = usePathname() || '/zh';
  const router = useRouter();
  const parts = pathname.split('/');
  return {
    pushLocale: (locale: Locale) => {
      parts[1] = locale;
      router.push(parts.join('/') || '/');
    }
  };
}
