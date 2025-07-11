'use client';
import { Box, Typography, Button } from '@mui/material';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h2" sx={{ mb: 2, fontWeight: 700 }}>
        Something went wrong!
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 500 }}>
        An error occurred while trying to process your request.
      </Typography>
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