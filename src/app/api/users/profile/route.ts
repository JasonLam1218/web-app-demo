/**
 * User Profile API Endpoint
 * 
 * This endpoint handles user profile operations including retrieving and updating
 * user profile information. Requires authentication via JWT token.
 * 
 * GET: Retrieve user profile information
 * PATCH: Update user profile information
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getUserIdFromToken } from '@/lib/auth';
import { UserType } from '@/types/user';

/**
 * GET handler for retrieving user profile
 * 
 * Extracts user ID from JWT token and returns the user's profile information
 * excluding sensitive data like password.
 * 
 * @param request - Next.js request object containing authentication token
 * @returns NextResponse with user profile data
 */
export async function GET(request: NextRequest) {
  // Establish database connection
  await connectDB();

  try {
    // Extract user ID from JWT token in request headers
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Find user by ID and exclude password field from response
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return user profile data
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    // Log error for debugging
    console.error('Get user profile error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH handler for updating user profile
 * 
 * Allows authenticated users to update specific profile fields like full name.
 * Validates input and only allows updates to permitted fields.
 * 
 * @param request - Next.js request object containing update data and authentication token
 * @returns NextResponse with updated user profile data
 */
export async function PATCH(request: NextRequest) {
  // Establish database connection
  await connectDB();

  try {
    // Extract user ID from JWT token in request headers
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Extract update data from request body
    const updates = await request.json();

    // Define which fields are allowed to be updated for security
    const allowedUpdates = ['fullName'];
    const actualUpdates: Partial<UserType> = {}; // Use Partial<UserType> for better typing
    
    // Filter updates to only include allowed fields
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        actualUpdates[key as keyof UserType] = updates[key]; // Cast key to keyof UserType
      }
    }

    // Validate that at least one valid field is being updated
    if (Object.keys(actualUpdates).length === 0) {
      return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 });
    }

    // Update user document with new data and return updated document
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: actualUpdates },
      { new: true, runValidators: true } // Return updated document and run validation
    ).select('-password'); // Exclude password from response

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return success response with updated user data
    return NextResponse.json({ message: 'Profile updated successfully', user }, { status: 200 });
  } catch (error) {
    // Log error for debugging
    console.error('Update user profile error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 