import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, generateAuthToken } from '@/lib/auth';
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

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = resetCodeExpires;
    await user.save();

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

    if (error) {
      console.error('Error sending reset email:', error);
      return NextResponse.json({ message: 'Failed to send reset email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Reset code sent successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Reset password POST error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  await connectDB();

  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ message: 'Email, code, and new password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.resetPasswordToken !== code) {
      return NextResponse.json({ message: 'Invalid reset code' }, { status: 400 });
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      return NextResponse.json({ message: 'Reset code has expired' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password and clear reset tokens
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Generate auth token for immediate login
    const token = generateAuthToken(user._id);

    return NextResponse.json({ 
      message: 'Password reset successfully', 
      token,
      user: user.email 
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Reset password PATCH error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 