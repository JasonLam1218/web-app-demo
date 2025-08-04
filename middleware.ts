/**
 * Next.js Middleware
 * 
 * This middleware handles authentication and route protection for the EduAI application.
 * It intercepts all requests and verifies JWT tokens for protected routes.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken } from './src/lib/auth';

export async function middleware(request: NextRequest) {
  // Extract authentication token from cookies or Authorization header
  const token = request.cookies.get('auth_token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  const { pathname } = request.nextUrl;

  // Define public paths that do not require authentication
  // These routes are accessible without a valid token
  const publicPaths = [
    '/', // Home page (redirects to login)
    '/login', // Login page
    '/register', // Registration page (handled by login component)
    '/forgot-password', // Password reset page
    '/api/auth/register', // Registration API endpoint
    '/api/auth/login', // Login API endpoint
    '/api/auth/verify-email', // Email verification API endpoint
    '/api/test-db' // Database connection test endpoint
  ];

  // Allow access to public paths without authentication
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Verify token for protected paths
  if (token) {
    try {
      // Verify the JWT token using the auth utility
      const decoded = verifyAuthToken(token);
      if (decoded) {
        // Token is valid, continue to the requested page
        return NextResponse.next();
      } else {
        // Invalid token, redirect to login page
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      // Error verifying token (e.g., malformed token), redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // No token provided, redirect to login page
  return NextResponse.redirect(new URL('/login', request.url));
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     * - API routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
