'use client';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
  headerBg?: string;
  headerTextColor?: string;
};

export default function FeaturedCarousel({
  slides,
  desktopHeightClass = 'md:h-[620px]',
  mobileHeaderHeight = 56,
  intervalMs = 3500,
  pauseAfterInteractionMs = 8000,
}: {
  slides?: Slide[];
  desktopHeightClass?: string;
  mobileHeaderHeight?: number;
  intervalMs?: number;
  pauseAfterInteractionMs?: number;
}) {
  const [autoSlides, setAutoSlides] = useState<Slide[]>([]);
  // pos is 1-based into the extended array [last_clone, ...slides, first_clone, second_clone, third_clone]
  const [pos, setPos] = useState(1);
  const [transitioning, setTransitioning] = useState(true);
  const posRef = useRef(1);
  const searchParams = useSearchParams();
  const [paused, setPaused] = useState(false);
  const [lastInteractAt, setLastInteractAt] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const mqRef = useRef<MediaQueryList | null>(null);

  // Match media for mobile
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
          brochure: `/docs/${m.id}.pdf`,
          headerBg: m.headerBg,
          headerTextColor: m.headerTextColor,
        })));
      } catch {
        setAutoSlides([]);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides?.length]);

  // Derived slides
  const effectiveSlides: Slide[] = (slides?.length ? slides : autoSlides).map(s => ({
    ...s,
    brochure: `/docs/${s.id}.pdf`,
  }));
  const count = effectiveSlides.length || 0;

  // Extended array: [clone_of_last, ...slides, clone_of_first, clone_of_second, clone_of_third]
  // Extra clones at end cover thumbnail clicks up to +3 positions ahead
  const extSlides: Slide[] = count >= 1 ? [
    effectiveSlides[(count - 1) % count],
    ...effectiveSlides,
    effectiveSlides[0 % count],
    effectiveSlides[1 % count],
    effectiveSlides[2 % count],
  ] : effectiveSlides;
  const extCount = extSlides.length; // count + 4

  // Real 0-based index into effectiveSlides
  const realIdx = count ? ((pos - 1) % count + count) % count : 0;
  const s = count ? effectiveSlides[realIdx] : undefined;

  const updatePos = (newPos: number) => {
    posRef.current = newPos;
    setPos(newPos);
  };

  // Jump to slide requested via ?slide=modelId URL param
  useEffect(() => {
    const slideId = searchParams?.get('slide');
    if (!slideId || !count) return;
    const targetIdx = effectiveSlides.findIndex(s => s.id === slideId);
    if (targetIdx === -1) return;
    setTransitioning(false);
    updatePos(targetIdx + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, count]);

  const prev = () => {
    if (count > 1) { setTransitioning(true); updatePos(posRef.current - 1); setLastInteractAt(Date.now()); }
  };
  const next = () => {
    if (count > 1) { setTransitioning(true); updatePos(posRef.current + 1); setLastInteractAt(Date.now()); }
  };
  // Go forward by `offset` steps (used by thumbnail clicks)
  const goFwd = (offset: number) => {
    if (!count || offset === 0) return;
    setTransitioning(true);
    updatePos(posRef.current + offset);
    setLastInteractAt(Date.now());
  };

  // After sliding into a clone, silently teleport to the real position
  const onTransitionEnd = () => {
    const p = posRef.current;
    if (p <= 0) {
      setTransitioning(false);
      updatePos(p + count);
    } else if (p > count) {
      setTransitioning(false);
      updatePos(p - count);
    }
  };

  // Auto-advance
  useEffect(() => {
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || count <= 1) return;

    const tick = () => {
      const invisible = typeof document !== 'undefined' && (document.hidden || document.visibilityState !== 'visible');
      const withinPause = Date.now() - lastInteractAt < pauseAfterInteractionMs;
      if (!paused && !invisible && !withinPause) {
        setTransitioning(true);
        updatePos(posRef.current + 1);
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
  }, [count, paused, intervalMs, pauseAfterInteractionMs, lastInteractAt]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const GAP = 10;
  const HALF_W = Math.round(THUMB_W * 0.5);
  const STRIP_ITEMS = isMobile ? 1.5 : 2.5;
  const STRIP_W = (Math.floor(STRIP_ITEMS) * THUMB_W) + (STRIP_ITEMS % 1 ? HALF_W : 0) + (Math.floor(STRIP_ITEMS) - 1 + (STRIP_ITEMS % 1 ? Math.floor(STRIP_ITEMS) : Math.floor(STRIP_ITEMS) - 1)) * GAP;
  const loop = (i: number) => (i % count + count) % count;
  const visible = [
    effectiveSlides[loop(realIdx + 0)],
    effectiveSlides[loop(realIdx + 1)],
    effectiveSlides[loop(realIdx + 2)],
    ...(STRIP_ITEMS > 3 ? [effectiveSlides[loop(realIdx + 3)]] : []),
  ];

  const mobileHeightStyle = isMobile
    ? { height: `calc(100dvh - ${mobileHeaderHeight}px)` }
    : undefined;

  const containerClassName = (isMobile ? '' : 'rounded-2xl ') + 'relative overflow-hidden bg-black text-white';

  return (
    <section className={containerClassName}>
      <div ref={containerRef} className={"relative w-full overflow-hidden " + (isMobile ? '' : desktopHeightClass)} style={mobileHeightStyle}>

        {/* Infinite sliding image strip */}
        <div
          className="absolute inset-0 flex h-full"
          style={{
            width: `${extCount * 100}%`,
            transform: `translateX(-${pos * (100 / extCount)}%)`,
            transition: transitioning ? 'transform 0.5s ease-in-out' : 'none',
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {extSlides.map((slide, i) => (
            <div key={`${slide.id}-${i}`} className="relative h-full shrink-0" style={{ width: `${100 / extCount}%` }}>
              <Image
                src={isMobile ? slide.imageMobile : slide.image}
                alt={safeAlt(undefined, slide.title)}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Title / Desc overlay */}
        <div className="absolute left-0 right-0 top-0" style={s!.headerBg ? { background: s!.headerBg } : undefined}>
          <div className="p-4 sm:p-6 md:p-10">
            <h3 className={"font-bold drop-shadow " + (isMobile ? "text-3xl" : "text-3xl md:text-5xl")} style={{ color: s!.headerTextColor || 'rgba(0,0,0,0.9)' }}>{s!.title}</h3>
            <p className={"max-w-xl mt-2 " + (isMobile ? "text-sm" : "text-base md:text-lg")} style={{ color: s!.headerTextColor || 'rgba(0,0,0,0.9)' }}>{s!.desc}</p>
          </div>
        </div>

        {/* CTA + Arrows (bottom-left) */}
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

        {/* Thumbnails */}
        <div className="absolute bottom-[22px] md:bottom-4 right-4 md:right-6" style={{ width: STRIP_W }}>
          <div className="flex items-center" style={{ gap: GAP, overflow: 'hidden' }} aria-label="Thumbnails">
            {visible.map((it, i) => {
              const isActive = i === 0;
              const isHalf = (isMobile ? (i === 2) : (i === 3));
              const w = isHalf ? HALF_W : THUMB_W;
              return (
                <button
                  key={`${it.id}-${i}`}
                  onClick={() => goFwd(i)}
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
