// lib/a11y.ts
// Scheme B: centralize alt text safety to avoid passing boolean `false` to <img>/<Image>.
export const safeAlt = (v?: unknown, fallback = ''): string => {
  if (typeof v === 'string' && v.trim() !== '') return v;
  if (typeof fallback === 'string' && fallback.trim() !== '') return fallback;
  return '';
};
