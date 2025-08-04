export interface GeminiTestRequest {
    prompt: string;
    category?: 'simple' | 'medium' | 'complex';
    scenarioName?: string;
  }
  
  export interface GeminiTestResponse {
    success: boolean;
    response?: string;
    responseTime: number;
    prompt: string;
    category: string;
    model: string;
    timestamp: string;
    error?: string;
    scenarioName?: string;
  }
  
  export interface PerformanceStats {
    category: string;
    minTime: number;
    maxTime: number;
    avgTime: number;
    testCount: number;
    totalTests: number;
    successRate: number;
  }
  
  export interface TestRunInfo {
    timestamp: string;
    apiUrl: string;
    totalTests: number;
    iterations: number;
    scenarios: number;
    environment?: {
      isVercel?: boolean;
      vercelEnv?: string;
      vercelUrl?: string;
    };
  }
  
  export interface TestResultsData {
    testRun: TestRunInfo;
    results: TestResult[];
  }
  
  export interface TestResult {
    name: string;
    category: 'simple' | 'medium' | 'complex';
    prompt: string;
    success: boolean;
    geminiResponseTime: number;
    totalRequestTime: number;
    networkLatency: number;
    iteration: number;
    timestamp: string;
    model: string;
    error?: string;
  }
  