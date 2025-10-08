// lib/utils.ts — common helpers
export const formatPrice = (n?: number | null) => {
  const val = typeof n === 'number' && isFinite(n) ? n : null;
  return val === null ? 'RM —' : `RM ${val.toLocaleString('en-MY')}`;
};

export const buildWaUrl = (phoneE164: string, text: string) =>
  `https://wa.me/${phoneE164}?text=${encodeURIComponent(text)}`;
