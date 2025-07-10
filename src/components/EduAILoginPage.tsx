'use client';
import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import theme from './theme'; // Import the theme

export default function EduAILoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Login submitted:', formData);
    // Add your login logic here
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign In clicked');
    // Add Google Sign In logic here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        {/* Left Panel - Branding */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          component="div"
          sx={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.2) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
          }}
        >
          <Box sx={{ textAlign: 'center', maxWidth: 400, color: theme.palette.primary.dark }}>
            <Typography
              variant="h1"
              sx={{
                color: theme.palette.primary.main,
                ...theme.typography.h1,
                fontSize: { xs: '2.5rem', md: '3rem' },
                mb: 3,
                fontWeight: 700,
              }}
            >
              EduAI
            </Typography>
            
            <Typography
              variant="h4"
              sx={{
                color: theme.palette.primary.main,
                ...theme.typography.h4,
                fontSize: { xs: '1.5rem', md: '2rem' },
                mb: 2,
                lineHeight: 1.2,
                fontWeight: 600,
              }}
            >
              Unlock Your Learning Potential
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.primary.main,
                ...theme.typography.body1,
                fontSize: '1rem',
                fontWeight: 400,
              }}
            >
              The Future of Assessment is Here
            </Typography>
          </Box>
        </Grid>

        {/* Right Panel - Login Form */}
        <Grid 
          item 
          xs={12} 
          md={6}
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            bgcolor: theme.palette.background.default,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              maxWidth: 400,
              width: '100%',
              bgcolor: 'transparent',
              borderRadius: 2,
            }}
          >
            <Box sx={{ textAlign: 'left', mb: 4 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 2,
                  color: theme.palette.text.primary,
                  fontWeight: 700,
                }}
              >
                Welcome Back
              </Typography>
            </Box>

            {/* Google Sign In Button */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
              sx={{
                mb: 3,
                py: 1.5,
                border: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.primary,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                  border: `1px solid ${theme.palette.text.secondary}`,
                },
              }}
            >
              Sign in with Google
            </Button>

            {/* Divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography
                variant="body2"
                sx={{ 
                  mx: 2, 
                  color: theme.palette.text.secondary 
                }}
              >
                OR
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ mb: 2 }}>
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
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: theme.palette.text.secondary }} />
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
                  Password
                </Typography>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: theme.palette.text.secondary }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
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
                 type="submit"
                 fullWidth
                 variant="contained"
                 sx={{
                   mb: 2,
                   py: 1.5,
                   fontSize: '1rem',
                   fontWeight: 600,
                   borderRadius: 2,
                 }}
               >
                 Log In
               </Button>
 
               <Box sx={{ textAlign: 'center', mb: 3 }}>
                 <Link
                   href="#"
                   sx={{
                     color: theme.palette.primary.main,
                     textDecoration: 'none',
                     fontSize: '0.9rem',
                     '&:hover': {
                       textDecoration: 'underline',
                     },
                   }}
                 >
                   Forgot Password?
                 </Link>
               </Box>
 
               <Box sx={{ textAlign: 'center' }}>
                 <Typography 
                   variant="body2" 
                   sx={{ 
                     color: theme.palette.text.secondary 
                   }}
                 >
                  Don&apos;t have an account?{' '}
                   <Link
                     href="#"
                     sx={{
                       color: theme.palette.primary.main,
                       textDecoration: 'none',
                       fontWeight: 500,
                       '&:hover': {
                         textDecoration: 'underline',
                       },
                     }}
                   >
                     Sign Up
                   </Link>
                 </Typography>
               </Box>
             </Box>
           </Paper>
         </Grid>
       </Grid>
     </Box>
   );
 }
