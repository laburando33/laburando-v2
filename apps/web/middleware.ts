// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl;

  const isLoggedIn = !!session?.user;
  const isLoginPage = url.pathname === "/login";

  const protectedRoutes = ["/admin", "/admin/profile", "/admin/solicitudes"];
  const isProtected = protectedRoutes.some((route) => url.pathname.startsWith(route));

  // 🔐 Si intenta entrar a ruta protegida sin sesión -> redirigimos
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login?msg=auth", req.url));
  }

  // ⛔ Si ya está logueado y va a login, lo mandamos al dashboard
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/login"],
};
