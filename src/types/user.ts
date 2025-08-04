/**
 * User Type Definitions
 * 
 * This module defines TypeScript interfaces for user-related data structures
 * used throughout the EduAI application. These types provide type safety
 * for API responses and frontend components.
 */

/**
 * User Type Interface
 * 
 * Defines the structure for user data returned by API endpoints.
 * Excludes sensitive information like passwords and includes only
 * necessary user information for frontend consumption.
 */
export interface UserType {
  _id: string; // User's unique identifier
  email: string; // User's email address
  fullName: string; // User's full name
  isEmailVerified: boolean; // Email verification status
  createdAt: string; // Account creation timestamp (ISO string)
  updatedAt: string; // Last update timestamp (ISO string)
}

/**
 * User Profile Type Interface
 * 
 * Defines the structure for user profile data including additional
 * profile information beyond basic user data.
 */
export interface UserProfileType {
  _id: string; // Profile's unique identifier
  user: string; // Reference to user ID
  bio?: string; // User's biography or description
  avatar?: string; // URL to user's profile picture
  preferences?: Record<string, unknown>; // User preferences as key-value pairs
  createdAt: string; // Profile creation timestamp (ISO string)
  updatedAt: string; // Last update timestamp (ISO string)
} 