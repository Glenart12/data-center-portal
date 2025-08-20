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
    
    console.log(`Unhiding file: ${filename} of type: ${type}`);
    
    // List all blobs to find the hidden file
    const result = await list({ limit: 1000 });
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
    
    // Determine the original path
    const originalPath = `${type}/${filename}`;
    
    // Copy the blob back to the original location
    const copiedBlob = await copy(blobToUnhide.url, { 
      access: 'public',
      addRandomSuffix: false,
      pathname: originalPath
    });
    
    console.log(`Copied blob back to original location: ${copiedBlob.pathname}`);
    
    // Delete the hidden blob
    await del(blobToUnhide.url);
    
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