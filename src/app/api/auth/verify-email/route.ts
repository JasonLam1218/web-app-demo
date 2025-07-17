import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'EduAI';

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

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

    if (error) {
      console.error('Error sending verification email:', error);
      return NextResponse.json({ message: 'Failed to send verification email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Verification code sent successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Verify email POST error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  await connectDB();

  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ message: 'Email and verification code are required' }, { status: 400 });
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

    user.isEmailVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Verify email PATCH error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 