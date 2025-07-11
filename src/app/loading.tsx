import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading() {
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
      <CircularProgress size={60} sx={{ mb: 4, color: 'primary.main' }} />
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Loading...
      </Typography>
      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        Please wait while we prepare your content
      </Typography>
    </Box>
  );
} 