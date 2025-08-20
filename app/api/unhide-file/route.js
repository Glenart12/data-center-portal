import { list, put, del } from '@vercel/blob';
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
    
    console.log(`Unhiding file: ${filename} of type: ${type}`);
    
    // List all blobs to find the hidden file
    const result = await list({ 
      limit: 1000,
      token: process.env.BLOB_READ_WRITE_TOKEN 
    });
    const blobs = result.blobs || [];
    
    // Find the hidden blob to unhide
    const hiddenPath = `hidden/${type}/${filename}`;
    const blobToUnhide = blobs.find(blob => {
      return blob.pathname === hiddenPath;
    });
    
    if (!blobToUnhide) {
      return NextResponse.json({ error: 'Hidden file not found' }, { status: 404 });
    }
    
    console.log(`Found hidden blob to unhide: ${blobToUnhide.pathname}`);
    
    // Fetch the content from the hidden blob
    const response = await fetch(blobToUnhide.url);
    if (!response.ok) {
      throw new Error('Failed to fetch blob content');
    }
    const blobContent = await response.blob();
    
    // Determine the original path
    const originalPath = `${type}/${filename}`;
    
    // Upload the content back to the original location
    const copiedBlob = await put(originalPath, blobContent, { 
      access: 'public',
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    
    console.log(`Copied blob back to original location: ${copiedBlob.pathname}`);
    
    // Delete the hidden blob
    await del(blobToUnhide.url, {
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    
    console.log(`Deleted hidden blob: ${blobToUnhide.pathname}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'File unhidden successfully',
      originalPath: copiedBlob.pathname 
    });
    
  } catch (error) {
    console.error('Error unhiding file:', error);
    return NextResponse.json({ 
      error: 'Failed to unhide file', 
      details: error.message 
    }, { status: 500 });
  }
}