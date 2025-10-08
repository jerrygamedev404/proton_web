// server-only: safe to import in Server Components only
import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

export type SiteConfig = {
  company?: string;
  address?: string;
  phones?: string[];
  whatsapp?: string;   // E.164 without '+'
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
