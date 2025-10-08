'use client';
import 'client-only';

export type Model = any;

export async function fetchAllModels(): Promise<Model[]> {
  const res = await fetch('/data/models.json', { cache: 'no-store' });
  if (!res.ok) return [];
  try { return await res.json(); } catch { return []; }
}
