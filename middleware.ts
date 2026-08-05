import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Aapka auth ya redirect logic
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/inbox/:path*', '/ask/:path*', '/reports/:path*'],
};