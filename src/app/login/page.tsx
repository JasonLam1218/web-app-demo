/**
 * Login Page Component
 * 
 * This is the login page route component that renders the EduAILoginPage component.
 * It serves as a simple wrapper to provide the login functionality at the /login route.
 */

import EduAILoginPage from '@/components/auth/EduAILoginPage';

/**
 * LoginPage Component
 * 
 * Renders the main login component that handles both login and registration
 * functionality. This component is displayed when users navigate to /login.
 */
export default function LoginPage() {
  return <EduAILoginPage />;
} 