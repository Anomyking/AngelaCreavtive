import { NextRequest, NextResponse } from "next/server";
import { createServerClient }        from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  // Pass pathname through to layouts via header — so admin layout can skip auth on /admin/login
  const response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });
  response.headers.set("x-pathname", request.nextUrl.pathname);

  // Skip Supabase auth for admin routes — admin uses its own cookie-based auth
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return response;
  }

  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL    ?? "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !anon) return response;

  try {
    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => list.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        }),
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    // Protect /checkout (except success page)
    if (request.nextUrl.pathname.startsWith("/checkout") &&
        !request.nextUrl.pathname.startsWith("/checkout/success") && !user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", "/checkout");
      return NextResponse.redirect(loginUrl);
    }

    // Protect /account
    if (request.nextUrl.pathname.startsWith("/account") && !user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch { /* skip if Supabase not configured */ }

  return response;
}

export const config = {
  // Run on all routes so pathname header is set everywhere
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

