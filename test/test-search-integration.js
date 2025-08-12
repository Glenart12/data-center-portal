/**
 * Test Search Integration
 * Manual test file to verify search functionality
 * Run with: node test/test-search-integration.js
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_CASES = [
  {
    name: 'Carrier Chiller 30XA080',
    modelNumber: '30XA080',
    manufacturer: 'Carrier',
    expectedFields: ['tonnage', 'voltage', 'refrigerantType']
  },
  {
    name: 'Trane Chiller RTAC140',
    modelNumber: 'RTAC140',
    manufacturer: 'Trane',
    expectedFields: ['tonnage', 'voltage', 'refrigerantType']
  },
  {
    name: 'York Chiller YCAL0080',
    modelNumber: 'YCAL0080',
    manufacturer: 'York',
    expectedFields: ['tonnage', 'voltage']
  },
  {
    name: 'Liebert UPS NX-200',
    modelNumber: 'NX-200',
    manufacturer: 'Liebert',
    expectedFields: ['voltage']
  },
  {
    name: 'Invalid Model Test',
    modelNumber: 'INVALID123',
    manufacturer: 'UnknownBrand',
    expectedFields: []
  }
];

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

/**
 * Make HTTP request to test endpoint
 */
function makeRequest(modelNumber, manufacturer) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL);
    const protocol = url.protocol === 'https:' ? https : http;
    
    const queryParams = new URLSearchParams({
      modelNumber: modelNumber,
      manufacturer: manufacturer
    });
    
    const requestUrl = `${BASE_URL}/api/test-equipment-search?${queryParams}`;
    console.log(`${colors.cyan}Making request to: ${requestUrl}${colors.reset}`);
    
    protocol.get(requestUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: parsed
          });
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Validate response structure
 */
function validateResponse(response, testCase) {
  const errors = [];
  const warnings = [];
  const successes = [];
  
  // Check basic structure
  if (!response.data) {
    errors.push('Response has no data');
    return { errors, warnings, successes };
  }
  
  if (typeof response.data.success !== 'boolean') {
    errors.push('Response missing success field');
  } else {
    successes.push(`Success field present: ${response.data.success}`);
  }
  
  if (!Array.isArray(response.data.results)) {
    errors.push('Results is not an array');
  } else {
    successes.push(`Results array present with ${response.data.results.length} items`);
  }
  
  if (!response.data.metadata) {
    warnings.push('Metadata field missing');
  } else {
    successes.push('Metadata present');
    
    if (response.data.metadata.searchEnabled !== undefined) {
      console.log(`  ${colors.blue}Search Enabled: ${response.data.metadata.searchEnabled}${colors.reset}`);
    }
    
    if (response.data.metadata.source) {
      console.log(`  ${colors.blue}Data Source: ${response.data.metadata.source}${colors.reset}`);
    }
  }
  
  // Check for expected fields if results exist
  if (response.data.results && response.data.results.length > 0) {
    const result = response.data.results[0];
    
    console.log(`\n${colors.magenta}Extracted Specifications:${colors.reset}`);
    
    // Check each expected field
    for (const field of testCase.expectedFields) {
      if (result[field]) {
        successes.push(`Found ${field}: ${result[field]}`);
        console.log(`  ${colors.green}✓ ${field}: ${result[field]}${colors.reset}`);
      } else {
        warnings.push(`Expected field '${field}' not found`);
        console.log(`  ${colors.yellow}⚠ ${field}: Not found${colors.reset}`);
      }
    }
    
    // Check for additional specs
    if (result.additionalSpecs && Object.keys(result.additionalSpecs).length > 0) {
      console.log(`\n${colors.magenta}Additional Specifications:${colors.reset}`);
      for (const [key, value] of Object.entries(result.additionalSpecs)) {
        console.log(`  ${colors.cyan}${key}: ${value}${colors.reset}`);
      }
    }
    
    // Show source snippets if available
    if (result.sourceSnippets && result.sourceSnippets.length > 0) {
      console.log(`\n${colors.magenta}Source Snippets (${result.sourceSnippets.length} found):${colors.reset}`);
      result.sourceSnippets.slice(0, 2).forEach((snippet, index) => {
        console.log(`  ${colors.blue}[${index + 1}] ${snippet.substring(0, 100)}...${colors.reset}`);
      });
    }
  }
  
  return { errors, warnings, successes };
}

/**
 * Run a single test case
 */
async function runTest(testCase) {
  console.log(`\n${colors.yellow}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}Testing: ${testCase.name}${colors.reset}`);
  console.log(`Model: ${testCase.modelNumber}, Manufacturer: ${testCase.manufacturer}`);
  console.log(`${colors.yellow}${'='.repeat(60)}${colors.reset}\n`);
  
  try {
    const startTime = Date.now();
    const response = await makeRequest(testCase.modelNumber, testCase.manufacturer);
    const duration = Date.now() - startTime;
    
    console.log(`\n${colors.green}Response received in ${duration}ms${colors.reset}`);
    console.log(`Status Code: ${response.status}`);
    
    const validation = validateResponse(response, testCase);
    
    // Display validation results
    console.log(`\n${colors.cyan}Validation Results:${colors.reset}`);
    
    if (validation.errors.length > 0) {
      console.log(`${colors.red}Errors (${validation.errors.length}):${colors.reset}`);
      validation.errors.forEach(error => {
        console.log(`  ${colors.red}✗ ${error}${colors.reset}`);
      });
    }
    
    if (validation.warnings.length > 0) {
      console.log(`${colors.yellow}Warnings (${validation.warnings.length}):${colors.reset}`);
      validation.warnings.forEach(warning => {
        console.log(`  ${colors.yellow}⚠ ${warning}${colors.reset}`);
      });
    }
    
    if (validation.successes.length > 0) {
      console.log(`${colors.green}Successes (${validation.successes.length}):${colors.reset}`);
      validation.successes.forEach(success => {
        console.log(`  ${colors.green}✓ ${success}${colors.reset}`);
      });
    }
    
    return {
      testCase: testCase.name,
      passed: validation.errors.length === 0,
      errors: validation.errors.length,
      warnings: validation.warnings.length,
      successes: validation.successes.length,
      duration
    };
    
  } catch (error) {
    console.error(`${colors.red}Test failed with error: ${error.message}${colors.reset}`);
    return {
      testCase: testCase.name,
      passed: false,
      error: error.message
    };
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}     SEARCH INTEGRATION TEST SUITE${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`\nEnvironment: ${BASE_URL}`);
  console.log(`Search Enabled: ${process.env.SEARCH_ENABLED || 'Not set (defaults to false)'}`);
  console.log(`Total Tests: ${TEST_CASES.length}\n`);
  
  const results = [];
  
  for (const testCase of TEST_CASES) {
    const result = await runTest(testCase);
    results.push(result);
    
    // Add delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Display summary
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}                  TEST SUMMARY${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const totalDuration = results.reduce((sum, r) => sum + (r.duration || 0), 0);
  
  results.forEach(result => {
    const status = result.passed ? 
      `${colors.green}PASS${colors.reset}` : 
      `${colors.red}FAIL${colors.reset}`;
    const details = result.error ? 
      ` - ${colors.red}${result.error}${colors.reset}` :
      ` - ${colors.green}${result.successes} successes${colors.reset}, ${colors.yellow}${result.warnings} warnings${colors.reset}`;
    
    console.log(`  ${status} ${result.testCase}${details}`);
  });
  
  console.log(`\n${colors.cyan}Results:${colors.reset}`);
  console.log(`  ${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`  ${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`  Total Duration: ${totalDuration}ms`);
  console.log(`  Average Duration: ${Math.round(totalDuration / results.length)}ms`);
  
  // Provide recommendations
  console.log(`\n${colors.cyan}Recommendations:${colors.reset}`);
  
  if (process.env.SEARCH_ENABLED !== 'true') {
    console.log(`  ${colors.yellow}⚠ SEARCH_ENABLED is not set to 'true'. Tests will use mock data.${colors.reset}`);
    console.log(`  ${colors.yellow}  To test real search: Set SEARCH_ENABLED=true in .env.local${colors.reset}`);
  }
  
  if (!process.env.SERP_API_KEY || process.env.SERP_API_KEY === 'your_actual_api_key_here') {
    console.log(`  ${colors.yellow}⚠ SERP_API_KEY not configured. Real search won't work.${colors.reset}`);
    console.log(`  ${colors.yellow}  Get an API key from: https://serpapi.com${colors.reset}`);
  }
  
  console.log(`\n${colors.cyan}Test complete!${colors.reset}\n`);
  
  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Check if running directly
if (require.main === module) {
  // Load environment variables if available
  try {
    require('dotenv').config({ path: '.env.local' });
    console.log(`${colors.green}Loaded environment from .env.local${colors.reset}`);
  } catch (error) {
    console.log(`${colors.yellow}Note: .env.local not loaded. Using system environment.${colors.reset}`);
  }
  
  runAllTests().catch(error => {
    console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = {
  runTest,
  runAllTests,
  makeRequest,
  validateResponse
};