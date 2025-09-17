import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate that it's a PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are accepted' },
        { status: 400 }
      );
    }

    console.log('Uploading one-line diagram PDF:', file.name, 'Size:', file.size);

    // Generate filename with timestamp and random suffix
    const timestamp = new Date().toISOString().split('T')[0];
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `one-line-diagrams/${timestamp}_${randomSuffix}_${sanitizedName}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: 'application/pdf'
    });

    console.log('One-line diagram uploaded successfully:', blob.url);

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: filename
    });

  } catch (error) {
    console.error('Error uploading one-line diagram:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload file',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Configure the API route to handle larger files
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};