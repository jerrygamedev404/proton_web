'use client';
import Link from 'next/link';
import { anchorClick } from '@/lib/scroll';

type Props = {
  desktopImage: string;
  mobileImage: string;
  eyebrow?: string;
  title?: string | React.ReactNode;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryAnchorId?: string;
  secondaryAnchorId?: string;
};

export default function FullScreenHero({
  desktopImage,
  mobileImage,
  eyebrow,
  title = 'BORN\nTO PLAY',
  primaryLabel = 'BROWSE INVENTORY',
  secondaryLabel = 'SCHEDULE TEST DRIVE',
  primaryAnchorId = 'popular',
  secondaryAnchorId = 'contact',
}: Props) {
  return (
    <section data-block className="relative w-full overflow-hidden rounded-none min-h-[calc(100svh-var(--header-h))]">
      <picture>
        <source media="(min-width: 768px)" srcSet={desktopImage} />
        <img
          src={mobileImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
          loading="eager"
        />
      </picture>

      <div className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-8">
        {eyebrow && <div className="text-white/90 font-semibold tracking-wide mb-4 drop-shadow-lg">{eyebrow}</div>}
        <h1 className="text-white font-extrabold leading-tight drop-shadow-xl text-5xl sm:text-6xl md:text-7xl whitespace-pre-line">
          {title}
        </h1>
      </div>

      <nav aria-label="Hero actions" className="pointer-events-auto absolute inset-x-0 bottom-10 z-20 flex flex-col items-center gap-3 px-5 py-24">
        <Link
          href={`/${primaryAnchorId}`}
          onClick={anchorClick(primaryAnchorId!)}
          className="btn rounded-full px-7 py-3 text-base md:text-lg font-semibold shadow-lg ring-2 ring-black/15"
          style={{ backgroundImage: 'linear-gradient(180deg, var(--acc), var(--acc2))', color: '#000' }}
        >
          {primaryLabel}
        </Link>
        <Link
          href={`/contact`}
          className="btn rounded-full px-7 py-3 text-base md:text-lg font-semibold border border-white/70 text-white bg-white/10 hover:bg-white/20 backdrop-blur"
        >
          {secondaryLabel}
        </Link>
      </nav>
    </section>
  );
}
