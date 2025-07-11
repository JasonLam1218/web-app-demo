'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#96D9C0', // light green color 
      // Soft, muted green for primary elements
      // Used in: Logo, headings, primary action buttons
      
      dark: '#51A687', // dark green 
      // Darker green for hover states and active elements
      
      light: '#4ade80', // lighter green variant
      // Lighter green for gradients, backgrounds, and subtle highlights
    },
    secondary: {
      main: '#6b7280', // neutral gray
      // Used for secondary text, dividers, and supporting elements
    },
    background: {
      default: '#f8fafc', // very light gray/blue background
      // Main page background, provides soft contrast
      
      paper: '#ffffff', // pure white
      // Background for cards, modals, and elevated surfaces
    },
    text: {
      primary: '#1f2937', // deep gray, almost black
      // Main text color for headings and primary content
      
      secondary: '#6b7280', // medium gray
      // Used for supporting text, captions, and less important information
    },
    // Optional: Add more color context if needed
    action: {
      hover: 'rgba(136, 231, 136, 0.1)', // light green hover state
      // Subtle interaction feedback
    },
    divider: 'rgba(107, 114, 128, 0.2)', // light gray divider
    // Soft dividers between sections
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