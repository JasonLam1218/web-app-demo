import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Resend } from 'resend';
import connectDB from "../../shared/lib/mongodb";
import User from "../../shared/models/User";
import { Model } from "mongoose";
import { IUser } from '../../shared/models/User';

// Handle missing API key
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APP_NAME = process.env.APP_NAME || 'EduTech';
let resend: Resend | null = null;
if (RESEND_API_KEY) {
  resend = new Resend(RESEND_API_KEY);
} else if (process.env.NODE_ENV === 'production') {
  console.warn('RESEND_API_KEY not found');
}

export async function verifyEmailPost(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    await connectDB();
    if (!resend) {
      return { status: 503, jsonBody: { message: 'Email service not configured' } };
    }

    const { email } = await request.json() as { email: string };
    if (!email) {
      return { status: 400, jsonBody: { message: 'Email is required' } };
    }

    const user = await (User as Model<IUser>).findOne({ email });
    if (!user) {
      return { status: 404, jsonBody: { message: 'User not found' } };
    }

    if (user.isEmailVerified) {
      return { status: 400, jsonBody: { message: 'Email is already verified' } };
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    const { error } = await resend.emails.send({
      from: `${APP_NAME} <onboarding@resend.dev>`,
      to: email,
      subject: 'Verify your email address',
      html: `
        <h1>Email Verification</h1>
        <p>Hello ${user.fullName},</p>
        <p>Please use the following code to verify your email address:</p>
        <h2>${verificationCode}</h2>
        <p>This code is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thank you, ${APP_NAME} Team</p>
      `,
    });

    if (error) {
      context.error('Error sending verification email:', error);
      return { status: 500, jsonBody: { message: 'Failed to send verification email' } };
    }

    return { status: 200, jsonBody: { message: 'Verification code sent successfully' } };
  } catch (error: unknown) {
    context.error('Verify email POST error:', error);
    if (error instanceof Error && error.message.includes('MongoDB URI is not available')) {
      return { status: 503, jsonBody: { message: 'Database configuration error' } };
    }
    return { status: 500, jsonBody: { message: 'Internal server error' } };
  }
}

app.http('verifyEmailPost', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/verify-email',
  handler: verifyEmailPost
});
