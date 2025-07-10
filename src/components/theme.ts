 'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#22c55e', // Green color matching the design
      dark: '#16a34a',
      light: '#4ade80',
    },
    secondary: {
      main: '#6b7280',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#1f2937',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1f2937',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1f2937',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#4b5563',
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
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
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

export default theme;
