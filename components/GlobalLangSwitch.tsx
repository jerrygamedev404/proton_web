'use client';
import LangSwitcher from './LangSwitcher';
export default function GlobalLangSwitch() {
  return (
    <div className="fixed right-5 bottom-3 z-50 bg-white/90 backdrop-blur border rounded-xl shadow px-3 py-2">
      <LangSwitcher />
    </div>
  );
}
