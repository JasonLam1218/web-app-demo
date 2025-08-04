/**
 * Theme Registry Provider
 * 
 * This component provides Material-UI theming support for the EduAI application.
 * It manages theme state, detects system color scheme preferences, and provides
 * the theme context to all child components.
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import createAppTheme from '@/lib/theme';
import { EmotionCache } from '@/providers/EmotionCache';

/**
 * ThemeRegistry Component
 * 
 * Provides Material-UI theme context and manages theme mode switching.
 * Automatically detects system color scheme preference and applies appropriate theme.
 * 
 * @param children - React components to be wrapped with theme context
 */
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // Theme mode state - initialized to 'light' for SSR compatibility
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // Detect system color scheme preference using media query
  // This only works on the client side
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Update theme mode based on system preference when component mounts
  useEffect(() => {
    // Once the component mounts on the client, update the mode based on system preference
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  // Create theme object based on current mode state
  // Memoized to prevent unnecessary re-renders
  const theme = useMemo(
    () => createAppTheme(mode),
    [mode]
  );

  return (
    // EmotionCache provides SSR-compatible CSS-in-JS support
    <EmotionCache>
      {/* ThemeProvider provides theme context to all child components */}
      <ThemeProvider theme={theme}>
        {/* CssBaseline provides consistent base styles and CSS reset */}
        <CssBaseline />
        {/* Render child components with theme context */}
        {children}
      </ThemeProvider>
    </EmotionCache>
  );
}
