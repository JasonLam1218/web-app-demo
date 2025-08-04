/**
 * User Profile Model
 * 
 * This module defines the UserProfile schema and interface for the EduAI application.
 * It extends user information with additional profile data like bio, avatar,
 * and user preferences using Mongoose ODM.
 */

import mongoose, { Schema, models, Document, Types } from 'mongoose';

/**
 * User Profile Interface
 * 
 * Defines the TypeScript interface for UserProfile documents, extending Mongoose Document.
 * Includes profile-specific fields and their types for type safety.
 */
export interface IUserProfile extends Document {
  user: Types.ObjectId; // Reference to the User model (one-to-one relationship)
  bio?: string; // User's biography or description
  avatar?: string; // URL to user's profile picture
  preferences?: Map<string, unknown>; // User preferences stored as key-value pairs
  createdAt: Date; // Profile creation timestamp
  updatedAt: Date; // Last update timestamp
}

/**
 * User Profile Schema
 * 
 * Defines the Mongoose schema for UserProfile documents with validation rules,
 * field types, and middleware hooks. Each user can have only one profile.
 */
const UserProfileSchema = new Schema<IUserProfile>({
  // Reference to User model (one-to-one relationship)
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true, // Profile must belong to a user
    unique: true, // Each user should have only one profile
  },
  
  // User biography
  bio: {
    type: String,
    maxlength: 500, // Limit bio to 500 characters
  },
  
  // User avatar/profile picture URL
  avatar: String,
  
  // User preferences as key-value pairs
  preferences: {
    type: Map,
    of: Schema.Types.Mixed, // Allow any type of value for preferences
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now, // Set to current time on creation
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Set to current time on creation
  },
});

/**
 * Pre-save Middleware
 * 
 * Automatically updates the updatedAt field whenever a profile document is saved.
 * This ensures the updatedAt timestamp is always current.
 */
UserProfileSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Export the UserProfile model, creating it if it doesn't exist
// This prevents model recompilation errors in development
const UserProfile = models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);

export default UserProfile; 