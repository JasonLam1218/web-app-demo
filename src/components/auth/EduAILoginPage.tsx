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
  Checkbox,
  FormControlLabel,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function EduAILoginPage() {
  const theme = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    agreeToTerms: false,
  });

  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'agreeToTerms' ? event.target.checked : event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (isLogin) {
      console.log('Login submitted:', formData);
      try {
        const response = await fetch(`/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Login successful:', data);
          setSuccess("Login successful!");
          setError(null);
          // Store token (e.g., in localStorage or http-only cookie)
          // For simplicity, we'll redirect directly for now.
          setTimeout(() => {
            router.push('/dashboard');
          }, 500); // 0.5 second delay
        } else {
          console.error('Login failed:', data.message);
          setError(data.message || 'Login failed.');
          setSuccess(null);
        }
      } catch (error) {
        console.error('Error during login:', error);
        setError('An unexpected error occurred. Please try again.');
        setSuccess(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Sign up submitted:', formData);
      // Add your sign up logic here
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
          }),
        });
        console.log('Registration response:', response);
        const data = await response.json();

        if (response.ok) {
          console.log('Registration successful:', data);
          // Optionally, redirect to a verification page or login page
          setError(null);
          setSuccess("Registration successful!");
          router.push('/login'); // Redirect to login after successful signup
        } else {
          console.error('Registration failed:', data.message);
          // Show error message to the user
          setError(data.message || 'Registration failed.');
          setSuccess(null);
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleAuth = () => {
    console.log(`Google ${isLogin ? 'Sign In' : 'Sign Up'} clicked`);
    // Add Google Auth logic here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const switchMode = () => {
    setIsLogin(prev => !prev);
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
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
            flexDirection: 'column',
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
              {isLogin ? 'Unlock Your Learning Potential' : 'Transform Your Learning Journey with AI'}
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
              {isLogin 
                ? 'The Future of Assessment is Here' 
                : 'Join thousands of students embracing the future of education'}
            </Typography>
          </Box>
        </Grid>

        {/* Right Panel - Login/Signup Form */}
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
                {isLogin ? 'Welcome Back' : 'Create Your Account'}
              </Typography>
              {!isLogin && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                  }}
                >
                  Start your learning journey today
                </Typography>
              )}

              {error && (
                  <Alert severity="error" sx={{ mb: 1, mt: 2}}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ mb: 1, mt: 2 }}>
                    {success}
                  </Alert>
                )}
            </Box>

            {/* Google Sign In/Up Button */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleAuth}
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
              {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
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

            {/* Login/Signup Form */}
            <Box component="form" onSubmit={handleSubmit}>
              {/* Full Name - Only for Sign Up */}
              {!isLogin && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ 
                      mb: 1, 
                      fontWeight: 500, 
                      color: theme.palette.text.primary 
                    }}
                  >
                    Full Name
                  </Typography>
                  <TextField
                    fullWidth
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange('fullName')}
                    disabled={isLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: theme.palette.text.secondary }} />
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
              )}

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
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  disabled={isLoading}
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

              <Box sx={{ mb: isLogin ? 3 : 2 }}>
                <Typography
                  variant="body2"
                  sx={{ 
                    mb: 1, 
                    fontWeight: 500, 
                    color: theme.palette.text.primary 
                  }}
                >
                  {isLogin ? 'Password' : 'Create Password'}
                </Typography>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isLogin ? 'Enter your password' : 'Enter your password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  disabled={isLoading}
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
                 {!isLogin && (
                   <Typography
                     variant="caption"
                     sx={{
                       display: 'block',
                       mt: 1,
                       color: theme.palette.text.secondary,
                     }}
                   >
                     Must be at least 8 characters
                   </Typography>
                 )}
               </Box>
 
               {/* Terms and Conditions - Only for Sign Up */}
               {!isLogin && (
                 <Box sx={{ mb: 3 }}>
                   <FormControlLabel
                     control={
                       <Checkbox 
                         checked={formData.agreeToTerms}
                         onChange={handleInputChange('agreeToTerms')}
                         size="small"
                       />
                     }
                     label={
                       <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                         I agree to the {' '}
                         <Link 
                           href="#" 
                           sx={{ 
                             color: theme.palette.primary.main,
                             textDecoration: 'none',
                             '&:hover': { textDecoration: 'underline' }
                           }}
                         >
                           Terms of Service
                         </Link>
                         {' '} and {' '}
                         <Link 
                           href="#" 
                           sx={{ 
                             color: theme.palette.primary.main,
                             textDecoration: 'none',
                             '&:hover': { textDecoration: 'underline' }
                           }}
                         >
                           Privacy Policy
                         </Link>
                       </Typography>
                     }
                   />
                 </Box>
               )}
 
               <Button
                 type="submit"
                 fullWidth
                 variant="contained"
                 // disable button if loading or not agree to terms
                 disabled={
                  isLoading || 
                  !formData.email.trim() || 
                  !formData.password.trim() ||
                  (!isLogin && !formData.agreeToTerms) ||
                  (!isLogin && !formData.fullName.trim())
                }
                 sx={{
                   mb: 2,
                   py: 1.5,
                   fontSize: '1rem',
                   fontWeight: 600,
                   borderRadius: 2,
                 }}
               >
                 {/* {isLogin ? 'Log In' : 'Create Account'} */}
                 {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </Box>
                  ) : (
                    isLogin ? 'Log In' : 'Create Account'
                  )}
               </Button>
 
               {/* Forgot Password - Only for Login */}
               {isLogin && (
                 <Box sx={{ textAlign: 'center', mb: 3 }}>
                   <Link
                     href="#"
                     onClick={handleForgotPassword}
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
               )}
 
               <Box sx={{ textAlign: 'center' }}>
                 <Typography 
                   variant="body2" 
                   sx={{ 
                     color: theme.palette.text.secondary 
                   }}
                 >
                   {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                   <Link
                     href="#"
                     onClick={(e) => {
                       e.preventDefault();
                       switchMode();
                     }}
                     sx={{
                       color: theme.palette.primary.main,
                       textDecoration: 'none',
                       fontWeight: 500,
                       '&:hover': {
                         textDecoration: 'underline',
                       },
                     }}
                   >
                     {isLogin ? 'Sign Up' : 'Log In'}
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