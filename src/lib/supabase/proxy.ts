import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest, response?: NextResponse) {
  let supabaseResponse = response || NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = response ? supabaseResponse : NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect supervisor dashboard
  if (pathname.match(/^\/(en|ta)?\/?supervisor\/dashboard/) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/\/supervisor\/dashboard.*/, "/supervisor");
    return NextResponse.redirect(url);
  }

  // Protect admin dashboard
  if (pathname.match(/^\/(en|ta)?\/?admin\/dashboard/) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/\/admin\/dashboard.*/, "/admin");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
