import { list, copy, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { filename, type } = await request.json();
    
    if (!filename || !type) {
      return NextResponse.json({ error: 'Filename and type are required' }, { status: 400 });
    }
    
    if (!['mops', 'sops', 'eops'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
    
    console.log(`Hiding file: ${filename} of type: ${type}`);
    
    // List all blobs to find the file
    const result = await list({ limit: 1000 });
    const blobs = result.blobs || [];
    
    // Find the blob to hide
    const blobToHide = blobs.find(blob => {
      const blobFilename = blob.pathname.split('/').pop();
      return blobFilename === filename || 
             blob.pathname === `${type}/${filename}` ||
             (blob.pathname === filename && blob.pathname.includes(type));
    });
    
    if (!blobToHide) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    console.log(`Found blob to hide: ${blobToHide.pathname}`);
    
    // Determine the new path in hidden folder
    const hiddenPath = `hidden/${type}/${filename}`;
    
    // Copy the blob to the hidden location
    const copiedBlob = await copy(blobToHide.url, { 
      access: 'public',
      addRandomSuffix: false,
      pathname: hiddenPath
    });
    
    console.log(`Copied blob to hidden location: ${copiedBlob.pathname}`);
    
    // Delete the original blob
    await del(blobToHide.url);
    
    console.log(`Deleted original blob: ${blobToHide.pathname}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'File hidden successfully',
      hiddenPath: copiedBlob.pathname 
    });
    
  } catch (error) {
    console.error('Error hiding file:', error);
    return NextResponse.json({ 
      error: 'Failed to hide file', 
      details: error.message 
    }, { status: 500 });
  }
}