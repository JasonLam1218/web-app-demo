import mongoose, { Schema, models, Document, Types } from 'mongoose';

export interface IUserSession extends Document {
  user: Types.ObjectId; // Reference to the User model
  token: string; // JWT or other session token
  createdAt: Date;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

const UserSessionSchema = new Schema<IUserSession>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d', // Sessions expire after 7 days by default (can be overridden by expiresAt)
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  ipAddress: String,
  userAgent: String,
});

const UserSession = models.UserSession || mongoose.model<IUserSession>('UserSession', UserSessionSchema);

export default UserSession; 