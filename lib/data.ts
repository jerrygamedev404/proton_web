import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import type { Model } from '@/lib/types';

const dataPath = path.join(process.cwd(), 'public', 'data', 'models.json');

export function getAllModels(): Model[] {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw) as Model[];
}

export function getModelById(id: string): Model | undefined {
  return getAllModels().find(m => m.id === id);
}
