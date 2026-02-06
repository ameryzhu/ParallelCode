import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'zh'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(',').map((lang) => lang.split(';')[0].trim().substring(0, 2));
    const matched = preferred.find((lang) => locales.includes(lang));
    if (matched) return matched;
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes - never add locale prefix to /api/*
  // This is critical for OAuth callbacks (e.g., /api/auth/callback/google)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip Next.js internal routes and static files
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to the locale-prefixed path
  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  // Matcher excludes api routes, Next.js internals, and static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
