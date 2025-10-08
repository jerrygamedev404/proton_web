// Updated Footer with reusable Contact Us section
'use client';
import ContactBlock from '@/components/ContactBlock';


export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="#footer" className="border-t mt-4">
      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-6 sm:grid-cols-3 text-sm">
        {/* Contact Us section reused */}
        <div className="sm:col-span-2">
          <div className="font-semibold mb-2">Contact Us</div>
          <ContactBlock />
        </div>

        {/* Legal / Disclaimer */}
        <div className="text-neutral-500">
          <div className="font-semibold mb-2">Notice</div>
          <p className="mb-2">图片仅供示意，价格以官方/门店最终为准。Prices may vary by region, insurance and accessories.</p>
          <p>© {year} Proton Dealer.</p>
        </div>
      </div>
    </footer>
  );
}
