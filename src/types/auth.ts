/**
 * Authentication Type Definitions
 * 
 * This module defines TypeScript interfaces for authentication-related
 * data structures used throughout the EduAI application. These types
 * provide type safety for API responses and authentication flows.
 */

/**
 * Authentication Response Interface
 * 
 * Defines the structure for authentication API responses including
 * success messages, authentication tokens, and user information.
 */
export interface AuthResponse {
  message: string; // Success or error message
  token?: string; // JWT authentication token (optional for some responses)
  user?: {
    email: string; // User's email address
    fullName: string; // User's full name
    isEmailVerified: boolean; // Email verification status
  };
}

/**
 * Error Response Interface
 * 
 * Defines the structure for error responses from authentication endpoints.
 * Used for consistent error handling across the application.
 */
export interface ErrorResponse {
  message: string; // Error message describing what went wrong
} 