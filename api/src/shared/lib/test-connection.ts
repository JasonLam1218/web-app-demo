import connectDB from './mongodb';

export async function testMongoConnection() {
  try {
    const connection = await connectDB();
    console.log('✅ MongoDB Atlas connection successful!');
    console.log('Database name:', connection.name);
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return false;
  }
}
