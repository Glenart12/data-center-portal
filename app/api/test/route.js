import { NextResponse } from 'next/server';
import { existsSync } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const directories = ['mops', 'sops', 'eops'];
    const status = {};
    
    for (const dir of directories) {
      const fullPath = path.join(process.cwd(), 'public', dir);
      status[dir] = {
        exists: existsSync(fullPath),
        path: fullPath
      };
    }
    
    return NextResponse.json({
      message: 'API is working!',
      directories: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}