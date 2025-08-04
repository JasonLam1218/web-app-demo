/**
 * Material-UI Theme Configuration
 * 
 * This module provides a dynamic theme configuration for the EduAI application
 * using Material-UI. It supports both light and dark modes with custom colors
 * and component styling.
 */

'use client';

import { createTheme} from '@mui/material/styles';

/**
 * Create Application Theme
 * 
 * Creates a Material-UI theme with custom colors, typography, and component
 * styling. The theme adapts to light and dark modes with appropriate color
 * schemes and styling.
 * 
 * @param mode - Theme mode: 'light' or 'dark'
 * @returns Material-UI theme object
 */
const createAppTheme = (mode: 'light' | 'dark' ) => createTheme({
  // Color palette configuration
  palette: {
    mode, // Set theme mode (light/dark)
    
    // Primary color scheme - green tones for EduAI branding
    primary: {
      main: '#96D9C0', // Main green color
      dark: '#51A687', // Darker green variant
      light: '#4ade80', // Lighter green variant
    },
    
    // Secondary color scheme - neutral gray
    secondary: {
      main: '#6b7280', // Neutral gray
    },
    
    // Background colors that adapt to theme mode
    background: {
      default: mode === 'light' ? '#f8fafc' : '#121212', // Main background
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e', // Paper/surface background
    },
    
    // Text colors that adapt to theme mode
    text: {
      primary: mode === 'light' ? '#1f2937' : '#ffffff', // Primary text
      secondary: mode === 'light' ? '#6b7280' : 'rgba(255, 255, 255, 0.7)', // Secondary text
    },
    
    // Action colors for interactive elements
    action: {
      hover: mode === 'light' 
        ? 'rgba(136, 231, 136, 0.1)' // Light green hover in light mode
        : 'rgba(255, 255, 255, 0.08)', // Subtle white hover in dark mode
    },
    
    // Divider colors that adapt to theme mode
    divider: mode === 'light' 
      ? 'rgba(107, 114, 128, 0.2)' // Subtle gray divider in light mode
      : 'rgba(255, 255, 255, 0.12)', // Subtle white divider in dark mode
  },
  
  // Typography configuration
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    
    // Heading styles
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
    
    // Body text style
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: mode === 'light' ? '#4b5563' : 'rgba(255, 255, 255, 0.87)',
    },
  },
  
  // Component-specific styling overrides
  components: {
    // Button component styling
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded corners
          textTransform: 'none', // Preserve original text case
          fontSize: '1rem',
          fontWeight: 500,
          padding: '12px 24px',
        },
        contained: {
          boxShadow: 'none', // Remove default shadow
          '&:hover': {
            // Add custom hover shadow with green tint
            boxShadow: mode === 'light' 
              ? '0 4px 12px rgba(34, 197, 94, 0.4)' 
              : '0 4px 12px rgba(150, 217, 192, 0.4)',
          },
        },
      },
    },
    
    // TextField component styling
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, // Rounded corners for input fields
            '&:hover fieldset': {
              borderColor: '#22c55e', // Green border on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#22c55e', // Green border when focused
            },
          },
        },
      },
    },
  },
});

export default createAppTheme;
