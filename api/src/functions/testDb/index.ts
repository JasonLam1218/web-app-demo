import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import connectDB from "../../shared/lib/mongodb";
import User from "../../shared/models/User";
import { Model } from "mongoose"; // Import Model
import { IUser } from '../../shared/models/User'; // Assuming IUser is defined

export async function testDb(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    await connectDB();
    return {
      status: 200,
      jsonBody: {
        message: '✅ Database connection successful!',
        timestamp: new Date().toISOString(),
        status: 'Connected to MongoDB Atlas'
      }
    };
  } catch (error) {
    context.error('Database connection failed:', error);
    return {
      status: 500,
      jsonBody: {
        error: '❌ Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

app.http('testDb', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'test-db',
  handler: testDb
});
