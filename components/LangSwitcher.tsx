'use client';
import {useCurrentLocale, useLocalePath} from '@/lib/locale-client';
export default function LangSwitcher() {
  const locale = useCurrentLocale();
  const {pushLocale} = useLocalePath();
  return (
    <div className="flex items-center gap-2">
      <button onClick={()=>pushLocale('zh')} className={`text-sm px-2 py-1 rounded ${locale==='zh' ? 'bg-slate-100' : ''}`}>中</button>
      <button onClick={()=>pushLocale('en')} className={`text-sm px-2 py-1 rounded ${locale==='en' ? 'bg-slate-100' : ''}`}>EN</button>
    </div>
  );
}
