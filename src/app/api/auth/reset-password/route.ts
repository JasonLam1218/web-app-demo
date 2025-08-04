/**
 * Password Reset API Endpoint
 * 
 * This endpoint handles sending a 6-digit reset code to a user's email and
 * verifying the code to allow password reset. Used when a user forgets their
 * password. Does NOT verify email ownership.
 * 
 * POST: Send reset code to email
 * PATCH: Verify code and update password in DB, then log in user
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, generateAuthToken } from '@/lib/auth';
import { Resend } from 'resend';

// Initialize Resend email service with API key
const resend = new Resend(process.env.RESEND_API_KEY);
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'EduAI';

/**
 * POST handler for sending password reset code
 * 
 * Generates a 6-digit reset code, stores it in the database with expiration,
 * and sends it to the user's email address.
 * 
 * @param request - Next.js request object containing email
 * @returns NextResponse with success/error message
 */
export async function POST(request: NextRequest) {
  // Establish database connection
  await connectDB();

  try {
    // Extract email from request body
    const { email } = await request.json();

    // Validate email is provided
    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Set expiration time to 10 minutes from now
    const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Store reset code and expiration in user document
    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = resetCodeExpires;
    await user.save();

    // Send password reset email using Resend service
    const { error } = await resend.emails.send({
      from: `${APP_NAME} <onboarding@resend.dev>`,
      to: [email],
      subject: 'Reset your password',
      html: `
        <h1>Password Reset</h1>
        <p>Hello ${user.fullName},</p>
        <p>Please use the following code to reset your password:</p>
        <h2><strong>${resetCode}</strong></h2>
        <p>This code is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thank you,</p>
        <p>${APP_NAME} Team</p>
      `,
    });

    // Handle email sending errors
    if (error) {
      console.error('Error sending reset email:', error);
      return NextResponse.json({ message: 'Failed to send reset email' }, { status: 500 });
    }

    // Return success response
    return NextResponse.json({ message: 'Reset code sent successfully' }, { status: 200 });
  } catch (error: unknown) {
    // Log error for debugging
    console.error('Reset password POST error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH handler for resetting password
 * 
 * Validates the provided reset code and updates the user's password if valid.
 * Returns an authentication token for immediate login.
 * 
 * @param request - Next.js request object containing email, code, and new password
 * @returns NextResponse with success/error message and authentication token
 */
export async function PATCH(request: NextRequest) {
  // Establish database connection
  await connectDB();

  try {
    // Extract reset data from request body
    const { email, code, newPassword } = await request.json();

    // Validate required fields
    if (!email || !code || !newPassword) {
      return NextResponse.json({ message: 'Email, code, and new password are required' }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Verify the provided reset code matches the stored code
    if (user.resetPasswordToken !== code) {
      return NextResponse.json({ message: 'Invalid reset code' }, { status: 400 });
    }

    // Check if reset code has expired
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      return NextResponse.json({ message: 'Reset code has expired' }, { status: 400 });
    }

    // Hash the new password before storing
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password and clear reset tokens
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Generate authentication token for immediate login
    const token = generateAuthToken(user._id);

    // Return success response with token
    return NextResponse.json({ 
      message: 'Password reset successfully', 
      token,
      user: user.email 
    }, { status: 200 });
  } catch (error: unknown) {
    // Log error for debugging
    console.error('Reset password PATCH error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 