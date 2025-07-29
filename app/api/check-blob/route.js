import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing Blob connection...');
    console.log('Token exists:', !!process.env.BLOB_READ_WRITE_TOKEN);
    console.log('Token first 20 chars:', process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 20));
    
    // List ALL blobs without any prefix
    const result = await list({
      limit: 1000
    });
    
    console.log('List result:', result);
    
    const blobs = result.blobs || [];
    
    // Group by folder structure
    const grouped = {};
    const allPaths = [];
    
    blobs.forEach(blob => {
      allPaths.push(blob.pathname);
      
      const parts = blob.pathname.split('/');
      const folder = parts.length > 1 ? parts[0] : 'root';
      
      if (!grouped[folder]) {
        grouped[folder] = [];
      }
      
      grouped[folder].push({
        pathname: blob.pathname,
        url: blob.url,
        downloadUrl: blob.downloadUrl,
        size: blob.size,
        uploadedAt: blob.uploadedAt
      });
    });
    
    // Also try with different prefixes
    const prefixTests = {};
    for (const prefix of ['mops/', 'sops/', 'eops/', 'mops', 'sops', 'eops']) {
      try {
        const prefixResult = await list({ prefix });
        prefixTests[prefix] = {
          count: prefixResult.blobs?.length || 0,
          success: true
        };
      } catch (err) {
        prefixTests[prefix] = {
          count: 0,
          success: false,
          error: err.message
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      tokenExists: !!process.env.BLOB_READ_WRITE_TOKEN,
      tokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length,
      totalBlobs: blobs.length,
      allPathnames: allPaths,
      blobsByFolder: grouped,
      prefixTests: prefixTests,
      hasBlobs: blobs.length > 0,
      firstFewBlobs: blobs.slice(0, 5).map(b => ({
        pathname: b.pathname,
        url: b.url,
        size: b.size
      }))
    });
  } catch (error) {
    console.error('Blob test error:', error);
    return NextResponse.json({
      success: false,
      tokenExists: !!process.env.BLOB_READ_WRITE_TOKEN,
      tokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length,
      error: error.message,
      errorName: error.name,
      errorStack: error.stack
    });
  }
}