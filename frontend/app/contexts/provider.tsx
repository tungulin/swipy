'use client';

import type { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';

import { AuthProvider } from './auth-provider';
import { ThemeProvider } from './theme-provider';

export const queryClient = new QueryClient();

export const Provider = ({ children }: PropsWithChildren) => (
  <NuqsAdapter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </NuqsAdapter>
);
