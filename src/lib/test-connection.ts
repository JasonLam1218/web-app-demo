/**
 * Database Connection Test Utility
 * 
 * This module provides a simple utility function to test the MongoDB Atlas
 * connection and verify that the database is accessible. Useful for debugging
 * and monitoring database connectivity.
 */

import connectDB from './mongodb';

/**
 * Test MongoDB Connection
 * 
 * Attempts to establish a connection to MongoDB Atlas and logs the result.
 * This function is primarily used for debugging and testing database connectivity.
 * 
 * @returns Promise resolving to boolean indicating connection success
 */
export async function testMongoConnection() {
  try {
    // Attempt to establish database connection
    const connection = await connectDB();
    
    // Log successful connection with database details
    console.log('✅ MongoDB Atlas connection successful!');
    console.log('Database name:', connection.name);
    return true;
  } catch (error) {
    // Log connection failure with error details
    console.error('❌ MongoDB connection failed:', error);
    return false;
  }
}
