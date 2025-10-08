'use client';

import Link, { LinkProps } from 'next/link';
import React from 'react';
import { anchorClick } from '@/lib/scroll';

type Props = LinkProps & {
  anchorId: string;     // target id, no '#'
  className?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
};

/** Link wrapper that smooth-scrolls on same-page anchors and navigates across pages normally. */
export default function AnchorLink({ anchorId, className, ariaLabel, children, ...rest }: Props) {
  return (
    <Link
      {...rest}
      className={className}
      aria-label={ariaLabel}
      href={(rest.href as string) || `/${anchorId}`}
      onClick={anchorClick(anchorId)}
      prefetch={false}
    >
      {children}
    </Link>
  );
}
