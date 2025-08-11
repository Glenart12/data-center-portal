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
      
    const response = await fetch(`${baseUrl}/api/generate-mop-ai/sections/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Server error', userMessage: 'Server is busy. Please try again.' }));
      
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