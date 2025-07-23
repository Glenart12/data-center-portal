import { writeFile, mkdir } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { existsSync } from 'fs';

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

    // Define the directory and file paths
    const uploadDir = path.join(process.cwd(), 'public', type);
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
    const filepath = path.join(uploadDir, filename);

    console.log('Upload directory:', uploadDir);
    console.log('File path:', filepath);

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      console.log('Creating directory:', uploadDir);
      await mkdir(uploadDir, { recursive: true });
    }

    // Write the file
    console.log('Writing file...');
    await writeFile(filepath, buffer);
    console.log('File written successfully');

    return NextResponse.json({ 
      message: 'File uploaded successfully',
      filename: filename,
      path: `/${type}/${filename}`
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