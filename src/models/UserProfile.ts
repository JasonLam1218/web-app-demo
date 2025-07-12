import mongoose, { Schema, models, Document, Types } from 'mongoose';

export interface IUserProfile extends Document {
  user: Types.ObjectId; // Reference to the User model
  bio?: string;
  avatar?: string;
  preferences?: { [key: string]: any };
  // Add any other profile-specific fields here
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema = new Schema<IUserProfile>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Each user should have only one profile
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  avatar: String,
  preferences: {
    type: Map,
    of: Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserProfileSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const UserProfile = models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);

export default UserProfile; 