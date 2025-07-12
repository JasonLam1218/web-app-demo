import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getUserIdFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(userId).select('-password'); // Exclude password
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  await connectDB();

  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();

    // Only allow specific fields to be updated
    const allowedUpdates = ['fullName'];
    const actualUpdates: { [key: string]: any } = {};
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        actualUpdates[key] = updates[key];
      }
    }

    if (Object.keys(actualUpdates).length === 0) {
      return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: actualUpdates },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Profile updated successfully', user }, { status: 200 });
  } catch (error) {
    console.error('Update user profile error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 