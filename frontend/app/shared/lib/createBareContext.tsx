'use client';
import type { ReactNode } from 'react';

import { createContext, use } from 'react';

export const createBareContext = <
  InitialValue,
  ActualValue = InitialValue extends undefined
    ? null
    : InitialValue extends null
      ? null
      : InitialValue
>(
  value?: InitialValue
) => {
  const Context = createContext<ActualValue>((value || null) as ActualValue);

  const useUnsafeContext = () => use(Context);

  interface ProviderProps {
    children?: ReactNode;
    value: ActualValue;
  }

  const Provider = ({ children, value }: ProviderProps) => (
    <Context value={value}>{children}</Context>
  );

  return [Provider, useUnsafeContext] as const;
};
