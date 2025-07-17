'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  Paper,
  TextField,
  Link,
  useTheme,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import { 
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface PasswordResetModalProps {
  open: boolean;
  email: string;
  onClose: () => void;
}

export default function PasswordResetModal({
  open,
  email,
  onClose
}: PasswordResetModalProps) {
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  
  // Countdown timer
  useEffect(() => {
    if (!open) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [open]);
  
  const handleResendCode = async () => {
    setTimeLeft(60);
    setError(null);
    console.log('Resending reset code to:', email);
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
        console.log('Resend successful:', data.message);
        setSuccess('Reset code re-sent!');
      } else {
        console.error('Resend failed:', data.message);
        setError(data.message || 'Failed to re-send reset code.');
      }
    } catch (error) {
      console.error('Error during resend:', error);
      setError('An unexpected error occurred during resend. Please try again.');
    }
  };

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);
    
    // Move to next input if current one is filled
    if (value !== '' && index < 5) {
      setCurrentInputIndex(index + 1);
    }
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && verificationCode[index] === '' && index > 0) {
      setCurrentInputIndex(index - 1);
    }
  };
  
  const handleResetPassword = async () => {
    const code = verificationCode.join('');
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }
    
    console.log('Resetting password with code:', code);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Password reset successful:', data.message);
        setSuccess('Password reset successfully! Redirecting to dashboard...');
        
        // Store token and redirect to dashboard
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        console.error('Password reset failed:', data.message);
        setError(data.message || 'Password reset failed.');
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      setError('An unexpected error occurred during password reset. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Focus the current input field
  useEffect(() => {
    const inputElement = document.getElementById(`reset-input-${currentInputIndex}`);
    if (inputElement) {
      (inputElement as HTMLInputElement).focus();
    }
  }, [currentInputIndex]);
  
  const formatTimeLeft = () => {
    return `00:${timeLeft.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="password-reset-modal"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          m: 2,
          borderRadius: 2,
          outline: 'none',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
          </Box>
          
          <Typography variant="h5" fontWeight={600} mb={1}>
            Reset Your Password
          </Typography>
          
          <Typography variant="body2" color="text.secondary" mb={2}>
            Enter the 6-digit code sent to your email
          </Typography>
        </Box>

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
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
          {Array(6).fill(0).map((_, index) => (
            <TextField
              id={`reset-input-${index}`}
              key={index}
              value={verificationCode[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputProps={{
                maxLength: 1,
                style: { 
                  textAlign: 'center',
                  padding: '12px 0px',
                  width: '40px',
                  fontSize: '20px',
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
                width: '40px',
              }}
              autoComplete="one-time-code"
            />
          ))}
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{ 
              mb: 1, 
              fontWeight: 500, 
              color: theme.palette.text.primary 
            }}
          >
            New Password
          </Typography>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </Box>
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleResetPassword}
          disabled={
            isLoading || 
            verificationCode.some(digit => digit === '') ||
            !newPassword.trim() ||
            !confirmPassword.trim()
          }
          sx={{
            py: 1.5,
            fontWeight: 600,
            borderRadius: 2,
            mb: 2,
          }}
        >
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </Button>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Didn&apos;t receive the code? {
              timeLeft > 0 
                ? `Resend in ${formatTimeLeft()}`
                : (
                  <Link
                    component="button"
                    type="button"
                    onClick={handleResendCode}
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Resend
                  </Link>
                )
            }
          </Typography>
        </Box>
      </Paper>
    </Modal>
  );
} 