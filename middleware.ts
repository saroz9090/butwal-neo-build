import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator/i.test(userAgent);

  const pathname = request.nextUrl.pathname;

  // Ensure bot requests to /dang and other pages do not get redirected or intercepted
  if (isBot || pathname.startsWith('/dang') || pathname.startsWith('/projects') || pathname.startsWith('/tools')) {
    // If request has trailing slash, rewrite or allow without redirect loop
    if (pathname.length > 1 && pathname.endsWith('/')) {
      const cleanPath = pathname.slice(0, -1);
      const url = request.nextUrl.clone();
      url.pathname = cleanPath;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
