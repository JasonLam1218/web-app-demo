const fetch = require('node-fetch');
const fs = require('fs');

// Your defined scenarios
const SCENARIOS = [
  {"name": "Quick Math", "prompt": "What is 15+27?", "category": "simple"},
  {"name": "Short Explanation", "prompt": "Define AI in one sentence.", "category": "simple"},
  {"name": "Medium Analysis", "prompt": "Pros and cons of renewable energy.", "category": "medium"},
  {"name": "Code Generation", "prompt": "Python factorial function.", "category": "medium"},
  {"name": "Long Essay", "prompt": "Impact of social media.", "category": "complex"},
  {"name": "Technical Deep Dive", "prompt": "Explain quantum computing principles and applications.", "category": "complex"}
];

// Enhanced API URL detection
function getAPIURL() {
  // Check for explicit API_URL override
  if (process.env.API_URL) {
    console.log(`🔧 Using explicit API_URL: ${process.env.API_URL}`);
    return process.env.API_URL;
  }
  
  // Check if running on Vercel
  if (process.env.VERCEL_ENV) {
    const vercelUrl = process.env.VERCEL_URL;
    console.log(`🌐 Detected Vercel deployment: ${process.env.VERCEL_ENV}`);
    console.log(`📍 Using Vercel URL: https://${vercelUrl}`);
    return `https://${vercelUrl}`;
  }
  
  // Use your known Vercel deployment URL as fallback
  const fallbackUrl = 'https://web-app-demo-git-dev-jasonlam1218s-projects.vercel.app';
  console.log(`🏠 Using fallback URL: ${fallbackUrl}`);
  return fallbackUrl;
}

const API_URL = getAPIURL();
const ITERATIONS = 3; // Run each test 3 times for accuracy

async function testScenario(scenario, iteration = 1) {
  console.log(`🧪 Testing: ${scenario.name} (Iteration ${iteration})`);
  
  const requestStartTime = Date.now();
  
  try {
    const response = await fetch(`${API_URL}/api/gemini/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: scenario.prompt,
        category: scenario.category,
        scenarioName: scenario.name
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const requestEndTime = Date.now();
    
    const result = {
      name: scenario.name,
      category: scenario.category,
      prompt: scenario.prompt,
      success: data.success,
      geminiResponseTime: data.responseTime || 0,
      totalRequestTime: requestEndTime - requestStartTime,
      networkLatency: (requestEndTime - requestStartTime) - (data.responseTime || 0),
      iteration,
      timestamp: data.timestamp,
      model: data.model || 'gemini-2.5-flash',
      error: data.error || null,
      environment: data.environment || {}
    };

    if (data.success) {
      console.log(`✅ ${scenario.name}: Gemini=${data.responseTime}ms, Total=${result.totalRequestTime}ms`);
    } else {
      console.log(`❌ ${scenario.name}: FAILED - ${data.error}`);
    }

    return result;
    
  } catch (error) {
    const requestEndTime = Date.now();
    console.log(`❌ ${scenario.name}: NETWORK ERROR - ${error.message}`);
    
    return {
      name: scenario.name,
      category: scenario.category,
      prompt: scenario.prompt,
      success: false,
      geminiResponseTime: 0,
      totalRequestTime: requestEndTime - requestStartTime,
      networkLatency: 0,
      iteration,
      timestamp: new Date().toISOString(),
      model: 'gemini-2.5-flash',
      error: error.message
    };
  }
}

async function runAllTests() {
  console.log(`🚀 Starting Gemini Response Time Tests`);
  console.log(`📍 Testing against: ${API_URL}`);
  
  // Add environment detection logging
  if (process.env.VERCEL_ENV) {
    console.log(`🔧 Vercel Environment: ${process.env.VERCEL_ENV}`);
    console.log(`🌐 Deployment URL: ${process.env.VERCEL_URL}`);
  } else {
    console.log(`🏠 Running locally or non-Vercel environment`);
  }
  
  console.log(`🔄 Running ${ITERATIONS} iterations per scenario\n`);
  
  const allResults = [];
  
  // Run each scenario multiple times
  for (let iteration = 1; iteration <= ITERATIONS; iteration++) {
    console.log(`\n=== ITERATION ${iteration}/${ITERATIONS} ===`);
    
    for (const scenario of SCENARIOS) {
      const result = await testScenario(scenario, iteration);
      allResults.push(result);
      
      // Wait between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  
  // Save results to JSON file
  const resultsData = {
    testRun: {
      timestamp: new Date().toISOString(),
      apiUrl: API_URL,
      totalTests: allResults.length,
      iterations: ITERATIONS,
      scenarios: SCENARIOS.length,
      environment: {
        isVercel: process.env.VERCEL === '1',
        vercelEnv: process.env.VERCEL_ENV,
        vercelUrl: process.env.VERCEL_URL
      }
    },
    results: allResults
  };
  
  // Create test-results directory if it doesn't exist
  if (!fs.existsSync('test-results')) {
    fs.mkdirSync('test-results');
  }
  
  fs.writeFileSync('test-results/response-times.json', JSON.stringify(resultsData, null, 2));
  
  console.log('\n✅ Testing complete!');
  console.log(`📁 Results saved to: test-results/response-times.json`);
  console.log(`📊 Total tests run: ${allResults.length}`);
  
  // Calculate quick summary
  const successful = allResults.filter(r => r.success);
  const successRate = ((successful.length / allResults.length) * 100).toFixed(1);
  console.log(`📈 Success rate: ${successRate}% (${successful.length}/${allResults.length})`);
  
  if (successful.length > 0) {
    const avgTime = Math.round(successful.reduce((sum, r) => sum + r.geminiResponseTime, 0) / successful.length);
    console.log(`⏱️ Average response time: ${avgTime}ms`);
  }
}

// Export for use in other scripts
module.exports = { runAllTests, testScenario, SCENARIOS };

// Run if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}
