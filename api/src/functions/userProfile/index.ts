import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import connectDB from "../../shared/lib/mongodb";
import User from "../../shared/models/User";
import { getUserIdFromToken } from "../../shared/lib/auth";
import { UserType } from "../../shared/types/user";
import { Model } from "mongoose"; // Import Model
import { IUser } from '../../shared/models/User'; // Assuming IUser is defined

export async function userProfile(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  await connectDB();

  if (request.method === 'GET') {
    try {
      const userId = getUserIdFromToken(request);
      if (!userId) {
        return { status: 401, jsonBody: { message: 'Unauthorized' } };
      }

      const user = await (User as Model<IUser>).findById(userId).select('-password');
      if (!user) {
        return { status: 404, jsonBody: { message: 'User not found' } };
      }

      return { status: 200, jsonBody: { user } };
    } catch (error) {
      context.error('Get user profile error:', error);
      return { status: 500, jsonBody: { message: 'Internal server error' } };
    }
  } else if (request.method === 'PATCH') {
    try {
      const userId = getUserIdFromToken(request);
      if (!userId) {
        return { status: 401, jsonBody: { message: 'Unauthorized' } };
      }

      const updates = await request.json() as Partial<UserType>; // Completed: Parse body as partial UserType
      const allowedUpdates = ['fullName', 'email']; // Example: Restrict to safe fields
      const isValidOperation = Object.keys(updates).every((update) => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return { status: 400, jsonBody: { message: 'Invalid updates' } };
      }

      const user = await (User as Model<IUser>).findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
      if (!user) {
        return { status: 404, jsonBody: { message: 'User not found' } };
      }

      return { status: 200, jsonBody: { message: 'Profile updated successfully', user } };
    } catch (error) {
      context.error('Update user profile error:', error);
      return { status: 500, jsonBody: { message: 'Internal server error' } };
    }
  }

  return { status: 405, jsonBody: { message: 'Method not allowed' } }; // Fallback for unsupported methods
}

app.http('userProfile', {
  methods: ['GET', 'PATCH'],
  authLevel: 'anonymous',
  route: 'users/profile',
  handler: userProfile
});
