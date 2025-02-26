import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow access to login and register pages without any redirects
  if (request.nextUrl.pathname.match(/\/(login|register)$/)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token');
  
  // Only protect dashboard routes that aren't login/register
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/dashboard/login', request.url));
  }

  return NextResponse.next();
}

// Add config to specify which paths to run middleware on
export const config = {
  matcher: '/dashboard/:path*'
} 