export interface ResponseMetrics {
    startTime: number;
    endTime: number;
    responseTime: number;
    prompt: string;
    category: 'simple' | 'medium' | 'complex';
    model: string;
  }
  
  export class PerformanceTracker {
    static startTimer(): number {
      return Date.now();
    }
    
    static calculateMetrics(
      startTime: number, 
      prompt: string, 
      category: string,
      model: string = 'gemini-2.5-flash'
    ): ResponseMetrics {
      const endTime = Date.now();
      return {
        startTime,
        endTime,
        responseTime: endTime - startTime,
        prompt,
        category: category as ResponseMetrics['category'],
        model
      };
    }
  
    static categorizePrompt(prompt: string): 'simple' | 'medium' | 'complex' {
      const length = prompt.length;
      if (length < 50) return 'simple';
      if (length < 200) return 'medium';
      return 'complex';
    }
  }
  