'use client';
import Image from 'next/image';
import {useEffect, useState} from 'react';

type Item = {
  id: string;
  title_zh?: string; title_en?: string; title?: string;
  desc_zh?: string; desc_en?: string; desc?: string;
  image: string;
  imageMobile?: string;
};

function useLocale() { return 'zh'; }

export default function HighlightsAlt() {
  const [items, setItems] = useState<Item[]>([]);
  const locale = useLocale();
  useEffect(() => { fetch('/data/home_highlights.json').then(r=>r.json()).then(setItems); }, []);

  const T = (it: Item, f: 'title'|'desc') => {
    if (locale === 'en') return (it as any)[`${f}_en`] || (it as any)[f] || '';
    return (it as any)[`${f}_zh`] || (it as any)[f] || '';
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      {items.map((it, idx) => (
        <div key={it.id} className={`grid items-center gap-6 md:grid-cols-2 ${idx%2===1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">{T(it,'title')}</h2>
            <p className="text-neutral-600 mt-2">{T(it,'desc')}</p>
          </div>
          <div className="relative w-full aspect-[3/4] sm:aspect-[16/10] rounded-2xl overflow-hidden">
            <Image src={it.image} alt={T(it,'title')} fill className="object-cover hidden sm:block"/>
            <Image src={it.imageMobile || it.image} alt={T(it,'title')} fill className="object-cover sm:hidden"/>
          </div>
        </div>
      ))}
    </section>
  );
}
