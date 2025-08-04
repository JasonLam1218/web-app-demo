/**
 * User Model
 * 
 * This module defines the User schema and interface for the EduAI application.
 * It includes user authentication data, profile information, and email verification
 * functionality using Mongoose ODM.
 */

import mongoose, { Schema, models, Document, Types } from 'mongoose';

/**
 * User Interface
 * 
 * Defines the TypeScript interface for User documents, extending Mongoose Document.
 * Includes all user fields and their types for type safety.
 */
export interface IUser extends Document {
  email: string; // User's email address (unique identifier)
  fullName: string; // User's full name
  password?: string; // Hashed password (optional for OAuth, required for email/password)
  isEmailVerified: boolean; // Email verification status
  verificationCode?: string; // 6-digit code for email verification
  verificationCodeExpires?: Date; // Expiration time for verification code
  resetPasswordToken?: string; // 6-digit code for password reset
  resetPasswordExpires?: Date; // Expiration time for password reset code
  createdAt: Date; // Account creation timestamp
  updatedAt: Date; // Last update timestamp
  profile?: Types.ObjectId; // Reference to UserProfile document
}

/**
 * User Schema
 * 
 * Defines the Mongoose schema for User documents with validation rules,
 * field types, and middleware hooks.
 */
const UserSchema = new Schema<IUser>({
  // Email field with validation and uniqueness
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true, // Ensures email uniqueness across all users
    lowercase: true, // Store emails in lowercase for consistency
    trim: true, // Remove whitespace
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'], // Email format validation
  },
  
  // Full name field
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true, // Remove whitespace
  },
  
  // Password field (hashed)
  password: {
    type: String,
    select: false, // Don't return password by default in queries
  },
  
  // Email verification status
  isEmailVerified: {
    type: Boolean,
    default: false, // Users start with unverified email
  },
  
  // Email verification code (6-digit)
  verificationCode: String,
  
  // Email verification code expiration
  verificationCodeExpires: Date,
  
  // Password reset token (6-digit)
  resetPasswordToken: String,
  
  // Password reset token expiration
  resetPasswordExpires: Date,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now, // Set to current time on creation
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Set to current time on creation
  },
  
  // Reference to user profile document
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'UserProfile', // Reference to UserProfile model
  },
});

/**
 * Pre-save Middleware
 * 
 * Automatically updates the updatedAt field whenever a user document is saved.
 * This ensures the updatedAt timestamp is always current.
 */
UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Export the User model, creating it if it doesn't exist
// This prevents model recompilation errors in development
const User = models.User || mongoose.model<IUser>('User', UserSchema);

export default User; 