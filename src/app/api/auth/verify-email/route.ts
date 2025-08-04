/**
 * Email Verification API Endpoint
 * 
 * This endpoint handles sending a 6-digit verification code to a user's email
 * and verifying the code to confirm email ownership. Used after registration
 * or when changing email. Does NOT reset password.
 * 
 * POST: Send verification code to email
 * PATCH: Verify code and set isEmailVerified to true
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { Resend } from 'resend';

// Initialize Resend email service with API key
const resend = new Resend(process.env.RESEND_API_KEY);
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'EduAI';

/**
 * POST handler for sending verification code
 * 
 * Generates a 6-digit verification code, stores it in the database with expiration,
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

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Set expiration time to 10 minutes from now
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Store verification code and expiration in user document
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // Send verification email using Resend service
    const { error } = await resend.emails.send({
      from: `${APP_NAME} <onboarding@resend.dev>`,
      to: [email],
      subject: 'Verify your email address',
      html: `
        <h1>Email Verification</h1>
        <p>Hello ${user.fullName},</p>
        <p>Please use the following code to verify your email address:</p>
        <h2><strong>${verificationCode}</strong></h2>
        <p>This code is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thank you,</p>
        <p>${APP_NAME} Team</p>
      `,
    });

    // Handle email sending errors
    if (error) {
      console.error('Error sending verification email:', error);
      return NextResponse.json({ message: 'Failed to send verification email' }, { status: 500 });
    }

    // Return success response
    return NextResponse.json({ message: 'Verification code sent successfully' }, { status: 200 });
  } catch (error: unknown) {
    // Log error for debugging
    console.error('Verify email POST error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH handler for verifying email code
 * 
 * Validates the provided verification code against the stored code and
 * marks the user's email as verified if successful.
 * 
 * @param request - Next.js request object containing email and code
 * @returns NextResponse with success/error message
 */
export async function PATCH(request: NextRequest) {
  // Establish database connection
  await connectDB();

  try {
    // Extract email and verification code from request body
    const { email, code } = await request.json();

    // Validate required fields
    if (!email || !code) {
      return NextResponse.json({ message: 'Email and verification code are required' }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Verify the provided code matches the stored code
    if (user.verificationCode !== code) {
      return NextResponse.json({ message: 'Invalid verification code' }, { status: 400 });
    }

    // Check if verification code has expired
    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
      return NextResponse.json({ message: 'Verification code has expired' }, { status: 400 });
    }

    // Mark email as verified and clear verification data
    user.isEmailVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    // Return success response
    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
  } catch (error: unknown) {
    // Log error for debugging
    console.error('Verify email PATCH error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 