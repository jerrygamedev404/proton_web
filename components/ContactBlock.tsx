'use client';
import { useSearchParams } from 'next/navigation';
import { useSiteConfig, type SiteConfig } from '@/lib/site-client';
import { useMemo, useState } from 'react';

type Props = {
  initial?: SiteConfig;       // SSR initial from server (optional)
  compact?: boolean;          // footer compact mode
  showForm?: boolean;
  className?: string;
};

export default function ContactBlock({ initial, compact = false, showForm = true, className }: Props) {
  const cfg = useSiteConfig(initial);
  const sp = useSearchParams();
  const preModel = sp.get('model') || 'X50';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [model, setModel] = useState(preModel);
  const [note, setNote] = useState('');

  const waText = useMemo(() => {
    return `I would like to book test drive for Proton ${model}（Date/Time）\nName：${name}\nContact：${phone}${note ? `\nRemarks：${note}` : ''}`;
  }, [model, name, phone, note]);

  const waHref = cfg.whatsapp ? `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(waText)}` : undefined;
  const igHref = cfg.instagram ? `https://instagram.com/${cfg.instagram}` : undefined;

  return (
    <div className={className}>
      <div className={"rounded-2xl border p-5 " + (compact ? "" : "mb-6")}>
        {cfg.company && <div className="font-medium mb-1">{cfg.company}</div>}
        {cfg.address && <div className="mb-1">{cfg.address}</div>}
        {cfg.biz_hours && <div className="text-sm text-neutral-600 mb-1">Operation Hour：{cfg.biz_hours}</div>}
        <div className="space-y-1">
          {cfg.phones?.map(p => (
            <a key={p} className="underline block" href={`tel:${p.replace(/\s+/g,'')}`}>Phone No：{p}</a>
          ))}
          {cfg.whatsapp && <a className="underline block" href={`https://wa.me/${cfg.whatsapp}`} target="_blank">WhatsApp</a>}
          {cfg.instagram && <a className="underline block" href={igHref} target="_blank">Instagram</a>}
          {cfg.map_url && <a className="underline block" href={cfg.map_url} target="_blank">Google Map</a>}
        </div>
      </div>

      {showForm && (
        <div className="rounded-2xl border p-5">
          <div className="font-medium mb-3">Quick Booking（WhatsApp）</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="border rounded-xl px-3 py-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
            <input className="border rounded-xl px-3 py-2" placeholder="Phone No" value={phone} onChange={e=>setPhone(e.target.value)} />
            <input className="border rounded-xl px-3 py-2 sm:col-span-2" placeholder="Car Model（Example: X50）" value="" onChange={e=>setModel(e.target.value)} />
            <input className="border rounded-xl px-3 py-2 sm:col-span-2" placeholder="Remarks (Optional)" value={note} onChange={e=>setNote(e.target.value)} />
          </div>
          {waHref ? (
            <a href={waHref} target="_blank" className="mt-4 inline-flex rounded-xl px-5 py-3 bg-emerald-600 text-white">Send via Whatsapp</a>
          ) : (
            <div className="mt-4 text-sm text-red-600">Invalid WhatsApp No（/public/data/site.json）</div>
          )}
          <p className="text-xs text-neutral-500 mt-2">We do not store this form data.</p>
        </div>
      )}
    </div>
  );
}
