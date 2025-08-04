/**
 * Loading Component
 * 
 * This component is displayed during page transitions and loading states
 * in the EduAI application. It provides visual feedback to users while
 * content is being loaded.
 */

import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Loading Component
 * 
 * Displays a centered loading spinner with descriptive text to inform users
 * that content is being prepared. Used by Next.js during page transitions.
 */
export default function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh', // Full viewport height
        textAlign: 'center',
        p: 3, // Padding for mobile devices
      }}
    >
      {/* Animated loading spinner */}
      <CircularProgress size={60} sx={{ mb: 4, color: 'primary.main' }} />
      
      {/* Main loading text */}
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Loading...
      </Typography>
      
      {/* Descriptive subtitle */}
      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        Please wait while we prepare your content
      </Typography>
    </Box>
  );
} 