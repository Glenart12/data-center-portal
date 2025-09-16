import { NextResponse } from 'next/server';
import { compileMOP } from './sections/compile/route.js';
import { put } from '@vercel/blob';

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

    // Check if a PDF was uploaded in supporting documents
    let oneLineDiagramUrl = null;
    if (body.supportingDocs && body.supportingDocs.length > 0) {
      for (const doc of body.supportingDocs) {
        if (doc.type === 'application/pdf') {
          console.log('PDF one-line diagram found, uploading to Vercel Blob...');

          // Convert base64 to buffer
          const base64Data = doc.content.split(',')[1]; // Remove data:application/pdf;base64, prefix
          const buffer = Buffer.from(base64Data, 'base64');

          // Generate filename for the one-line diagram
          const timestamp = new Date().toISOString().split('T')[0];
          const filename = `one-line-diagrams/${timestamp}_${doc.name}`;

          // Upload to Vercel Blob
          const blob = await put(filename, buffer, {
            access: 'public',
            contentType: 'application/pdf'
          });

          oneLineDiagramUrl = blob.url;
          console.log('One-line diagram uploaded to:', oneLineDiagramUrl);
          break; // Only process the first PDF
        }
      }
    }

    // Add the one-line diagram URL to formData
    const enhancedFormData = {
      ...body.formData,
      oneLineDiagramUrl: oneLineDiagramUrl
    };

    // Call the compile function directly instead of making HTTP request
    const result = await compileMOP(enhancedFormData, body.supportingDocs);

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