// src/app/api/gemini/generate-exam/route.ts
export const runtime = 'edge';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { subject, difficulty, questionCount } = await req.json();
    
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro'
    });
    
    const prompt = `Generate ${questionCount || 10} ${difficulty || 'medium'} difficulty exam questions about ${subject}. Format as JSON with questions and answers.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return Response.json({
      success: true,
      exam: response.text(),
      subject,
      difficulty,
      questionCount,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
