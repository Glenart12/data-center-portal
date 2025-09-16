import { NextResponse } from 'next/server';
import { compileMOP } from './sections/compile/route.js';

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

    console.log('MOP generation request received, calling compile function directly...');

    // The oneLineDiagramUrl is already in body.formData if a PDF was uploaded
    // It was uploaded separately via /api/upload-one-line endpoint

    // Call the compile function directly
    const result = await compileMOP(body.formData, body.supportingDocs);

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