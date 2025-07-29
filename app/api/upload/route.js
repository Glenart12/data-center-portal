import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('Upload request received');
    
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type');

    console.log('File:', file ? file.name : 'No file');
    console.log('Type:', type);

    if (!file) {
      console.log('Error: No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!type || !['mops', 'sops', 'eops'].includes(type)) {
      console.log('Error: Invalid type:', type);
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Convert the file to a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('File buffer created, size:', buffer.length);

    // Sanitize filename
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    console.log('Sanitized filename:', filename);

    // Upload to Vercel Blob Storage
    console.log(`Uploading to Blob storage: ${type}/${filename}`);
    
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: file.type,
      // Store in appropriate folder
      pathname: `${type}/${filename}`
    });
    
    console.log('File uploaded successfully to Blob storage');
    console.log('Blob URL:', blob.url);

    return NextResponse.json({ 
      message: 'File uploaded successfully',
      filename: filename,
      path: `/${type}/${filename}`,
      url: blob.url
    });
  } catch (error) {
    console.error('Upload error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json({ 
      error: `Upload failed: ${error.message}`,
      details: error.toString()
    }, { status: 500 });
  }
}