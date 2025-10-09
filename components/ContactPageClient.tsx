'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSiteConfig } from '@/lib/site-client';

const MODELS = ['X50','X70','X90','S70'] as const;
type ModelId = typeof MODELS[number];

// Helper: normalize incoming text like "Proton X70" -> "X70"
function normalizeModel(q: string | null): ModelId | null {
  if (!q) return null;
  let s = q.trim();
  s = s.replace(/^proton\s+/i, ''); // drop leading "Proton "
  // keep original case for e.MAS 7 matching
  const found = MODELS.find(m => m.toLowerCase() === s.toLowerCase());
  return found ?? null;
}


export default function ContactPageClient() {
  const cfg = useSiteConfig();
  const sp = useSearchParams();
  const modelFromUrl = sp.get('model') || 'X50';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const usp = new URLSearchParams(window.location.search);
    const m = normalizeModel(usp.get('model'));
    if (m) setModel(m);
  }, []);

  const [name, setName]   = useState('');
  const [phone, setPhone] = useState('');
  const [model, setModel] = useState(modelFromUrl);
  const [note, setNote]   = useState('');

  const waText = useMemo(() => (
    `I was interested in Proton ${model} (Date/Time)\nName: ${name}\nContact: ${phone}${note ? `\nRemarks: ${note}` : ''}`
  ), [model, name, phone, note]);

  const waHref = cfg.whatsapp ? `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(waText)}` : undefined;
  const igHref = cfg.instagram ? `https://instagram.com/${cfg.instagram}` : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>

      {/* Info from /public/data/site.json */}
      <div className="card p-5 mb-6">
        {cfg.company && <div className="font-medium mb-2">{cfg.company}</div>}
        {cfg.address && <div className="mb-1">{cfg.address}</div>}
        {cfg.map_url && <a className="underline block" href={cfg.map_url} target="_blank">Open in Google Map</a>}
        {cfg.phones?.map(p => (
          <a key={p} className="underline block" href={`tel:${p.replace(/\s+/g,'')}`}>No: {p}</a>
        ))}
        {cfg.whatsapp && <a className="underline block" href={`https://wa.me/${cfg.whatsapp}`} target="_blank">WhatsApp</a>}
        {cfg.instagram && <a className="underline block" href={igHref} target="_blank">Instagram</a>}
        {cfg.biz_hours && <div className="text-sm text-neutral-600 mt-1">Business Hours: {cfg.biz_hours}</div>}
      </div>

      {/* Quick Booking (WhatsApp) */}
      <div className="card p-5">
        <div className="font-medium mb-3">Quick Booking (WhatsApp)</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="border rounded-xl px-3 py-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="border rounded-xl px-3 py-2" placeholder="Contact" value={phone} onChange={e=>setPhone(e.target.value)} />
          <select className="border rounded-xl px-3 py-2" value={model} onChange={e=>setModel(e.target.value as ModelId)}>
            {MODELS.map(m => <option key={m} value={m}>{`Proton ${m}`}</option>)}
          </select>
          <input className="border rounded-xl px-3 py-2" placeholder="Remarks (Optional)" value={note} onChange={e=>setNote(e.target.value)} />
        </div>
        {waHref ? (
          <a href={waHref} target="_blank" className="mt-4 inline-flex btn btn-primary rounded-2xl">Send to WhatsApp</a>
        ) : (
          <div className="mt-4 text-sm text-red-600">WhatsApp number is not configured. Please edit /public/data/site.json.</div>
        )}
        <p className="text-xs text-slate-500 mt-2">Submission will contact us via WhatsApp; form data is not saved.</p>
      </div>
    </div>
  );
}
