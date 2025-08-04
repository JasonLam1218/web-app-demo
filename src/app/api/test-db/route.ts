/**
 * Database Connection Test API Endpoint
 * 
 * This endpoint provides a simple way to test the MongoDB Atlas connection
 * and verify that the database is accessible. Useful for debugging and
 * monitoring database connectivity.
 * 
 * GET /api/test-db
 * Response: { message: string, timestamp: string, status: string }
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

/**
 * GET handler for testing database connection
 * 
 * Attempts to establish a connection to MongoDB Atlas and returns
 * the connection status with timestamp information.
 * 
 * @returns NextResponse with connection status and timestamp
 */
export async function GET() {
  try {
    // Attempt to establish database connection
    await connectDB();
    
    // Return success response with connection details
    return NextResponse.json({
      message: '✅ Database connection successful!',
      timestamp: new Date().toISOString(),
      status: 'Connected to MongoDB Atlas'
    });
  } catch (error) {
    // Log connection error for debugging
    console.error('Database connection failed:', error);
    
    // Return error response with details
    return NextResponse.json(
      { 
        error: '❌ Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
