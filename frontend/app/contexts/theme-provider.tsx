import type { PropsWithChildren } from 'react';

import {
  getCookie,
  setCookie,
  useIsomorphicLayoutEffect,
  usePreferredColorScheme
} from '@siberiacancode/reactuse';
import { createContext, use, useMemo, useState } from 'react';

import { THEME_COOKIE_KEY } from '@/shared/const';

export type Theme = 'dark' | 'light' | 'system';

export interface ThemeContextValue {
  value: Exclude<Theme, 'system'>;
  set: (theme: Theme) => void;
}

const getTheme = (theme: Theme): 'dark' | 'light' => {
  if (theme === 'system') {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
};

export const ThemeContext = createContext<ThemeContextValue>({
  value: 'light',
  set: () => {}
});

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = usePreferredColorScheme();

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    return (getCookie(THEME_COOKIE_KEY) as Theme | undefined) ?? 'system';
  });

  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    const activeTheme = getTheme(theme);

    setCookie(THEME_COOKIE_KEY, theme, {
      path: '/'
    });

    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);
  }, [theme, colorScheme]);

  const value = useMemo(() => ({ value: getTheme(theme), set: setTheme }), [theme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
};

export const useTheme = () => use(ThemeContext);
