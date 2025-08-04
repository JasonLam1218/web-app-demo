export const runtime = 'edge';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const geminiModel = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
});

// POST handler for test requests
export async function POST(req: Request) {
  try {
    const { prompt, category, scenarioName } = await req.json();
    
    if (!prompt) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Environment detection
    const isVercel = process.env.VERCEL === '1';
    const vercelEnv = process.env.VERCEL_ENV;

    const startTime = Date.now();
    
    // Call Gemini API
    const result = await geminiModel.generateContent(prompt);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    return Response.json({
      success: true,
      response: result.response.text(),
      responseTime,
      prompt,
      category: category || 'simple',
      scenarioName: scenarioName || 'Custom',
      timestamp: new Date().toISOString(),
      model: 'gemini-2.5-flash',
      environment: {
        isVercel,
        vercelEnv,
        vercelUrl: process.env.VERCEL_URL
      }
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return Response.json({
      success: false,
      error: errorMessage,
      responseTime: 0,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GET handler for health checks
export async function GET() {
  return Response.json({
    status: 'Gemini API endpoint is running',
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    isVercel: process.env.VERCEL === '1',
    vercelEnv: process.env.VERCEL_ENV,
    methods: ['GET', 'POST']
  });
}
