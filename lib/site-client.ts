'use client';

import { useEffect, useState } from 'react';

export type SiteConfig = {
  company?: string;
  address?: string;
  phones?: string[];
  whatsapp?: string;   // E.164 without '+'
  instagram?: string;
  biz_hours?: string;
  map_url?: string;
};

/** CSR hook: reads /public/data/site.json at runtime */
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
