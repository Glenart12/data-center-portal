import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  try {
    const { content, filename } = await request.json();
    
    if (!content || !filename) {
      return NextResponse.json({ error: 'Content and filename required' }, { status: 400 });
    }

    // Create the file path
    const filePath = path.join(process.cwd(), 'public', 'mops', `${filename}.txt`);
    
    // Write the file
    await writeFile(filePath, content, 'utf8');
    
    return NextResponse.json({ 
      message: 'MOP generated successfully',
      filename: `${filename}.txt`
    });
  } catch (error) {
    console.error('Error generating MOP:', error);
    return NextResponse.json({ error: 'Failed to generate MOP' }, { status: 500 });
  }
}