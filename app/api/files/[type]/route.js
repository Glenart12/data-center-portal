import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { type } = params;
    
    if (!['mops', 'sops', 'eops'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    console.log(`Listing files for type: ${type}`);
    console.log('BLOB_READ_WRITE_TOKEN exists:', !!process.env.BLOB_READ_WRITE_TOKEN);

    // Try to list from Blob storage
    let blobFiles = [];
    let blobError = null;
    
    try {
      // List with more specific options
      const listResult = await list({
        prefix: `${type}/`,
        limit: 1000,
        token: process.env.BLOB_READ_WRITE_TOKEN // Explicitly pass token
      });
      
      const blobs = listResult.blobs || [];
      console.log(`Found ${blobs.length} blobs in storage for ${type}`);
      
      blobFiles = blobs
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
            uploadedAt: blob.uploadedAt,
            source: 'blob'
          };
        });
        
      console.log(`Filtered to ${blobFiles.length} PDF/TXT files from blob`);
    } catch (error) {
      blobError = error;
      console.error('Error accessing Blob storage:', error.message);
      console.error('Error details:', error);
      
      // Try alternate list method without prefix
      try {
        console.log('Trying to list all blobs without prefix...');
        const allBlobsResult = await list({
          token: process.env.BLOB_READ_WRITE_TOKEN
        });
        
        const allBlobs = allBlobsResult.blobs || [];
        console.log(`Found ${allBlobs.length} total blobs`);
        
        // Manually filter by type
        blobFiles = allBlobs
          .filter(blob => blob.pathname.startsWith(`${type}/`))
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
              uploadedAt: blob.uploadedAt,
              source: 'blob'
            };
          });
          
        console.log(`Filtered to ${blobFiles.length} ${type} files from all blobs`);
      } catch (fallbackError) {
        console.error('Fallback list also failed:', fallbackError.message);
      }
    }

    // Also check local files as fallback
    let localFiles = [];
    try {
      const directory = path.join(process.cwd(), 'public', type);
      const filenames = await fs.readdir(directory);
      
      localFiles = filenames
        .filter(name => name.endsWith('.pdf') || name.endsWith('.txt'))
        .map(filename => ({
          filename: filename,
          url: `/${type}/${filename}`,
          size: 0,
          uploadedAt: new Date().toISOString(),
          source: 'local'
        }));
      
      console.log(`Found ${localFiles.length} local files`);
    } catch (localError) {
      console.log('No local files found:', localError.message);
    }

    // Combine both sources
    const allFiles = [...blobFiles];
    const blobFilenames = new Set(blobFiles.map(f => f.filename));
    
    // Add local files that aren't in blob storage
    localFiles.forEach(localFile => {
      if (!blobFilenames.has(localFile.filename)) {
        allFiles.push(localFile);
      }
    });

    console.log(`Total files found: ${allFiles.length}`);

    // Return in the expected format
    const files = allFiles.map(f => f.filename);
    
    return NextResponse.json({ 
      files: files,
      filesWithUrls: allFiles,
      debug: {
        blobCount: blobFiles.length,
        localCount: localFiles.length,
        totalCount: allFiles.length,
        tokenExists: !!process.env.BLOB_READ_WRITE_TOKEN,
        blobError: blobError ? blobError.message : null
      }
    });
  } catch (error) {
    console.error('Error in files API:', error);
    return NextResponse.json({ 
      files: [], 
      filesWithUrls: [],
      error: error.message,
      tokenExists: !!process.env.BLOB_READ_WRITE_TOKEN
    });
  }
}