// src/app/api/gemini/chat/route.ts
export const runtime = 'edge';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
    });
    
    const chat = model.startChat({
      history: history || []
    });
    
    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    return Response.json({
      success: true,
      message: response.text(),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
