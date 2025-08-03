// ABOUTME: Provider components for Next.js app including nuqs adapter
// ABOUTME: Client component that wraps children with necessary providers

'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      {children}
    </NuqsAdapter>
  );
}