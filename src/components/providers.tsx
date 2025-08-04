// ABOUTME: Provider components for Next.js app including nuqs adapter and toast notifications
// ABOUTME: Client component that wraps children with necessary providers

'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      {children}
      <Toaster position="top-right" />
    </NuqsAdapter>
  );
}