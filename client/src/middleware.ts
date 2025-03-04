import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get('token');
  
  // If user is logged in and trying to access login or register pages, redirect to dashboard
  if (token && request.nextUrl.pathname.match(/^\/(login|register)$/)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If user is not logged in and trying to access dashboard routes, redirect to login
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Add config to specify which paths to run middleware on
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register']
} 