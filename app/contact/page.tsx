import { Suspense } from 'react';
import ContactPageClient from '@/components/ContactPageClient';

export const dynamic = 'force-static'; // safe for SSG; client reads JSON at runtime

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-8">Loading…</div>}>
      <ContactPageClient />
    </Suspense>
  );
}
