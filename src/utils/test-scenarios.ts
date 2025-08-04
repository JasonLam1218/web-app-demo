export const SCENARIOS = [
    {"name": "Quick Math", "prompt": "What is 15+27?", "category": "simple"},
    {"name": "Short Explanation", "prompt": "Define AI in one sentence.", "category": "simple"},
    {"name": "Medium Analysis", "prompt": "Pros and cons of renewable energy.", "category": "medium"},
    {"name": "Code Generation", "prompt": "Python factorial function.", "category": "medium"},
    {"name": "Long Essay", "prompt": "Impact of social media.", "category": "complex"},
    {"name": "Technical Deep Dive", "prompt": "Explain quantum computing principles and applications.", "category": "complex"}
  ] as const;
  
  export type ScenarioCategory = 'simple' | 'medium' | 'complex';
  
  export interface TestScenario {
    name: string;
    prompt: string;
    category: ScenarioCategory;
  }
  
  export interface TestResult {
    id: string;
    scenario: TestScenario;
    success: boolean;
    responseTime: number;
    geminiResponse?: string;
    error?: string;
    timestamp: string;
  }
  