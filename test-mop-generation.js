// Test script to verify MOP generation works without 401 errors
// This simulates the API call that would normally be made from the frontend

async function testMOPGeneration() {
  console.log('Testing MOP generation...\n');
  
  const testData = {
    formData: {
      manufacturer: 'Trane',
      modelNumber: 'CVHE-450',
      system: 'Chiller',
      category: 'Preventive Maintenance',
      frequency: 'Annual',
      workDescription: 'Annual preventive maintenance on centrifugal chiller',
      location: 'Test Data Center',
      address: {
        street: '123 Test Street',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601'
      }
    }
  };

  try {
    console.log('Sending test request to MOP generation API...');
    console.log('Test data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3008/api/generate-mop-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('\nResponse status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('\nResponse body (first 500 chars):', responseText.substring(0, 500));
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
      
      if (response.ok) {
        console.log('\n✅ SUCCESS! MOP generated without 401 errors');
        console.log('Filename:', data.filename);
        console.log('URL:', data.url);
        console.log('Message:', data.message);
      } else {
        console.log('\n❌ ERROR:', data.error || 'Unknown error');
        console.log('User message:', data.userMessage);
        console.log('Details:', data.details);
        
        // Check if it's an Auth0 error
        if (responseText.includes('Auth0') || responseText.includes('login') || response.status === 401) {
          console.log('\n⚠️  AUTHENTICATION ERROR DETECTED - This is the problem we were trying to fix!');
        }
      }
    } catch (parseError) {
      console.log('\n❌ Response is not JSON. Likely an HTML error page.');
      
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        console.log('Response appears to be HTML (likely Auth0 login page)');
        console.log('\n⚠️  AUTHENTICATION ERROR DETECTED - Getting HTML instead of JSON!');
      }
    }
    
  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
console.log('Starting MOP generation test...\n');
console.log('This test will verify that MOP generation works without 401 authentication errors.');
console.log('The fix refactored MOP to use direct function calls instead of internal HTTP requests.\n');
console.log('='.repeat(80));

testMOPGeneration().then(() => {
  console.log('\n' + '='.repeat(80));
  console.log('Test complete!');
  process.exit(0);
}).catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
});