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
  Alert,
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import PasswordResetModal from '@/components/auth/PasswordResetModal';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    console.log('Forgot password submitted for:', email);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Reset code request successful:', data.message);
        setSuccess('Reset code sent to your email.');
        setShowResetModal(true);
      } else {
        console.error('Reset code request failed:', data.message);
        setError(data.message || 'Failed to send reset code.');
      }
    } catch (error) {
      console.error('Error during reset code request:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          
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
              disabled={isLoading || !email.trim()}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                mt: 2,
                mb: 3
              }}
            >
              {isLoading ? 'Sending Reset Code...' : 'Send Reset Code'}
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

      {/* Password Reset Modal */}
      <PasswordResetModal 
        open={showResetModal} 
        email={email}
        onClose={() => setShowResetModal(false)}
      />
    </Box>
  );
} 