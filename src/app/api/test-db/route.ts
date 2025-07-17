
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    
    return NextResponse.json({
      message: '✅ Database connection successful!',
      timestamp: new Date().toISOString(),
      status: 'Connected to MongoDB Atlas'
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { 
        error: '❌ Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
