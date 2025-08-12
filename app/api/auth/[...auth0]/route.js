import { handleAuth } from '@auth0/nextjs-auth0';

// Create the auth handler
const handler = handleAuth();

// Wrap handlers to properly await params in Next.js 15
export async function GET(request, context) {
  // Await params to ensure proper async handling
  const params = await context.params;
  return handler(request, { params });
}

export async function POST(request, context) {
  // Await params to ensure proper async handling
  const params = await context.params;
  return handler(request, { params });
}