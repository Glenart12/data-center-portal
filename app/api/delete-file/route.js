import { del, list } from '@vercel/blob';
import { unlink } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { existsSync } from 'fs';

export async function DELETE(request) {
  try {
    const { filename, type } = await request.json();

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    if (!type || !['mops', 'sops', 'eops'].includes(type)) {
      return NextResponse.json({ error: 'Valid type is required' }, { status: 400 });
    }

    console.log(`Attempting to delete: ${filename} from ${type}`);

    // Try to delete from Blob storage first
    let blobDeleted = false;
    try {
      // First, check if the file exists in Blob storage
      const { blobs } = await list({
        token: process.env.BLOB_READ_WRITE_TOKEN
      });

      // Find the blob that matches our filename
      const blobToDelete = blobs.find(blob => 
        blob.pathname === filename || 
        blob.pathname === `${type}/${filename}` ||
        blob.pathname.endsWith(filename)
      );

      if (blobToDelete) {
        // Delete using the blob's URL
        await del(blobToDelete.url, {
          token: process.env.BLOB_READ_WRITE_TOKEN
        });
        blobDeleted = true;
        console.log('Deleted from Blob storage:', blobToDelete.url);
      }
    } catch (blobError) {
      console.error('Blob deletion error:', blobError);
    }

    // Try to delete from local file system (for files in public folder)
    let localDeleted = false;
    try {
      const localPath = path.join(process.cwd(), 'public', type, filename);
      if (existsSync(localPath)) {
        await unlink(localPath);
        localDeleted = true;
        console.log('Deleted from local storage:', localPath);
      }
    } catch (localError) {
      console.error('Local deletion error:', localError);
    }

    // If file was deleted from either location, consider it a success
    if (blobDeleted || localDeleted) {
      return NextResponse.json({ 
        message: 'File deleted successfully',
        deletedFrom: {
          blob: blobDeleted,
          local: localDeleted
        }
      });
    } else {
      return NextResponse.json({ error: 'File not found in any storage location' }, { status: 404 });
    }

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete file', 
      details: error.message 
    }, { status: 500 });
  }
}