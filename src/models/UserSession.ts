/**
 * User Session Model
 * 
 * This module defines the UserSession schema and interface for the EduAI application.
 * It tracks user sessions for security and analytics purposes, including session
 * tokens, expiration times, and client information.
 */

import mongoose, { Schema, models, Document, Types } from 'mongoose';

/**
 * User Session Interface
 * 
 * Defines the TypeScript interface for UserSession documents, extending Mongoose Document.
 * Includes session tracking fields and their types for type safety.
 */
export interface IUserSession extends Document {
  user: Types.ObjectId; // Reference to the User model
  token: string; // JWT or other session token
  createdAt: Date; // Session creation timestamp
  expiresAt: Date; // Session expiration timestamp
  ipAddress?: string; // Client IP address for security tracking
  userAgent?: string; // Client user agent string for device/browser tracking
}

/**
 * User Session Schema
 * 
 * Defines the Mongoose schema for UserSession documents with validation rules,
 * field types, and TTL (Time To Live) indexing for automatic cleanup.
 */
const UserSessionSchema = new Schema<IUserSession>({
  // Reference to User model
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true, // Session must belong to a user
  },
  
  // Session token (JWT or other authentication token)
  token: {
    type: String,
    required: true, // Token is required for session
    unique: true, // Each token should be unique
  },
  
  // Session creation timestamp
  createdAt: {
    type: Date,
    default: Date.now, // Set to current time on creation
    expires: '7d', // Sessions expire after 7 days by default (can be overridden by expiresAt)
  },
  
  // Session expiration timestamp
  expiresAt: {
    type: Date,
    required: true, // Explicit expiration time is required
  },
  
  // Client IP address for security tracking
  ipAddress: String,
  
  // Client user agent for device/browser tracking
  userAgent: String,
});

// Export the UserSession model, creating it if it doesn't exist
// This prevents model recompilation errors in development
const UserSession = models.UserSession || mongoose.model<IUserSession>('UserSession', UserSessionSchema);

export default UserSession; 