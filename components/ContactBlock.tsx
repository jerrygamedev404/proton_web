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
    return `我想预约试驾 Proton ${model}（可填日期/时间）\n姓名：${name}\n联系电话：${phone}${note ? `\n备注：${note}` : ''}`;
  }, [model, name, phone, note]);

  const waHref = cfg.whatsapp ? `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(waText)}` : undefined;
  const igHref = cfg.instagram ? `https://instagram.com/${cfg.instagram}` : undefined;

  return (
    <div className={className}>
      <div className={"rounded-2xl border p-5 " + (compact ? "" : "mb-6")}>
        {cfg.company && <div className="font-medium mb-1">{cfg.company}</div>}
        {cfg.address && <div className="mb-1">{cfg.address}</div>}
        {cfg.biz_hours && <div className="text-sm text-neutral-600 mb-1">营业时间：{cfg.biz_hours}</div>}
        <div className="space-y-1">
          {cfg.phones?.map(p => (
            <a key={p} className="underline block" href={`tel:${p.replace(/\s+/g,'')}`}>电话：{p}</a>
          ))}
          {cfg.whatsapp && <a className="underline block" href={`https://wa.me/${cfg.whatsapp}`} target="_blank">WhatsApp</a>}
          {cfg.instagram && <a className="underline block" href={igHref} target="_blank">Instagram</a>}
          {cfg.map_url && <a className="underline block" href={cfg.map_url} target="_blank">在地图中打开</a>}
        </div>
      </div>

      {showForm && (
        <div className="rounded-2xl border p-5">
          <div className="font-medium mb-3">快速预约（打开 WhatsApp）</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="border rounded-xl px-3 py-2" placeholder="姓名" value={name} onChange={e=>setName(e.target.value)} />
            <input className="border rounded-xl px-3 py-2" placeholder="联系电话" value={phone} onChange={e=>setPhone(e.target.value)} />
            <input className="border rounded-xl px-3 py-2 sm:col-span-2" placeholder="意向车型（如 X50）" value={model} onChange={e=>setModel(e.target.value)} />
            <input className="border rounded-xl px-3 py-2 sm:col-span-2" placeholder="备注（可选）" value={note} onChange={e=>setNote(e.target.value)} />
          </div>
          {waHref ? (
            <a href={waHref} target="_blank" className="mt-4 inline-flex rounded-xl px-5 py-3 bg-emerald-600 text-white">打开 WhatsApp 发送</a>
          ) : (
            <div className="mt-4 text-sm text-red-600">尚未配置 WhatsApp 号码（/public/data/site.json）</div>
          )}
          <p className="text-xs text-neutral-500 mt-2">提交即通过 WhatsApp 与我们联系；不保存表单数据。</p>
        </div>
      )}
    </div>
  );
}
