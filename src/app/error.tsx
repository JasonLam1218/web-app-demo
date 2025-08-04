/**
 * Error Boundary Component
 * 
 * This component handles errors that occur within the EduAI application.
 * It provides a user-friendly error message and allows users to retry
 * the operation that failed.
 */

'use client';
import { Box, Typography, Button } from '@mui/material';
import { useEffect } from 'react';

/**
 * Error Component
 * 
 * Displays an error message when an error occurs in the application.
 * Provides a retry button to allow users to attempt the operation again.
 * 
 * @param error - The error object that occurred
 * @param reset - Function to reset the error state and retry
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the error to console for debugging purposes
  useEffect(() => {
    // In a production environment, this would send the error to an error reporting service
    console.error(error);
  }, [error]);

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
      {/* Error heading */}
      <Typography variant="h2" sx={{ mb: 2, fontWeight: 700 }}>
        Something went wrong!
      </Typography>
      
      {/* Error description */}
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 500 }}>
        An error occurred while trying to process your request.
      </Typography>
      
      {/* Retry button */}
      <Button
        variant="contained"
        onClick={() => reset()}
        sx={{ fontWeight: 600 }}
      >
        Try again
      </Button>
    </Box>
  );
} 