'use client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/lib/theme';
import { EmotionCache } from '@/providers/EmotionCache';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <EmotionCache>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </EmotionCache>
  );
} 