import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { type } = params;
    
    if (!['mops', 'sops', 'eops'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const directory = path.join(process.cwd(), 'public', type);
    const filenames = await fs.readdir(directory);
    
    // Include both PDF and TXT files
    const allowedFiles = filenames.filter(name => 
      name.endsWith('.pdf') || name.endsWith('.txt')
    );

    return NextResponse.json({ files: allowedFiles });
  } catch (error) {
    console.log('Directory not found or empty');
    return NextResponse.json({ files: [] });
  }
}