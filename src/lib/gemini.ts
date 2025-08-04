import { GoogleGenerativeAI } from '@google/generative-ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// For streaming responses (chat interface)
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// Export models for different use cases
export const geminiModel = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
});

export const streamingModel = google('gemini-2.5-flash');

// Test connection function
export async function testGeminiConnection() {
  try {
    const result = await geminiModel.generateContent("Test connection");
    return { success: true, response: result.response.text() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Helper function to categorize prompts by complexity
export function categorizePrompt(prompt: string): 'simple' | 'medium' | 'complex' {
  const length = prompt.length;
  if (length < 50) return 'simple';
  if (length < 200) return 'medium';
  return 'complex';
}
