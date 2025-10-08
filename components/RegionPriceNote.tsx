'use client';
import { useState } from 'react';
type Props = { available?: boolean };
export default function RegionPriceNote({ available=false }: Props) {
  const [region, setRegion] = useState('peninsular');
  return (
    <div className="text-xs text-slate-500 flex items-center gap-2">
      <label className="font-medium">Regional</label>
      <select className="border border-slate-200 rounded-md px-2 py-1 text-sm bg-white" value={region} onChange={e=>setRegion(e.target.value)}>
        <option value="peninsular">PENINSULAR MALAYSIA</option>
        <option value="east">EAST MALAYSIA</option>
        <option value="labuan">LABUAN</option>
        <option value="langkawi">LANGKAWI</option>
      </select>
      <div>
        <span>{available ? 'Prices shown will update based on region' : 'Prices may vary by region.'}</span>
      </div>
    </div>
  );
}
