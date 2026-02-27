import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1. Run next-intl routing logic and generate the localized response
  const response = intlMiddleware(request);

  // 2. Attach Supabase auth logic and session cookies to this response
  return await updateSession(request, response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
