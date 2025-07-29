import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { type } = params;
    
    if (!['mops', 'sops', 'eops'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    console.log(`Listing files from Blob storage for type: ${type}`);

    // List all blobs in the specified folder
    const { blobs } = await list({
      prefix: `${type}/`,
    });

    console.log(`Found ${blobs.length} blobs`);

    // Create an object with both filenames and URLs
    const filesWithUrls = blobs
      .filter(blob => {
        const filename = blob.pathname.split('/').pop();
        return filename.endsWith('.pdf') || filename.endsWith('.txt');
      })
      .map(blob => {
        const filename = blob.pathname.split('/').pop();
        return {
          filename: filename,
          url: blob.url,
          size: blob.size,
          uploadedAt: blob.uploadedAt
        };
      });

    // Also return just the filenames array for backward compatibility
    const files = filesWithUrls.map(f => f.filename);

    console.log(`Returning ${files.length} files`);

    return NextResponse.json({ 
      files: files,
      filesWithUrls: filesWithUrls 
    });
  } catch (error) {
    console.log('Error listing files from Blob storage:', error);
    return NextResponse.json({ files: [], filesWithUrls: [] });
  }
}