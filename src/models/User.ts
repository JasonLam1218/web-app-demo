import mongoose, { Schema, models, Document, Types } from 'mongoose';

export interface IUser extends Document {
  email: string;
  fullName: string;
  password?: string; // Optional for OAuth, but required for email/password login
  isEmailVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  profile?: Types.ObjectId; // Reference to UserProfile
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
  },
  password: {
    type: String,
    select: false, // Don't return the password by default
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: String,
  verificationCodeExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'UserProfile',
  },
});

// Update `updatedAt` field on save
UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const User = models.User || mongoose.model<IUser>('User', UserSchema);

export default User; 