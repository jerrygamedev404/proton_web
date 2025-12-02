'use client';
/**
 * ServicesSection — mobile-safe, no horizontal scroll.
 * - No buttons, pure content (title + paragraph), focus attention.
 * - Uses Tailwind utilities to clamp width and hide overflow-x on the section.
 * - Images (if any) must use object-cover and max-w-full to avoid overflow.
 */
import Image from "next/image";

export default function ServicesSection() {
  const items = [
    {
      k: "financing",
      title: "Vehicle Financing",
      desc: "Smarter plans built around your budget: competitive rates, flexible tenures, and guidance to strike the right balance between upfront payment and monthly commitments.",
      icon: "/images/etc/car.png",
    },
    {
      k: "maintenance",
      title: "Expert Maintenance",
      desc: "Service by factory-trained technicians using genuine parts only—tuned for performance and longevity, with proactive reminders so you never miss a scheduled visit.",
      icon: "/images/etc/repair.png",
    },
    {
      k: "tradein",
      title: "Trade-In Evaluation",
      desc: "A transparent, data-driven appraisal that maximizes your return—no guesswork, no pressure—so you can step into your next car with confidence.",
      icon: "/images/etc/exchange.png",
    },
    {
      k: "warranty",
      title: "Extended Warranty",
      desc: "Drive worry-free with comprehensive coverage options—from core powertrain protection to premium concierge support—customized to how you use your vehicle.",
      icon: "/images/etc/warranty.png",
    },
  ];

  return (
    <section
      id="services"
      className="relative mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-14
                 overflow-x-hidden [contain:layout_paint] overscroll-x-contain"
    >
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Our Services</h2>
        <p className="text-sm sm:text-base text-neutral-600 mt-2">
          Focused essentials — finance, care, trade-in, warranty.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {items.map((it) => (
          <div
            key={it.k}
            className="rounded-2xl border border-neutral-200 bg-white/90 shadow-sm p-5 sm:p-6 overflow-hidden"
          >
            <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl
               bg-gradient-to-br from-sky-200 to-indigo-200
               relative overflow-hidden"
              >
                <Image src={it.icon} alt={it.title} fill className="object-contain p-2" sizes="56px" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-base sm:text-lg">{it.title}</h3>
                <p className="mt-1 text-sm sm:text-base text-neutral-600 leading-relaxed">{it.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
