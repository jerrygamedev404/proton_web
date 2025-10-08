'use client';
type Props = { msrp?: number; promo?: number | null; until?: string | null; note?: string | null; };
export default function PriceTag({ msrp, promo, until, note }: Props) {
  const hasPromo = typeof promo === 'number' && promo > 0 && (!!msrp && promo < msrp);
  return (
    <div className="space-y-1">
      {hasPromo ? (
        <div className="flex items-baseline gap-2">
          <div className="text-rose-600 text-xl font-semibold">RM {promo!.toLocaleString('en-MY')}</div>
          {msrp && <div className="line-through text-sm text-slate-500">RM {msrp.toLocaleString('en-MY')}</div>}
          {until && <span className="text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full">至 {until}</span>}
        </div>
      ) : (
        msrp != null && <div className="text-indigo-600 text-xl font-semibold">RM {msrp.toLocaleString('en-MY')}</div>
      )}
      {note && <div className="text-xs text-slate-500">{note}</div>}
      <div className="text-xs text-slate-500">* Price may vary by region.</div>
    </div>
  );
}
