'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import createAppTheme from '@/lib/theme';
import { EmotionCache } from '@/providers/EmotionCache';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // Use a state to manage the theme mode, initialized to a default ('light') for SSR
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // Detect system color scheme preference only on the client
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    // Once the component mounts on the client, update the mode based on system preference
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  // Create theme based on the current mode state
  const theme = useMemo(
    () => createAppTheme(mode),
    [mode]
  );

  return (
    <EmotionCache>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </EmotionCache>
  );
}
