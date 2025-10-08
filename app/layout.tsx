import '../styles/globals.css';

export const metadata = {
  title: 'Proton X50',
  description: 'Proton X50 — static site',
};

import Header from '@/components/Header';
import { Suspense } from 'react';
import Footer from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>
        <Header />
        <main className="flex-1">{children}</main>
        <Suspense fallback={null}><Footer /></Suspense>
      </body>
    </html>
  );
}
