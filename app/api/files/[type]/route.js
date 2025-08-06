import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request, props) {
  try {
    // Await params for Next.js 15
    const params = await props.params;
    const { type } = params;
    
    if (!['mops', 'sops', 'eops'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    console.log(`Listing files for type: ${type}`);

    // Get files from Blob storage
    let blobFiles = [];
    try {
      const result = await list({ limit: 1000 });
      const blobs = result.blobs || [];
      
      console.log(`Found ${blobs.length} total blobs`);
      
      // Debug: Log all blob pathnames for EOPs
      if (type === 'eops') {
        console.log('All blob pathnames:', blobs.map(b => b.pathname));
        const eopBlobs = blobs.filter(blob => {
          const filename = blob.pathname.split('/').pop();
          return filename.startsWith('EOP_') || blob.pathname.startsWith('eops/');
        });
        console.log('Filtered EOP blobs:', eopBlobs.map(b => b.pathname));
      }
      
      // Handle different document types
      if (type === 'mops') {
        blobFiles = blobs
          .filter(blob => {
            const filename = blob.pathname.split('/').pop();
            // Include files that start with MOP_ or are in mops/ folder
            return (filename.startsWith('MOP_') || blob.pathname.startsWith('mops/')) && 
                   (filename.endsWith('.pdf') || filename.endsWith('.txt') || filename.endsWith('.html'));
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
      } else if (type === 'eops') {
        blobFiles = blobs
          .filter(blob => {
            const filename = blob.pathname.split('/').pop();
            // Include files that start with EOP_ or are in eops/ folder
            return (filename.startsWith('EOP_') || blob.pathname.startsWith('eops/')) && 
                   (filename.endsWith('.pdf') || filename.endsWith('.txt') || filename.endsWith('.html'));
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
      } else if (type === 'sops') {
        blobFiles = blobs
          .filter(blob => {
            const filename = blob.pathname.split('/').pop();
            // Include files that start with SOP_ or are in sops/ folder
            return (filename.startsWith('SOP_') || blob.pathname.startsWith('sops/')) && 
                   (filename.endsWith('.pdf') || filename.endsWith('.txt') || filename.endsWith('.html'));
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
      }
      
      console.log(`Found ${blobFiles.length} blob files for ${type}`);
    } catch (error) {
      console.error('Error accessing Blob storage:', error);
    }

    // Get local files
    let localFiles = [];
    try {
      const directory = path.join(process.cwd(), 'public', type);
      const filenames = await fs.readdir(directory);
      
      localFiles = filenames
        .filter(name => name.endsWith('.pdf') || name.endsWith('.txt') || name.endsWith('.html'))
        .map(filename => ({
          filename: filename,
          url: `/${type}/${filename}`,
          size: 0,
          uploadedAt: new Date().toISOString(),
          source: 'local'
        }));
      
      console.log(`Found ${localFiles.length} local files`);
    } catch (error) {
      console.log('No local files found');
    }

    // Combine both sources
    const allFiles = [...blobFiles];
    const blobFilenames = new Set(blobFiles.map(f => f.filename));
    
    localFiles.forEach(localFile => {
      if (!blobFilenames.has(localFile.filename)) {
        allFiles.push(localFile);
      }
    });

    // Sort by upload date (newest first)
    allFiles.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    console.log(`Total files: ${allFiles.length}`);

    return NextResponse.json({ 
      files: allFiles.map(f => f.filename),
      filesWithUrls: allFiles,
      debug: {
        blobCount: blobFiles.length,
        localCount: localFiles.length,
        totalCount: allFiles.length
      }
    });
  } catch (error) {
    console.error('Error in files API:', error);
    return NextResponse.json({ files: [], filesWithUrls: [] });
  }
}