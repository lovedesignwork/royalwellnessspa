import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';
const localize = createMiddleware(routing);
export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/xadmin')) return updateSession(request);
  return localize(request);
}
export const config = { matcher: ['/', '/xadmin/:path*', '/(th|en)/:path*', '/((?!api|xadmin|_next|_vercel|.*\\..*).*)'] };
