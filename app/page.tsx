import dynamic from 'next/dynamic';
import { getAllModels, getModelById } from '@/lib/data';
import ServicesSection from '@/components/ServicesSection';
import FullScreenHero from '@/components/FullScreenHero';
import PopularModels from '@/components/PopularModels';

const FeaturedCarousel = dynamic(() => import('@/components/FeaturedCarousel'), { ssr: false });

export default function HomePage() {
  const all = getAllModels();
  const x50 = getModelById('x50') || all[0];
  const popular = all;//.filter(m => m.id !== x50?.id).slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section id="#hero" data-block className="relative">
        <FullScreenHero
          desktopImage="/images/hero/home_pc.jpeg"  // ≥768px
          mobileImage="/images/hero/home_m.jpeg"    // <768px
          eyebrow=""
          title={""}
          primaryLabel="BROWSE INVENTORY"               // 更突出 → 热门车型
          secondaryLabel="SCHEDULE TEST DRIVE"
          primaryAnchorId="#popular_car"                     // ← 滚到热门车型
          secondaryAnchorId="#contact"                   // ← 滚到底部 Contact
        />
      </section>

      {/* Popular models showcase (no redirect) */}
      <PopularModels
        id="popular_car"
        title="热门车型"
        models={popular}             // 你已有的 popular 数组
        detailAnchorId="#featured"
        detailHref="/#featured"
      />

      {/* Carousel below Hero */}
      <section id="#featured" data-block className="mx-auto max-w-6xl px-0 py-0">
        <FeaturedCarousel intervalMs={6000} pauseAfterInteractionMs={10000}
        />
      </section>

      {/* Services on homepage */}
      <section data-block id="#services" className="border-t scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <ServicesSection />
        </div>
      </section>
    </div>
  );
}
