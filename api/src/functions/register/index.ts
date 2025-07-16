import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import connectDB from "../../shared/lib/mongodb";
import User from "../../shared/models/User";
import { hashPassword, generateAuthToken } from "../../shared/lib/auth";
import { Model, Types } from "mongoose";
import { IUser } from '../../shared/models/User';

export async function register(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    await connectDB();
    const { email, password, fullName } = await request.json() as { email: string; password: string; fullName: string };

    if (!email || !password || !fullName) {
      return { status: 400, jsonBody: { message: 'Missing required fields' } };
    }

    const existingUser = await (User as Model<IUser>).findOne({ email });
    if (existingUser) {
      return { status: 409, jsonBody: { message: 'User already exists' } };
    }

    const hashedPassword = await hashPassword(password);
    const user = await (User as Model<IUser>).create({
      email,
      password: hashedPassword,
      fullName,
      isEmailVerified: false,
    });

    context.log('User created in DB:', user);

    const token = generateAuthToken((user._id as Types.ObjectId).toString());
    return { status: 201, jsonBody: { message: 'User registered successfully', user: user.email, token } };
  } catch (error) {
    context.error('Registration error:', error);
    return { status: 500, jsonBody: { message: 'Internal server error' } };
  }
}

app.http('register', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/register',
  handler: register
});
