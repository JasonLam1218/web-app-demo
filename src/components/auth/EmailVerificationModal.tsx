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
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
// import theme from '@/lib/theme';

interface EmailVerificationModalProps {
  open: boolean;
  email: string;
  onClose: () => void;
}

export default function EmailVerificationModal({
  open,
  email,
  onClose
}: EmailVerificationModalProps) {
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(''));
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const theme = useTheme();
  
  // Countdown timer
  useEffect(() => {
    if (!open) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [open]);
  
  const handleResendCode = () => {
    setTimeLeft(60);
    console.log('Resending verification code to:', email);
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
  
  const handleVerifyEmail = () => {
    const code = verificationCode.join('');
    console.log('Verifying email with code:', code);
    // Add verification logic here
    onClose();
  };
  
  // Focus the current input field
  useEffect(() => {
    const inputElement = document.getElementById(`verification-input-${currentInputIndex}`);
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
      aria-labelledby="email-verification-modal"
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
          maxWidth: 400,
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
              <EmailIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
          </Box>
          
          <Typography variant="h5" fontWeight={600} mb={1}>
            Check Your Email
          </Typography>
          
          <Typography variant="body2" color="text.secondary" mb={2}>
            We&apos;ve sent a 6-digit verification code to
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
          {Array(6).fill(0).map((_, index) => (
            <TextField
              id={`verification-input-${index}`}
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
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleVerifyEmail}
          disabled={verificationCode.some(digit => digit === '')}
          sx={{
            py: 1.5,
            fontWeight: 600,
            borderRadius: 2,
            mb: 2,
          }}
        >
          Verify Email
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