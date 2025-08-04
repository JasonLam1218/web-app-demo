const fs = require('fs');

function calculateStats(results) {
  const categories = ['simple', 'medium', 'complex'];
  const stats = {};
  
  categories.forEach(category => {
    const categoryResults = results.filter(r => 
      r.success && r.category === category
    );
    
    if (categoryResults.length === 0) {
      stats[category] = {
        testCount: 0,
        totalTests: results.filter(r => r.category === category).length,
        minTime: 0,
        maxTime: 0,
        avgTime: 0,
        successRate: 0
      };
      return;
    }
    
    const times = categoryResults.map(r => r.geminiResponseTime);
    const allCategoryTests = results.filter(r => r.category === category);
    
    stats[category] = {
      testCount: categoryResults.length,
      totalTests: allCategoryTests.length,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
      avgTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
      successRate: Math.round((categoryResults.length / allCategoryTests.length) * 100)
    };
  });
  
  return stats;
}

function generateMarkdownReport() {
  console.log('📊 Analyzing Gemini performance results...');
  
  // Check if results file exists
  if (!fs.existsSync('test-results/response-times.json')) {
    console.log('❌ No results file found at test-results/response-times.json');
    console.log('💡 Run the test script first: node scripts/test-response-times.js');
    return;
  }
  
  const data = JSON.parse(fs.readFileSync('test-results/response-times.json', 'utf8'));
  const { testRun, results } = data;
  
  if (!results || results.length === 0) {
    console.log('❌ No test results found in the data file');
    return;
  }
  
  const stats = calculateStats(results);
  const successful = results.filter(r => r.success);
  const overallSuccessRate = Math.round((successful.length / results.length) * 100);
  
  // Generate markdown report
  let markdown = `# Gemini API Response Time Report\n\n`;
  
  // Test Run Information
  markdown += `## Test Configuration\n\n`;
  markdown += `- **Test Date:** ${new Date(testRun.timestamp).toLocaleString()}\n`;
  markdown += `- **API Endpoint:** ${testRun.apiUrl}\n`;
  markdown += `- **Total Tests:** ${testRun.totalTests}\n`;
  markdown += `- **Iterations per Scenario:** ${testRun.iterations}\n`;
  markdown += `- **Scenarios Tested:** ${testRun.scenarios}\n`;
  markdown += `- **Overall Success Rate:** ${overallSuccessRate}%\n`;
  
  // Environment information
  if (testRun.environment) {
    markdown += `- **Environment:** ${testRun.environment.isVercel ? `Vercel (${testRun.environment.vercelEnv})` : 'Local/Other'}\n`;
    if (testRun.environment.vercelUrl) {
      markdown += `- **Deployment URL:** ${testRun.environment.vercelUrl}\n`;
    }
  }
  markdown += `\n`;
  
  // Performance Summary Table
  markdown += `## Performance Summary\n\n`;
  markdown += `| Category | Tests | Success Rate | Min Time (ms) | Max Time (ms) | Avg Time (ms) |\n`;
  markdown += `|----------|--------|--------------|---------------|---------------|---------------|\n`;
  
  ['simple', 'medium', 'complex'].forEach(category => {
    const stat = stats[category];
    markdown += `| **${category.charAt(0).toUpperCase() + category.slice(1)}** | ${stat.totalTests} | ${stat.successRate}% | ${stat.testCount > 0 ? stat.minTime : 'N/A'} | ${stat.testCount > 0 ? stat.maxTime : 'N/A'} | ${stat.testCount > 0 ? stat.avgTime : 'N/A'} |\n`;
  });
  
  markdown += `\n`;
  
  // Individual Test Results by Category
  markdown += `## Detailed Results by Category\n\n`;
  
  ['simple', 'medium', 'complex'].forEach(category => {
    const categoryResults = results.filter(r => r.category === category);
    
    if (categoryResults.length === 0) return;
    
    markdown += `### ${category.charAt(0).toUpperCase() + category.slice(1)} Category\n\n`;
    markdown += `| Test Name | Iteration | Response Time (ms) | Status | Error |\n`;
    markdown += `|-----------|-----------|--------------------|---------|---------|\n`;
    
    categoryResults.forEach(result => {
      const status = result.success ? '✅ Success' : '❌ Failed';
      const responseTime = result.success ? result.geminiResponseTime : 'N/A';
      const error = result.error ? result.error.substring(0, 50) + '...' : 'None';
      
      markdown += `| ${result.name} | ${result.iteration} | ${responseTime} | ${status} | ${error} |\n`;
    });
    
    markdown += `\n`;
  });
  
  // Performance Insights
  markdown += `## Performance Insights\n\n`;
  
  if (successful.length > 0) {
    const allTimes = successful.map(r => r.geminiResponseTime);
    const overallAvg = Math.round(allTimes.reduce((a, b) => a + b, 0) / allTimes.length);
    const overallMin = Math.min(...allTimes);
    const overallMax = Math.max(...allTimes);
    
    markdown += `- **Overall Average Response Time:** ${overallAvg}ms\n`;
    markdown += `- **Fastest Response:** ${overallMin}ms\n`;
    markdown += `- **Slowest Response:** ${overallMax}ms\n`;
    markdown += `- **Response Time Range:** ${overallMax - overallMin}ms\n\n`;
    
    // Performance recommendations
    markdown += `### Recommendations\n\n`;
    if (overallAvg < 5000) {
      markdown += `- ✅ **Excellent Performance**: Average response time under 5 seconds\n`;
    } else if (overallAvg < 15000) {
      markdown += `- ⚠️ **Good Performance**: Average response time acceptable but could be optimized\n`;
    } else {
      markdown += `- ❌ **Performance Concern**: Average response time over 15 seconds may impact user experience\n`;
    }
    
    if (overallSuccessRate < 90) {
      markdown += `- ❌ **Reliability Issue**: Success rate below 90% indicates potential stability problems\n`;
    } else if (overallSuccessRate < 98) {
      markdown += `- ⚠️ **Monitor Reliability**: Success rate could be improved\n`;
    } else {
      markdown += `- ✅ **Excellent Reliability**: Success rate above 98%\n`;
    }
  }
  
  markdown += `\n---\n\n`;
  markdown += `*Report generated on ${new Date().toLocaleString()}*\n`;
  
  // Save the markdown report
  fs.writeFileSync('gemini-performance-report.md', markdown);
  
  console.log('✅ Analysis complete!');
  console.log('📊 Report saved to: gemini-performance-report.md');
  console.log(`📈 Overall performance: ${overallSuccessRate}% success rate, ${successful.length > 0 ? Math.round(successful.reduce((sum, r) => sum + r.geminiResponseTime, 0) / successful.length) : 0}ms avg response time`);
}

// Export for use in other scripts
module.exports = { generateMarkdownReport, calculateStats };

// Run if called directly
if (require.main === module) {
  generateMarkdownReport();
}
