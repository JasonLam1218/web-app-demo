'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  InputAdornment,
  Link,
  useTheme,
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
// import theme from '@/lib/theme';
// Reimport with explicit path
import EmailVerificationModal from '@/components/auth/EmailVerificationModal';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const theme = useTheme();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Forgot password submitted for:', email);
    // Show verification modal instead of navigation
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Verification code request successful:', data.message);
        alert('Verification code sent to your email.');
        setShowVerificationModal(true);
      } else {
        console.error('Verification code request failed:', data.message);
        alert(data.message || 'Failed to send verification code.');
      }
    } catch (error) {
      console.error('Error during verification code request:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleBackToSignIn = () => {
    router.push('/login');
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex',
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.2) 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 4
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: theme.palette.primary.main,
              ...theme.typography.h1,
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 1,
              fontWeight: 700,
            }}
          >
            EduAI
          </Typography>
        </Box>
        
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 2,
              color: theme.palette.text.primary,
              fontWeight: 700,
              textAlign: 'center'
            }}
          >
            Forgot Your Password
          </Typography>
          
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{
              mt: 3
            }}
          >
            <Typography
              variant="body2"
              sx={{ 
                mb: 1, 
                fontWeight: 500, 
                color: theme.palette.text.primary 
              }}
            >
              Email Address
            </Typography>
            <TextField
              fullWidth
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
              required
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                mt: 2,
                mb: 3
              }}
            >
              Send Verification Code
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                type="button"
                onClick={handleBackToSignIn}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Back to Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Email Verification Modal */}
      <EmailVerificationModal 
        open={showVerificationModal} 
        email={email}
        onClose={() => setShowVerificationModal(false)}
      />
    </Box>
  );
} 