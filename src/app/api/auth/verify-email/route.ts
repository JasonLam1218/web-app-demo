import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Handle missing API key gracefully during build time
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APP_NAME = process.env.APP_NAME || 'EduTech';

let resend: Resend | null = null;

// Only initialize Resend if API key is available
if (RESEND_API_KEY) {
  resend = new Resend(RESEND_API_KEY);
} else if (process.env.NODE_ENV === 'production') {
  console.warn('RESEND_API_KEY not found during build - email verification may not work at runtime');
}

export async function POST(request: NextRequest) {
  try {
    // Only connect to database at runtime, not during build
    await connectDB();

    // Check if Resend is properly initialized
    if (!resend) {
      return NextResponse.json({ 
        message: 'Email service not configured' 
      }, { status: 503 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ message: 'Email is already verified' }, { status: 400 });
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Update user with verification code
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // Send verification email using resend
    const { error } = await resend.emails.send({
      from: `${APP_NAME} <noreply@yourdomain.com>`,
      to: email,
      subject: 'Verify your email address',
      html: `
        <h2>Email Verification</h2>
        <p>Hello ${user.fullName},</p>
        <p>Please use the following code to verify your email address:</p>
        <h3 style="color: #007bff; font-size: 24px;">${verificationCode}</h3>
        <p>This code is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thank you,<br>${APP_NAME} Team</p>
      `,
    });

    if (error) {
      console.error('Error sending verification email:', error);
      return NextResponse.json({ 
        message: 'Failed to send verification email' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Verification code sent successfully' 
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Verify email POST error:', error);
    
    // Handle database connection errors gracefully
    if (error instanceof Error && error.message.includes('MongoDB URI is not available')) {
      return NextResponse.json({ message: 'Database configuration error' }, { status: 503 });
    }
    
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Only connect to database at runtime, not during build
    await connectDB();

    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ 
        message: 'Email and verification code are required' 
      }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.verificationCode !== code) {
      return NextResponse.json({ message: 'Invalid verification code' }, { status: 400 });
    }

    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
      return NextResponse.json({ message: 'Verification code has expired' }, { status: 400 });
    }

    // Update user verification status
    user.isEmailVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return NextResponse.json({ 
      message: 'Email verified successfully' 
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Verify email PATCH error:', error);
    
    // Handle database connection errors gracefully
    if (error instanceof Error && error.message.includes('MongoDB URI is not available')) {
      return NextResponse.json({ message: 'Database configuration error' }, { status: 503 });
    }
    
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
