import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken } from './src/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  const { pathname } = request.nextUrl;

  // Define public paths that do not require authentication
  const publicPaths = [
    '/', 
    '/login', 
    '/register', 
    '/forgot-password', 
    '/api/auth/register', 
    '/api/auth/login', 
    '/api/auth/verify-email', 
    '/api/test-db'
  ];

  // Allow access to public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Verify token for protected paths
  if (token) {
    const decoded = verifyAuthToken(token);
    if (decoded) {
      // Token is valid, continue to the requested page
      return NextResponse.next();
    } else {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // No token, redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
