import { auth } from '@/auth';
import { NextResponse } from 'next/server';
export default auth((request) => {
  const session = request.auth;
  if (!session)
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(request.nextUrl.pathname)}`, request.url),
    );
  if (request.nextUrl.pathname.startsWith('/admin') && session.user.role !== 'admin')
    return NextResponse.redirect(new URL('/forbidden', request.url));
  return NextResponse.next();
});
export const config = { matcher: ['/loans/:path*', '/admin/:path*'] };
