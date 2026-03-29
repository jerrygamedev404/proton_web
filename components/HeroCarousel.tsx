'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type Slide = {
  id: string;
  image: string;
  imageMobile?: string;
  detailsHref?: string;
  title?: string; subtitle?: string;
  title_en?: string; subtitle_en?: string;
  title_zh?: string; subtitle_zh?: string;
  showWhatsapp?: boolean; showDetails?: boolean;
  waText_en?: string; waText_zh?: string; waPhone?: string;
};

function useLocale() {
  if (typeof window === 'undefined') return 'zh';
  const seg = window.location.pathname.split('/').filter(Boolean)[0];
  return (seg === 'en' || seg === 'zh') ? seg : 'zh';
}

export default function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>([]);
  // pos is 1-based index into the extended array [last_clone, ...slides, first_clone]
  const [pos, setPos] = useState(1);
  const [transitioning, setTransitioning] = useState(true);
  const posRef = useRef(1);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const locale = useLocale();

  useEffect(() => {
    fetch('/data/hero.json').then(r => r.json()).then(setSlides);
  }, []);

  // Extended array: [clone_of_last, ...slides, clone_of_first]
  const extended = slides.length
    ? [slides[slides.length - 1], ...slides, slides[0]]
    : [];
  const extLen = extended.length;
  const realIdx = slides.length
    ? ((pos - 1) % slides.length + slides.length) % slides.length
    : 0;

  const updatePos = (newPos: number) => {
    posRef.current = newPos;
    setPos(newPos);
  };

  const go = (dir: number) => {
    if (!slides.length) return;
    setTransitioning(true);
    updatePos(posRef.current + dir);
  };

  // After sliding into a clone, silently teleport to the real slide
  const onTransitionEnd = () => {
    const p = posRef.current;
    if (p <= 0) {
      setTransitioning(false);
      updatePos(p + slides.length);
    } else if (p >= extLen - 1) {
      setTransitioning(false);
      updatePos(p - slides.length);
    }
  };

  // Auto-advance — only restarts when slides load (not on every pos change)
  useEffect(() => {
    if (!slides.length) return;
    const t = window.setInterval(() => go(1), 5000);
    return () => window.clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const title = (s?: Slide) => s ? (locale === 'en' ? (s.title_en || s.title) : (s.title_zh || s.title)) : '';
  const subtitle = (s?: Slide) => s ? (locale === 'en' ? (s.subtitle_en || s.subtitle) : (s.subtitle_zh || s.subtitle)) : '';
  const waText = (s?: Slide) => s ? (locale === 'en' ? (s.waText_en || title(s) || '') : (s.waText_zh || title(s) || '')) : '';

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    if (Math.abs(dx) > 50) go(dx > 0 ? -1 : 1);
    touch.current = null;
  };

  return (
    <section className="relative">
      <div className="relative w-full overflow-hidden">
        <div
          className="relative w-full bg-slate-200 sm:aspect-[16/7]"
          style={{ height: 'calc(min(100dvh, 100svh) - var(--header-h, 56px))' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="absolute inset-0 flex h-full"
            style={{
              width: `${extLen * 100}%`,
              transform: `translateX(-${pos * (100 / extLen)}%)`,
              transition: transitioning ? 'transform 0.5s ease-in-out' : 'none',
            }}
            onTransitionEnd={onTransitionEnd}
          >
            {extended.map((s, idx) => (
              <div
                key={`${s.id}-${idx}`}
                className="relative h-full shrink-0"
                style={{ width: `${100 / extLen}%` }}
              >
                {/* Desktop wide image */}
                <Image
                  src={s.image}
                  alt={(title(s) || s.id) + ' wide'}
                  fill
                  priority={idx === 1}
                  sizes="(min-width: 640px) 100vw, 0px"
                  className="object-cover hidden sm:block"
                />
                {/* Mobile portrait image */}
                <Image
                  src={s.imageMobile || s.image}
                  alt={(title(s) || s.id) + ' mobile'}
                  fill
                  priority={idx === 1}
                  sizes="(max-width: 639px) 100vw, 0px"
                  className="object-cover sm:hidden"
                />
                {/* Gradient + text/button overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-x-0 bottom-0 sm:inset-y-0 sm:left-0 sm:w-1/2 bg-gradient-to-t from-black/60 via-black/30 to-transparent sm:bg-gradient-to-r sm:from-black/45 sm:via-black/15 sm:to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 sm:left-0 sm:right-auto sm:w-1/2 p-4 sm:p-8 text-white pb-[max(env(safe-area-inset-bottom),12px)] pointer-events-auto">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold drop-shadow">{title(s)}</h1>
                    {subtitle(s) && <p className="mt-1 sm:mt-2 text-white/90 max-w-xl">{subtitle(s)}</p>}
                    <div className="mt-3 sm:mt-4 flex gap-2 sm:gap-3">
                      {s.showWhatsapp && (
                        <a
                          href={`https://wa.me/${s.waPhone || '60XXXXXXXXX'}?text=${encodeURIComponent(waText(s) || '')}`}
                          className="btn btn-primary rounded-2xl bg-emerald-600 px-4 py-2"
                        >
                          WhatsApp
                        </a>
                      )}
                      {s.showDetails && s.detailsHref && (
                        <Link href={s.detailsHref} className="btn btn-outline rounded-2xl border-white text-white px-4 py-2">
                          详情
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prev / Next arrows */}
          <button aria-label="prev" onClick={() => go(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/35 text-white w-9 h-9 grid place-items-center sm:bg-black/30">◀</button>
          <button aria-label="next" onClick={() => go(1)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/35 text-white w-9 h-9 grid place-items-center sm:bg-black/30">▶</button>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {slides.map((_, idx) => (
            <span key={idx} className={`w-2 h-2 rounded-full ${idx === realIdx ? 'bg-white' : 'bg-white/50'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
