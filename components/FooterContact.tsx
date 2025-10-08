import { getSiteConfigSync } from '@/lib/site-server';
import dynamic from 'next/dynamic';

const ContactBlock = dynamic(() => import('@/components/ContactBlock'), { ssr: false });

export default function FooterContact() {
  const cfg = getSiteConfigSync();
  return (
    <section aria-label="Contact in footer" className="border-t mt-12">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 sm:grid-cols-3 text-sm">
        <div className="sm:col-span-2">
          {/* CSR 读取 /data/site.json，先用 SSR 值避免闪屏 */}
          <ContactBlock initial={cfg} compact showForm={false} />
        </div>
        <div className="text-neutral-500">&copy; {new Date().getFullYear()} Proton Dealer. 价格与配置以官方最新为准。</div>
      </div>
    </section>
  );
}
