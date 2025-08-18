import { NextResponse } from 'next/server';
import { compileMOP } from './sections/compile/route.js';

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
    
    console.log('MOP generation request received, calling compile function directly...');
    
    // Call the compile function directly instead of making HTTP request
    const result = await compileMOP(body.formData);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('MOP generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate MOP',
      details: error.message,
      userMessage: 'Unable to generate MOP. Please try again.'
    }, { status: 500 });
  }
}