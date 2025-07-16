'use client';

import { createTheme} from '@mui/material/styles';

const createAppTheme = (mode: 'light' | 'dark' ) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#96D9C0', // light green color
      dark: '#51A687', // dark green
      light: '#4ade80', // lighter green variant
    },
    secondary: {
      main: '#6b7280', // neutral gray
    },
    background: {
      default: mode === 'light' ? '#f8fafc' : '#121212', // Dynamic background
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e', // Dynamic paper background
    },
    text: {
      primary: mode === 'light' ? '#1f2937' : '#ffffff', // Dynamic text color
      secondary: mode === 'light' ? '#6b7280' : 'rgba(255, 255, 255, 0.7)', // Dynamic secondary text
    },
    action: {
      hover: mode === 'light' 
        ? 'rgba(136, 231, 136, 0.1)' 
        : 'rgba(255, 255, 255, 0.08)', // Dynamic hover state
    },
    divider: mode === 'light' 
      ? 'rgba(107, 114, 128, 0.2)' 
      : 'rgba(255, 255, 255, 0.12)', // Dynamic divider
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: mode === 'light' ? '#1f2937' : '#ffffff',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: mode === 'light' ? '#1f2937' : '#ffffff',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: mode === 'light' ? '#1f2937' : '#ffffff',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: mode === 'light' ? '#4b5563' : 'rgba(255, 255, 255, 0.87)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 500,
          padding: '12px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: mode === 'light' 
              ? '0 4px 12px rgba(34, 197, 94, 0.4)' 
              : '0 4px 12px rgba(150, 217, 192, 0.4)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: '#22c55e',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#22c55e',
            },
          },
        },
      },
    },
  },
});

export default createAppTheme;
