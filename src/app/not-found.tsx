/**
 * 404 Not Found Page Component
 * 
 * This component is displayed when users navigate to a route that doesn't exist
 * in the EduAI application. It provides a user-friendly error message and
 * a way to navigate back to the login page.
 */

'use client';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

/**
 * NotFound Component
 * 
 * Displays a 404 error page when users navigate to non-existent routes.
 * Provides a button to redirect users back to the login page.
 */
export default function NotFound() {
  const router = useRouter();

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
      {/* 404 error code */}
      <Typography variant="h1" sx={{ mb: 2, fontWeight: 700 }}>
        404
      </Typography>
      
      {/* Error title */}
      <Typography variant="h4" sx={{ mb: 4 }}>
        Page Not Found
      </Typography>
      
      {/* Error description */}
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 500 }}>
        The page you are looking for does not exist or has been moved.
      </Typography>
      
      {/* Navigation button to return to login */}
      <Button
        variant="contained"
        onClick={() => router.push('/login')}
        sx={{ fontWeight: 600 }}
      >
        Go to Login
      </Button>
    </Box>
  );
} 