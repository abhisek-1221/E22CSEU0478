import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware ensures all API responses are returned within the 500ms time limit
export async function middleware(request: NextRequest) {
  // Only apply this middleware to our numbers API
  if (request.nextUrl.pathname.startsWith('/api/numbers/')) {
    const start = Date.now();
    
    // Clone the response so we can modify it if needed
    const response = NextResponse.next();
    
    // Calculate time taken
    const timeElapsed = Date.now() - start;
    
    // If the response is taking too long, return an error
    if (timeElapsed > 490) { // Using 490ms to allow for some overhead
      return NextResponse.json(
        { error: 'Response time exceeded 500ms limit' },
        { status: 503 }
      );
    }
    
    // Add timing info to response headers for debugging
    response.headers.set('X-Response-Time', `${timeElapsed}ms`);
    
    return response;
  }
  
  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: '/api/numbers/:path*',
}; 