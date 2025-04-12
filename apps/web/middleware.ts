import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './types/supabase'; // <-- adaptá esto si usás typings distintos

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const user = session.user;
    const isPro = user.user_metadata?.is_professional;
    const role = user.user_metadata?.role;

    const pathname = req.nextUrl.pathname;

    if (
      (isPro || role === 'profesional') &&
      (pathname === '/' || pathname === '/login')
    ) {
      return NextResponse.redirect(new URL('/admin/profile', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/', '/login'],
};
