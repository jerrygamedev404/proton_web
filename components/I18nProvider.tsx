'use client';
import {createContext, useContext} from 'react';
type Messages = Record<string, any>;
const I18nContext = createContext<Messages>({});
export function I18nProvider({messages, children}:{messages: Messages; children: React.ReactNode}) {
  return <I18nContext.Provider value={messages}>{children}</I18nContext.Provider>;
}
export function useT(section?: string) {
  const dict = useContext(I18nContext) as Record<string, any>;
  return (key: string) => section ? (dict?.[section]?.[key] ?? key) : (dict?.[key] ?? key);
}
