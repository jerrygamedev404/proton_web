// lib/scroll.ts — unified hash anchor utilities (SSR-safe)
export type ScrollOptions = { offset?: number; behavior?: ScrollBehavior };

export function getHeaderOffset(): number {
  if (typeof window === 'undefined') return 0;
  const css = getComputedStyle(document.documentElement).getPropertyValue('--header-h').trim();
  const cssVal = parseInt(css || '0', 10) || 0;
  const sticky = document.querySelector<HTMLElement>('header.sticky,[data-header]');
  return Math.max(cssVal, sticky?.offsetHeight ?? 0, 0);
}

export function scrollToId(id: string, opts: ScrollOptions = {}): void {
  if (typeof window === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const offset = typeof opts.offset === 'number' ? opts.offset : (getHeaderOffset());
  const top = rect.top + window.scrollY - offset;
  window.scrollTo({ top, behavior: opts.behavior ?? 'smooth' });
}

/** anchorClick: only prevents default when anchor exists on current page */
export function anchorClick(id: string, opts?: ScrollOptions) {
  return (e?: { preventDefault?: () => void }) => {
    if (typeof window === 'undefined') return;
    const exists = !!document.getElementById(id);
    if (exists) {
      e?.preventDefault?.();
      scrollToId(id, opts);
      if (location.hash !== `#${id}`) history.replaceState(null, '', `${id}`);
    } else {
      console.log("HIHI")
      // allow default navigation to /#id
    }
  };
}
