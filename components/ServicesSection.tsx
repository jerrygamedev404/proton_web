'use client';
/**
 * ServicesSection — mobile-safe, no horizontal scroll.
 * - No buttons, pure content (title + paragraph), focus attention.
 * - Uses Tailwind utilities to clamp width and hide overflow-x on the section.
 * - Images (if any) must use object-cover and max-w-full to avoid overflow.
 */
export default function ServicesSection() {
  const items = [
    {
      k: 'financing',
      title: 'Vehicle Financing',
      desc: 'Competitive rates and flexible terms tailored to your financial situation. We help you choose plans that balance down payment and monthly installments.'
    },
    {
      k: 'maintenance',
      title: 'Expert Maintenance',
      desc: 'Factory-trained technicians using genuine parts for optimal performance and reliability — scheduled service reminders included.'
    },
    {
      k: 'tradein',
      title: 'Trade‑In Evaluation',
      desc: 'Get top dollar for your current vehicle with our transparent and fair appraisal process.'
    },
    {
      k: 'warranty',
      title: 'Extended Warranty',
      desc: 'Comprehensive protection plans for peace of mind on the road, from powertrain coverage to concierge support.'
    }
  ] as const;

  return (
    <section
      id="services"
      className="relative mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-14
                 overflow-x-hidden [contain:layout_paint] overscroll-x-contain"
    >
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Our Services</h2>
        <p className="text-sm sm:text-base text-neutral-600 mt-2">
          Focused essentials — finance, care, trade‑in, warranty.
        </p>
      </div>

      {/* Mobile: 1 column; ≥sm: 2 columns; spacing large enough to avoid crowding */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {items.map((it, i) => (
          <div
            key={it.k}
            className="rounded-2xl border border-neutral-200 bg-white/90
                       shadow-sm p-5 sm:p-6
                       overflow-hidden"
          >
            {/* Alternating layout by index is *visual only*, but keep DOM simple to prevent overflow */}
            <div className="flex items-start gap-4">
              {/* Icon placeholder — square and clamped */}
              <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-sky-200 to-indigo-200"></div>
              <div className="min-w-0">
                <h3 className="font-semibold text-base sm:text-lg">{it.title}</h3>
                <p className="mt-1 text-sm sm:text-base text-neutral-600 leading-relaxed">
                  {it.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
