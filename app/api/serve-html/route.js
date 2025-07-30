import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json({ error: 'URL parameter required' }, { status: 400 });
    }

    // Fetch the HTML content from the blob URL
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch document' }, { status: 404 });
    }

    const html = await response.text();

    // Return HTML with proper content-type header
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'SAMEORIGIN', // Allow iframe from same origin
      },
    });
  } catch (error) {
    console.error('Error serving HTML:', error);
    return NextResponse.json({ error: 'Failed to serve document' }, { status: 500 });
  }
}