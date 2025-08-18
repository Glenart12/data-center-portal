import { NextResponse } from 'next/server';
import { compileSOP } from './sections/compile/route.js';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.formData?.manufacturer || !body.formData?.modelNumber || !body.formData?.equipmentNumber) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        userMessage: 'Please fill in all required fields including Equipment Number'
      }, { status: 400 });
    }
    
    console.log('SOP generation request received, calling compile function directly...');
    
    // Call the compile function directly instead of making HTTP request
    const result = await compileSOP(body.formData);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('SOP generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate SOP',
      details: error.message,
      userMessage: 'Unable to generate SOP. Please try again.'
    }, { status: 500 });
  }
}