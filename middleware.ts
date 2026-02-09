import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const data = JSON.parse(Buffer.from(session.value, 'base64').toString());
    if (data.expires < Date.now()) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session');
      return response;
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
