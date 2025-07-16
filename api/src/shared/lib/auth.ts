import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server'; // Re-add NextRequest import
import { HttpRequest } from "@azure/functions"; // Import HttpRequest

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateAuthToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export const verifyAuthToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error: unknown) { // Changed type to unknown
    console.error('Error verifying token:', error);
    return null;
  }
};

export const getUserIdFromToken = (request: HttpRequest) => {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;

  const decoded = verifyAuthToken(token);
  if (!decoded || typeof decoded === 'string') return null;

  return (decoded as { userId: string }).userId;
}; 