import type { Metadata } from 'next';

import { Source_Code_Pro } from 'next/font/google';

import './globals.css';
import Link from 'next/link';
import { PATHS } from '@/paths';
import { Providers } from '@/components/providers';

const sourceCodePro = Source_Code_Pro({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Menfem App',
  description: 'Welcome to the Menfem App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sourceCodePro.className}>
        <Providers>
          <nav
            className="
            supports-backdrop-blur:bg-background/60
            fixed left-0 right-0 top-0 z-20 border-b 
            bg-background/95 backdrop-blur w-full flex 
            py-2.5 px-5 justify-between
          "
          >
            <div className="flex gap-6">
              <Link href={PATHS.HOME} className="text-lg bold">
                Home
              </Link>
              <Link href="/articles" className="text-lg">
                Articles
              </Link>
            </div>
          </nav>
          <main className="min-h-screen flex-1 overflow-x-hidden py-24 px-8 bg-secondary-20 flex flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
