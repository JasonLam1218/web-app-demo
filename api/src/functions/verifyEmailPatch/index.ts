import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import connectDB from "../../shared/lib/mongodb";
import User from "../../shared/models/User";
import { Model } from "mongoose"; // Import Model
import { IUser } from '../../shared/models/User'; // Assuming IUser is defined

export async function verifyEmailPatch(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    await connectDB();
    const { email, code } = await request.json() as { email: string; code: string };

    if (!email || !code) {
      return { status: 400, jsonBody: { message: 'Email and verification code are required' } };
    }

    const user = await (User as Model<IUser>).findOne({ email });
    if (!user) {
      return { status: 404, jsonBody: { message: 'User not found' } };
    }

    if (user.verificationCode !== code) {
      return { status: 400, jsonBody: { message: 'Invalid verification code' } };
    }

    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
      return { status: 400, jsonBody: { message: 'Verification code has expired' } };
    }

    user.isEmailVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return { status: 200, jsonBody: { message: 'Email verified successfully' } };
  } catch (error: unknown) {
    context.error('Verify email PATCH error:', error);
    if (error instanceof Error && error.message.includes('MongoDB URI is not available')) {
      return { status: 503, jsonBody: { message: 'Database configuration error' } };
    }
    return { status: 500, jsonBody: { message: 'Internal server error' } };
  }
}

app.http('verifyEmailPatch', {
  methods: ['PATCH'],
  authLevel: 'anonymous',
  route: 'auth/verify-email',
  handler: verifyEmailPatch
});
