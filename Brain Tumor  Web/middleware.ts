import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';
import { jwtVerify } from 'jose'; // Use jose instead of jsonwebtoken in edge middleware

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key';
const TOKEN_COOKIE_NAME = 'auth_token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  let isValid = false;
  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      isValid = true;
    } catch (e) {
      isValid = false;
    }
  }

  // Protected Routes: Dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!isValid) {
      const url = request.nextUrl.clone();
      url.pathname = '/platform';
      return NextResponse.redirect(url);
    }
  }

  // Public Auth Route: Platform
  if (pathname === '/platform') {
    if (isValid) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/platform'],
};
