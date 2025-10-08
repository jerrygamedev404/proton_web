import React from 'react';

/** Unified section wrapper with container & data-block delimiter */
export default function Section({
  id,
  className,
  container = true,
  bordered = true,
  ariaLabel,
  children
}: React.PropsWithChildren<{
  id?: string;
  className?: string;
  container?: boolean;
  bordered?: boolean;
  ariaLabel?: string;
}>) {
  const rootCn = ['py-6', className].filter(Boolean).join(' ');
  const innerCn = container ? 'mx-auto max-w-6xl px-4' : undefined;
  return (
    <section id={id} data-block aria-label={ariaLabel} className={rootCn} data-bordered={bordered ? '' : undefined}>
      <div className={innerCn}>{children}</div>
    </section>
  );
}
