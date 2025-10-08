'use server';
import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

export type Dimension = { L: number; W: number; H: number; wheelbase: number };
export type Variant = { name: string; price: number; engine?: string; transmission?: string; adas?: string[]; infotainment?: string[] };
export type Specs = { power?: string; torque?: string; fuelEconomy?: string; dimensions?: Dimension; seats?: number; tires?: string };
export type Model = {
  id: string; name: string; segment: string; priceFrom: number; isNew?: boolean;
  highlights: string[]; heroImage: string; gallery: string[]; variants: Variant[];
  specs?: Specs; brochureUrl?: string; colors?: string[]; tags?: string[];
};

const dataPath = path.join(process.cwd(), 'public', 'data', 'models.json');

export function getAllModels(): Model[] {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw) as Model[];
}

export function getModelById(id: string): Model | undefined {
  return getAllModels().find(m => m.id === id);
}
