/**
 * Login API Endpoint
 * 
 * This endpoint handles user authentication by validating email and password
 * credentials against the database. Upon successful authentication, it returns
 * a JWT token for subsequent API requests.
 * 
 * POST /api/auth/login
 * Body: { email: string, password: string }
 * Response: { message: string, token: string, user: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, generateAuthToken } from '@/lib/auth';

/**
 * POST handler for user login
 * 
 * Validates user credentials and returns an authentication token upon success.
 * 
 * @param request - Next.js request object containing login credentials
 * @returns NextResponse with success/error message and token
 */
export async function POST(request: NextRequest) {
  // Establish database connection
  await connectDB();

  try {
    // Extract email and password from request body
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
    }

    // Find user by email and explicitly select password field (normally excluded)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Compare provided password with hashed password in database
    const isMatch = await comparePassword(password, user.password as string);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token for authenticated user
    const token = generateAuthToken(user._id);

    // Return success response with token and user email
    return NextResponse.json({ 
      message: 'Logged in successfully', 
      token, 
      user: user.email 
    }, { status: 200 });
  } catch (error) {
    // Log error for debugging
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 