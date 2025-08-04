/**
 * Forgot Password Page Component
 * 
 * This is the forgot password page route component that renders the ForgotPasswordPage component.
 * It serves as a simple wrapper to provide the password reset functionality at the /forgot-password route.
 */

import ForgotPasswordPage from '@/components/auth/ForgotPasswordPage';

/**
 * ForgotPasswordRoute Component
 * 
 * Renders the forgot password component that handles the password reset flow.
 * This component is displayed when users navigate to /forgot-password.
 */
export default function ForgotPasswordRoute() {
  return <ForgotPasswordPage />;
} 