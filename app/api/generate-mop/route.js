import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  try {
    const { content, filename } = await request.json();

    if (!content || !filename) {
      return NextResponse.json({ error: 'Missing content or filename' }, { status: 400 });
    }

    // Create a safe filename
    const safeFilename = `${filename}_mop.txt`;
    const filepath = path.join(process.cwd(), 'public', 'mops', safeFilename);

    // Write the file
    await writeFile(filepath, content, 'utf8');

    return NextResponse.json({ 
      message: 'MOP created successfully',
      filename: safeFilename 
    });
  } catch (error) {
    console.error('MOP creation error:', error);
    return NextResponse.json({ error: 'Failed to create MOP' }, { status: 500 });
  }
}