import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // 1. NextAuth session token read karein (secure & non-secure cookie check)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // 2. Protected Routes List
  const protectedRoutes = ['/dashboard', '/inbox', '/ask', '/reports'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // 3. Agar user logged in NAHI hai aur protected route access kar raha hai -> Redirect to /login
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    // User login ke baad wapas usi page par aa sake iske liye callbackUrl add kiya gaya hai
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Agar user pehle se LOGGED IN hai aur /login ya /signup page open kare -> Redirect to /dashboard
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 5. Normal verified requests ko aage proceed hone dein
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/inbox/:path*',
    '/ask/:path*',
    '/reports/:path*',
    '/login',
    '/signup',
  ],
};