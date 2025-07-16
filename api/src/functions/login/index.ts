import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import connectDB from "../../shared/lib/mongodb"; // Adjust path if needed
import User from "../../shared/models/User";
import { comparePassword, generateAuthToken } from "../../shared/lib/auth";
import { HydratedDocument, Model } from "mongoose";
import { IUser } from '../../shared/models/User';

export async function login(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  await connectDB();

  try {
    const { email, password } = await request.json() as { email: string; password: string };

    if (!email || !password) {
      return { status: 400, jsonBody: { message: 'Missing email or password' } };
    }

    const user: HydratedDocument<IUser> | null = await (User as Model<IUser>).findOne({ email }, { password: 1 });
    if (!user) {
      return { status: 401, jsonBody: { message: 'Invalid credentials' } };
    }

    const isMatch = await comparePassword(password, user.password as string);
    if (!isMatch) {
      return { status: 401, jsonBody: { message: 'Invalid credentials' } };
    }

    const token = generateAuthToken(user._id as string);
    return { status: 200, jsonBody: { message: 'Logged in successfully', token, user: user.email } };
  } catch (error) {
    context.error('Login error:', error);
    return { status: 500, jsonBody: { message: 'Internal server error' } };
  }
}

app.http('login', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/login', // Maps to /api/auth/login
  handler: login
});
