/**
 * Registration API Endpoint
 * 
 * This endpoint handles new user registration by creating a user account
 * with email, password, and full name. Passwords are hashed before storage
 * and a JWT token is returned for immediate login.
 * 
 * POST /api/auth/register
 * Body: { email: string, password: string, fullName: string }
 * Response: { message: string, user: string, token: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, generateAuthToken } from '@/lib/auth';

/**
 * POST handler for user registration
 * 
 * Creates a new user account with hashed password and returns an authentication token.
 * 
 * @param request - Next.js request object containing registration data
 * @returns NextResponse with success/error message and token
 */
export async function POST(request: NextRequest) {
  // Establish database connection
  await connectDB();

  try {
    // Extract registration data from request body
    const { email, password, fullName } = await request.json();

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists with the provided email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Hash the password before storing in database
    const hashedPassword = await hashPassword(password);

    // Create new user with hashed password and email verification status
    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      isEmailVerified: false, // Email verification required after registration
    });

    // Log successful user creation for debugging
    console.log('User created in DB:', user);

    // Generate JWT token for immediate login after registration
    const token = generateAuthToken(user._id);

    // Return success response with token and user email
    return NextResponse.json({ 
      message: 'User registered successfully', 
      user: user.email, 
      token 
    }, { status: 201 });
  } catch (error) {
    // Log error for debugging
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 