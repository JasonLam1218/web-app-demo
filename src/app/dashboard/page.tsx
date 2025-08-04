/**
 * Dashboard Page Component
 * 
 * This is the main dashboard page that users see after successful authentication.
 * Currently displays a simple welcome message and logout functionality.
 * This page is protected by authentication middleware.
 */

'use client';

import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

/**
 * DashboardPage Component
 * 
 * Displays the main dashboard interface for authenticated users.
 * Currently shows a simple welcome message and logout button.
 * In a full application, this would contain the main user interface.
 */
export default function DashboardPage() {
  const router = useRouter();

  /**
   * Handle user logout
   * 
   * Clears authentication state and redirects user to login page.
   * In a production application, this would also invalidate the JWT token.
   */
  const handleLogout = () => {
    // In a real application, you would clear the authentication token here
    // (e.g., from localStorage or cookies)
    console.log('User logged out');
    router.push('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh', // Full viewport height
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4, // Padding for mobile devices
        textAlign: 'center',
      }}
    >
      {/* Welcome heading */}
      <Typography variant="h3" component="h1" gutterBottom>
        Hello, World!
      </Typography>
      
      {/* Welcome message */}
      <Typography variant="body1" mb={3}>
        Welcome to your dashboard. This is a simple landing page.
      </Typography>
      
      {/* Logout button */}
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
} 