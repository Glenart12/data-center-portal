import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.formData?.manufacturer || !body.formData?.modelNumber) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        userMessage: 'Please fill in all required fields'
      }, { status: 400 });
    }
    
    // Forward to compile route
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    // Pass through authentication headers for internal API calls
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Forward cookies for Auth0 session
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      headers['cookie'] = cookieHeader;
    }
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['authorization'] = authHeader;
    }
      
    const response = await fetch(`${baseUrl}/api/generate-mop-ai/sections/compile`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      // Get the error text first for logging
      const errorText = await response.text();
      console.error('MOP Compile failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText,
        baseUrl: baseUrl,
        fullUrl: `${baseUrl}/api/generate-mop-ai/sections/compile`
      });
      
      // Try to parse as JSON, fallback to text error
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || 'Server error', userMessage: 'Server is busy. Please try again.' };
      }
      
      // Add better error messages for common issues
      if (response.status === 429 || errorData.error?.includes('busy')) {
        return NextResponse.json({ 
          error: 'AI service is busy',
          userMessage: 'The AI service is currently busy. Please wait 2-3 minutes and try again.'
        }, { status: 429 });
      }
      
      return NextResponse.json(errorData, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('MOP generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate MOP',
      details: error.message,
      userMessage: 'Unable to generate MOP. Please try again.'
    }, { status: 500 });
  }
}