/**
 * Home Page Component
 * 
 * This is the root page of the EduAI application. It automatically redirects
 * users to the login page since authentication is required for all features.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * HomePage Component
 * 
 * A simple redirect component that automatically navigates users to the login page.
 * This ensures that users are always directed to the authentication flow first.
 */
export default function HomePage() {
  const router = useRouter();
  
  // Redirect to login page on component mount
  useEffect(() => {
    router.push('/login');
  }, [router]);
  
  // Return null since this page immediately redirects
  return null;
}
