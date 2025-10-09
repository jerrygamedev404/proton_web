'use client';

import Image from 'next/image';
import Link from 'next/link';
import AnchorLink from '@/components/AnchorLink';
import Section from '@/components/Section';
import { formatPrice } from '@/lib/utils';

type ModelLite = { id: string; name: string; heroImage?: string; priceFrom?: number; };

export default function PopularModels({
  id = 'popular_car',
  title = 'Hot Deal',
  models,
  detailAnchorId = '#featured',
  detailHref = '#featured',
  className = 'py-6',
}: {
  id?: string;
  title?: string;
  models: ModelLite[];
  detailAnchorId?: string;
  detailHref?: string;
  className?: string;
}) {
  return (
    <Section id={id} className={className}>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map(m => (
          <div key={m.id} className="card relative overflow-hidden group">
            <AnchorLink href={detailHref} anchorId={detailAnchorId} className="block focus:outline-none" ariaLabel={`View featured highlights for ${m.name}`}>
              <div className="relative aspect-[16/10]">
                {m.heroImage ? (
                  <Image
                    src={m.heroImage}
                    alt={m.name}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-100" aria-hidden />
                )}
              </div>
            </AnchorLink>
            <div className="p-4">
              <div className="flex items-end gap-3">
                <div className="min-w-0">
                  <div className="font-medium leading-5 truncate">{m.name}</div>
                  <div className="text-sm text-neutral-600 leading-5">Price from {formatPrice(m.priceFrom)}</div>
                </div>
                <div className="ml-auto flex items-center gap-2 shrink-0">
                  <AnchorLink href={detailHref} anchorId={detailAnchorId} className="btn btn-outline px-3 py-1.5 text-xs whitespace-nowrap" ariaLabel={`See detail for ${m.name}`}>
                    Detail
                  </AnchorLink>
                  <Link
                    href={`/contact?model=${m.id}`}
                    className="btn btn-primary px-4 py-1.5 text-xs whitespace-nowrap rounded-full"
                    aria-label={`Inquiry about ${m.name}`}
                  >
                    Inquiry
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
