import { NextResponse } from 'next/server';
import { upload } from '@vercel/blob/client';

export async function POST(request) {
  try {
    const body = await request.json();
    const { filename } = body;

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    console.log('Setting up client upload for:', filename);

    // Return the necessary info for client-side upload
    // The actual upload will happen directly from the browser
    return NextResponse.json({
      filename: filename,
      // The token will be handled by the client using the public NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN
      message: 'Use client-side upload with @vercel/blob/client'
    });

  } catch (error) {
    console.error('Error preparing upload:', error);
    return NextResponse.json(
      {
        error: 'Failed to prepare upload',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Enable CORS for client-side uploads
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}