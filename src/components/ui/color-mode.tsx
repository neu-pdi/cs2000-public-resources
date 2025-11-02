'use client';

import type { IconButtonProps, SpanProps } from '@chakra-ui/react';
import { ClientOnly, IconButton, Skeleton, Span } from '@chakra-ui/react';
import type { ThemeProviderProps } from 'next-themes';
import { ThemeProvider, useTheme } from 'next-themes';
import * as React from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';

export interface ColorModeProviderProps extends ThemeProviderProps {}

export function ColorModeProvider(props: ColorModeProviderProps) {
  const storageKey = props.storageKey || 'theme';

  // CRITICAL: Run synchronously during render (not in effect) to catch initial state
  // This runs before React finishes mounting, ensuring .dark/.light class is set immediately
  if (typeof document !== 'undefined') {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark' || theme === 'light') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  }

  // Also watch for changes using useLayoutEffect
  React.useLayoutEffect(() => {
    const syncClass = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'dark' || theme === 'light') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
      }
    };

    // Run immediately to catch any changes
    syncClass();

    // Watch for attribute changes (next-themes updates data-theme)
    const observer = new MutationObserver(() => {
      syncClass();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  // CRITICAL: Sync storage format between Docusaurus and next-themes
  // Docusaurus: stores "light"/"dark" or deletes key (system mode)
  // next-themes: stores "light"/"dark"/"system"
  // When next-themes writes "system", we need to convert to Docusaurus format (delete key)
  // When Docusaurus deletes key (system), next-themes needs to read it as "system"
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // Store original methods
    const originalSetItem = Storage.prototype.setItem;
    const originalGetItem = Storage.prototype.getItem;
    const originalRemoveItem = Storage.prototype.removeItem;

    // Track if we're in the middle of our own operation to avoid infinite loops
    let isInternalOperation = false;

    // Intercept localStorage.setItem to convert "system" to Docusaurus format
    Storage.prototype.setItem = function (key: string, value: string) {
      if (key === storageKey && value === 'system' && !isInternalOperation) {
        isInternalOperation = true;
        try {
          // Convert "system" to Docusaurus format: delete the key
          this.removeItem(key);
        } finally {
          isInternalOperation = false;
        }
      } else {
        originalSetItem.call(this, key, value);
      }
    };

    // Note: We don't intercept removeItem or getItem
    // - removeItem: Let it work normally, next-themes handles storage events
    // - getItem: next-themes handles null via defaultTheme, intercepting would break other code

    return () => {
      Storage.prototype.setItem = originalSetItem;
      Storage.prototype.getItem = originalGetItem;
      Storage.prototype.removeItem = originalRemoveItem;
    };
  }, [storageKey]);

  return (
    <ThemeProvider
      attribute="data-theme"
      disableTransitionOnChange
      enableSystem={true}
      {...props}
    />
  );
}

export type ColorMode = 'light' | 'dark';

export interface UseColorModeReturn {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };
  // resolvedTheme will be undefined during SSR/hydration
  // Once it's available, it's ready to use
  return {
    colorMode: resolvedTheme as ColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === 'dark' ? dark : light;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === 'dark' ? <LuMoon /> : <LuSun />;
}

interface ColorModeButtonProps extends Omit<IconButtonProps, 'aria-label'> {}

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode();
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
        ref={ref}
        {...props}
        css={{
          _icon: {
            width: '5',
            height: '5',
          },
        }}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  );
});

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    );
  },
);

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme dark"
        colorPalette="gray"
        colorScheme="dark"
        ref={ref}
        {...props}
      />
    );
  },
);
