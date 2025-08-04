/**
 * Authentication Utilities
 * 
 * This module provides utility functions for JWT token generation, verification,
 * password hashing, and user authentication. It handles all authentication-related
 * operations for the EduAI application.
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

// JWT secret key for token signing and verification
// In production, this should be a strong, unique secret stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * Generate JWT Authentication Token
 * 
 * Creates a JWT token containing the user ID with a 1-hour expiration time.
 * This token is used for authenticating API requests.
 * 
 * @param userId - The user's unique identifier
 * @returns JWT token string
 */
export const generateAuthToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Hash Password
 * 
 * Securely hashes a plain text password using bcrypt with a salt round of 10.
 * This function should be used whenever storing passwords in the database.
 * 
 * @param password - Plain text password to hash
 * @returns Promise resolving to hashed password string
 */
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare Password
 * 
 * Compares a plain text password with a hashed password to verify if they match.
 * Used during login to validate user credentials.
 * 
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password from database
 * @returns Promise resolving to boolean indicating if passwords match
 */
export const comparePassword = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Verify Authentication Token
 * 
 * Verifies a JWT token and returns the decoded payload if valid.
 * Returns null if the token is invalid, expired, or malformed.
 * 
 * @param token - JWT token string to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyAuthToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error: unknown) {
    // Log error for debugging purposes
    console.error('Error verifying token:', error);
    return null;
  }
};

/**
 * Extract User ID from Request Token
 * 
 * Extracts the user ID from a JWT token in the request headers.
 * This function is used in API routes to identify the authenticated user.
 * 
 * @param request - Next.js request object containing Authorization header
 * @returns User ID string or null if token is invalid or missing
 */
export const getUserIdFromToken = (request: NextRequest) => {
  // Extract token from Authorization header (Bearer token format)
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;

  // Verify the token and extract user ID
  const decoded = verifyAuthToken(token);
  if (!decoded || typeof decoded === 'string') return null;

  return (decoded as { userId: string }).userId;
}; 