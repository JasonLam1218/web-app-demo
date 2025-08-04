/**
 * MongoDB Connection Utility
 * 
 * This module provides a connection utility for MongoDB Atlas using Mongoose.
 * It implements connection caching to avoid creating multiple connections
 * and handles connection lifecycle management.
 */

import mongoose from 'mongoose';

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Validate that MongoDB URI is provided
if (!MONGODB_URI) {
  if (process.env.NODE_ENV === 'production') {
    // In production, warn but don't throw to allow build to complete
    console.warn('MONGODB_URI not found during build - API routes may not work at runtime');
  } else {
    // In development, throw error to prevent silent failures
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }
}

/**
 * Interface for caching MongoDB connection state
 * Used to store connection and promise references globally
 */
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Declare global variable for connection caching
declare global {
  var mongoose: MongooseCache;
}

// Initialize global.mongoose if it doesn't exist
// This prevents multiple connection instances in development
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

// Reference to the cached connection state
const cached = global.mongoose;

/**
 * Connect to MongoDB Atlas
 * 
 * Establishes a connection to MongoDB Atlas using Mongoose. Implements
 * connection caching to reuse existing connections and avoid creating
 * multiple connections unnecessarily.
 * 
 * @returns Promise resolving to the MongoDB connection
 */
async function connectDB(): Promise<mongoose.Connection> {
  // Return existing connection if available
  if (cached.conn) {
    console.log('Using existing database connection');
    return cached.conn;
  }

  // Create new connection if no existing promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable command buffering for better error handling
    };

    // Create connection promise
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      console.log('MongoDB Connected!');
      return mongooseInstance.connection;
    });
  }
  
  // Wait for connection to be established
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
