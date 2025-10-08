import fs from 'node:fs';
import path from 'node:path';
import { useEffect, useState } from 'react';

export type SiteConfig = {
  company?: string;
  address?: string;
  phones?: string[];
  whatsapp?: string;
  instagram?: string;
  biz_hours?: string;
  map_url?: string;
};

const jsonPath = path.join(process.cwd(), 'public', 'data', 'site.json');

export function getSiteConfigSync(): SiteConfig {
  try {
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    return JSON.parse(raw) as SiteConfig;
  } catch {
    return {};
  }
}

export function useSiteConfig(initial?: SiteConfig) {
  const [cfg, setCfg] = useState<SiteConfig>(initial || {});
  useEffect(() => {
    fetch('/data/site.json', { cache: 'no-store' })
      .then(r => r.json())
      .then(setCfg)
      .catch(()=>{});
  }, []);
  return cfg;
}
