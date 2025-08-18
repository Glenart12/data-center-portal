import { NextResponse } from 'next/server';
import { compileEOP } from './sections/compile/route.js';

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
    
    console.log('EOP generation request received, calling compile function directly...');
    
    // Call the compile function directly instead of making HTTP request
    const result = await compileEOP(body.formData);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('EOP generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate EOP',
      details: error.message,
      userMessage: 'Unable to generate EOP. Please try again.'
    }, { status: 500 });
  }
}