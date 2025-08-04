// src/app/test-gemini/page.tsx
'use client';

import { useState } from 'react';

export default function TestGeminiPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const testGemini = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          category: 'simple',
          scenarioName: 'Manual Test' 
        })
      });
      
      const data = await res.json();
      setResponse(data.success ? data.response : `Error: ${data.error}`);
    } catch (error) {
      setResponse(`Network Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Gemini API Test</h1>
      
      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full p-3 border rounded-lg h-32"
        />
        
        <button
          onClick={testGemini}
          disabled={loading || !prompt}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Gemini API'}
        </button>
        
        {response && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold mb-2">Response:</h3>
            <pre className="whitespace-pre-wrap">{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
