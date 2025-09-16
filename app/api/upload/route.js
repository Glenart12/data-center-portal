import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// Handle client-side direct uploads (for large PDFs)
export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type');

    // Check if this is a client upload request (JSON) or form data upload
    if (contentType && contentType.includes('application/json')) {
      // This is a client-side upload token request
      console.log('Client upload token request received');

      const body = await request.json();

      const jsonResponse = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async (pathname) => {
          // Validate and configure the upload
          console.log('Preparing client upload for:', pathname);

          return {
            allowedContentTypes: ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            maximumSizeInBytes: 50 * 1024 * 1024, // 50MB limit
            tokenPayload: JSON.stringify({
              uploadedAt: new Date().toISOString(),
            }),
          };
        },
        onUploadCompleted: async ({ blob, tokenPayload }) => {
          // Log successful upload
          console.log('Client upload completed:', blob.pathname);
          console.log('Blob URL:', blob.url);
        },
      });

      return NextResponse.json(jsonResponse);
    } else {
      // This is a legacy form data upload (for MOPs, SOPs, EOPs)
      console.log('Legacy upload request received');

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

      // Sanitize filename
      const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      console.log('Sanitized filename:', filename);

      // Upload to Vercel Blob Storage
      console.log(`Uploading to Blob storage: ${type}/${filename}`);

      const blob = await put(filename, buffer, {
        access: 'public',
        contentType: file.type,
        // Store in appropriate folder
        pathname: `${type}/${filename}`
      });

      console.log('File uploaded successfully to Blob storage');
      console.log('Blob URL:', blob.url);

      return NextResponse.json({
        message: 'File uploaded successfully',
        filename: filename,
        path: `/${type}/${filename}`,
        url: blob.url
      });
    }
  } catch (error) {
    console.error('Upload error:', error);

    return NextResponse.json({
      error: error.message || 'Upload failed',
      details: error.toString()
    }, { status: 500 });
  }
}