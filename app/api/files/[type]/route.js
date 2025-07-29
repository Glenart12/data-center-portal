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

    // Try to list from Blob storage first
    let blobFiles = [];
    try {
      const { blobs } = await list({
        prefix: `${type}/`,
      });
      
      console.log(`Found ${blobs.length} blobs in storage`);
      
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
    } catch (blobError) {
      console.error('Error accessing Blob storage:', blobError);
    }

    // Also check local files as fallback (for existing files)
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

    // Combine both sources, preferring blob files
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
        totalCount: allFiles.length
      }
    });
  } catch (error) {
    console.error('Error in files API:', error);
    return NextResponse.json({ 
      files: [], 
      filesWithUrls: [],
      error: error.message 
    });
  }
}