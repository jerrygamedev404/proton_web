'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { anchorClick } from '@/lib/scroll';

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = document.querySelector('header[data-header]') as HTMLElement | null;
    if (h) document.documentElement.style.setProperty('--header-h', `${h.offsetHeight}px`);
  }, []);

  return (
    <header data-header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold" prefetch={false}>PROTON Dealer</Link>

        <nav className="hidden sm:flex gap-6 text-sm">
          <Link href="/#popular_car" onClick={anchorClick('#popular_car')} prefetch={false}>Models</Link>
          <Link href="/#services" onClick={anchorClick('#services')} prefetch={false}>Services</Link>
          <Link href="/#footer" onClick={anchorClick('#footer')} prefetch={false}>Contact</Link>
        </nav>

        <div className="hidden sm:block">
          <Link href="/contact" prefetch={false}
            className="inline-flex items-center rounded-xl px-4 py-2 bg-emerald-600 text-white">
            Booking
          </Link>
        </div>

        <button className="sm:hidden p-2" aria-label="Menu" onClick={() => setOpen(v => !v)}>≡</button>
      </div>

      {open && (
        <div className="sm:hidden border-t">
          <div className="px-4 py-2 flex flex-col gap-2">
            <Link href="/#popular_car" onClick={(e)=>{ anchorClick('#popular_car')(e); setOpen(false); }} prefetch={false}>Models</Link>
            <Link href="/#services" onClick={(e)=>{ anchorClick('#services')(e); setOpen(false); }} prefetch={false}>Services</Link>
            <Link href="/#footer"  onClick={(e)=>{ anchorClick('#footer')(e); setOpen(false); }} prefetch={false}>Contact</Link>
            <Link href="/contact" className="mt-2 inline-flex items-center rounded-xl px-4 py-2 bg-emerald-600 text-white" onClick={()=>setOpen(false)} prefetch={false}>Booking</Link>
          </div>
        </div>
      )}
    </header>
  );
}
