import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server'; // Re-add NextRequest import

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
  } catch (error: any) { // Explicitly type error as any
    return null;
  }
};

export const getUserIdFromToken = (request: NextRequest) => {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;

  const decoded = verifyAuthToken(token);
  if (!decoded || typeof decoded === 'string') return null;

  return (decoded as { userId: string }).userId;
}; 