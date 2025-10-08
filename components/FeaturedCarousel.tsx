'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchAllModels } from '@/lib/data.client';
import { safeAlt } from '@/lib/a11y';

type Slide = {
  id: string;
  title: string;
  desc: string;
  image: string;
  imageMobile: string;
  thumb?: string;
  brochure?: string;
};

export default function FeaturedCarousel({
  slides,
  desktopHeightClass = 'md:h-[620px]',
  mobileHeaderHeight = 56,         // px, your header is h-14
  intervalMs = 5000,
  pauseAfterInteractionMs = 8000,
}: {
  slides?: Slide[];
  desktopHeightClass?: string;
  mobileHeaderHeight?: number;
  intervalMs?: number;
  pauseAfterInteractionMs?: number;
}) {
  // --- Stable hooks ---
  const [autoSlides, setAutoSlides] = useState<Slide[]>([]);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lastInteractAt, setLastInteractAt] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const mqRef = useRef<MediaQueryList | null>(null);

  // match media for mobile
  useEffect(() => {
    if (typeof window === 'undefined') return;
    mqRef.current = window.matchMedia('(max-width: 640px)');
    const apply = () => setIsMobile(!!mqRef.current?.matches);
    apply();
    const handler = () => apply();
    mqRef.current.addEventListener?.('change', handler);
    return () => mqRef.current?.removeEventListener?.('change', handler);
  }, []);

  // Client data load
  useEffect(() => {
    if (slides?.length) return;
    (async () => {
      try {
        const models = await fetchAllModels();
        const list = (models || [])
          .filter((m: any) => (m?.tags?.includes('featured') || m?.tags?.includes('popular')))
          .slice(0, 8);
        setAutoSlides(list.map((m: any) => ({
          id: m.id,
          title: m.name,
          desc: (m.highlights || []).slice(0, 2).join(' · '),
          image: m.full_heroImage,
          imageMobile: m.full_heroImage_mob,
          thumb: m.gallery?.[0] || m.heroImage,
          brochure: m.brochureUrl || `/docs/${m.id}.pdf`
        })));
      } catch {
        setAutoSlides([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides?.length]);

  // Derived
  const effectiveSlides: Slide[] = (slides?.length ? slides : autoSlides).map(s => ({
    ...s,
    brochure: s.brochure || `/docs/${s.id}.pdf`
  }));
  const count = effectiveSlides.length || 0;
  const safeIdx = count ? (idx % count + count) % count : 0;
  const s = count ? effectiveSlides[safeIdx] : undefined;

  // Auto advance
  useEffect(() => {
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || count <= 1) return;

    const tick = () => {
      const invisible = typeof document !== 'undefined' && (document.hidden || document.visibilityState !== 'visible');
      const withinPause = Date.now() - lastInteractAt < pauseAfterInteractionMs;
      if (!paused && !invisible && !withinPause) {
        setIdx(i => (i + 1) % count);
      }
      timerRef.current = window.setTimeout(tick, intervalMs);
    };

    timerRef.current = window.setTimeout(tick, intervalMs);
    const onVisibility = () => {
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = window.setTimeout(tick, intervalMs); }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [count, paused, intervalMs, pauseAfterInteractionMs, lastInteractAt]);

  // Hover pause
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onEnter = () => setPaused(true);
    const onLeave = () => setPaused(false);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const prev = () => { if (count > 1) { setIdx(i => (i - 1 + count) % count); setLastInteractAt(Date.now()); } };
  const next = () => { if (count > 1) { setIdx(i => (i + 1) % count); setLastInteractAt(Date.now()); } };
  const go = (i: number) => { if (count) { setIdx(i % count); setLastInteractAt(Date.now()); } };

  if (!count) {
    return (
      <section className="relative rounded-2xl overflow-hidden bg-slate-200 animate-pulse">
        <div ref={containerRef} className={"relative w-full " + desktopHeightClass} />
      </section>
    );
  }

  // ===== Responsive thumbnails =====
  const THUMB_W = isMobile ? 92 : 110;
  const THUMB_H = isMobile ? 124 : 148;
  const GAP = isMobile ? 10 : 10;
  const ARROW_OFFSET = isMobile ? `left-4` : `left-10`;
  const HALF_W = Math.round(THUMB_W * 0.5);
  const STRIP_ITEMS = isMobile ? 2.5 : 2.5; // window size
  const STRIP_W = (Math.floor(STRIP_ITEMS) * THUMB_W) + (STRIP_ITEMS % 1 ? HALF_W : 0) + (Math.floor(STRIP_ITEMS) - 1 + (STRIP_ITEMS % 1 ? Math.floor(STRIP_ITEMS) : Math.floor(STRIP_ITEMS) - 1)) * GAP;
  const loop = (i: number) => (i % count + count) % count;
  const visible = [
    effectiveSlides[loop(safeIdx + 0)],
    effectiveSlides[loop(safeIdx + 1)],
    effectiveSlides[loop(safeIdx + 2)],
    ...(STRIP_ITEMS > 3 ? [effectiveSlides[loop(safeIdx + 3)]] : []),
  ];

  // Mobile full-height style (from header to bottom, include safe area)
  const mobileHeightStyle = isMobile
    ? { height: `calc(100dvh - ${mobileHeaderHeight}px)` }
    : undefined;

  const containerClassName = (isMobile ? "" : "rounded-2xl ") + "relative overflow-hidden bg-black text-white"
  return (
    <section className={containerClassName}>
      <div ref={containerRef} className={"relative w-full " + (isMobile ? '' : desktopHeightClass)} style={mobileHeightStyle}>
        <Image src={isMobile ? s!.imageMobile : s!.image} alt={safeAlt(undefined, s!.title)} fill sizes="100vw" className="object-cover" />

        {/* Title / Desc — Desktop: 顶部左；Mobile: 底部左 */}
        <div className={"absolute left-0 right-0 " + ("top-0")}>
          <div className="p-4 sm:p-6 md:p-10">
            <h3 className={"text-black/90 font-bold drop-shadow " + (isMobile ? "text-3xl" : "text-3xl md:text-5xl")}>{s!.title}</h3>
            <p className={"text-black/90 max-w-xl mt-2 " + (isMobile ? "text-sm" : "text-base md:text-lg")}>{s!.desc}</p>
          </div>
        </div>

        {/* CTA + Arrows（垂直排列，左下角） */}
        <div className="absolute left-4 sm:left-6 md:left-10 bottom-6 pb-[env(safe-area-inset-bottom)] flex flex-col items-start gap-3 z-10">
          <Link
            href={s?.brochure ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn rounded-full px-7 py-3 text-base md:text-lg font-semibold shadow-lg ring-2 ring-black/15"
            style={{ backgroundImage: 'linear-gradient(180deg, var(--acc), var(--acc2))', color: '#000' }}
            aria-label="See brochure"
          >
            SEE MORE
          </Link>

          {count > 1 && (
            <div className="flex items-center gap-3">
              <button
                aria-label="Previous"
                onClick={prev}
                className="w-10 h-10 rounded-full bg-white/80 text-neutral-900 hover:bg-white"
              >
                ‹
              </button>
              <button
                aria-label="Next"
                onClick={next}
                className="w-10 h-10 rounded-full bg-white/80 text-neutral-900 hover:bg-white"
              >
                ›
              </button>
            </div>
          )}
        </div>


        {/* Thumbnails: fixed width window (3.5 desktop / 2.5 mobile) */}
        <div className="absolute bottom-[22px] md:bottom-4 right-4 md:right-6" style={{ width: STRIP_W }}>
          <div className="flex items-center" style={{ gap: GAP, overflow: 'hidden' }} aria-label="Thumbnails">
            {visible.map((it, i) => {
              const isActive = loop(safeIdx + i) === safeIdx;
              const isHalf = (isMobile ? (i === 2) : (i === 3));
              const w = isHalf ? HALF_W : THUMB_W;
              return (
                <button
                  key={`${it.id}-${i}`}
                  onClick={() => go(loop(safeIdx + i))}
                  aria-label={it.title}
                  className={`relative shrink-0 rounded-2xl overflow-hidden border transition
                    ${isActive ? 'border-white' : 'border-white/30 hover:border-white/70'}`}
                  style={{ width: w, height: THUMB_H }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.thumb || it.image} alt={safeAlt(undefined, it.title)} className="w-full h-full object-cover" />
                  {isHalf && (
                    <span className="absolute inset-y-0 right-0 w-6 pointer-events-none"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(0,0,0,.25))' }} />
                  )}
                  {!isActive && <span className="absolute inset-0 bg-black/10" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
