import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Simple path-based middleware
    // Real auth check happens in client side context for Phase 2
    // or via checking __session cookie if we implement server-side session management later.

    const protectedRoutes = ["/dashboard"];
    const isProtected = protectedRoutes.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isProtected) {
        // Ideally verify cookie here. For Phase 2, we rely on the Client Component wrapper
        // and this placeholder simply ensures we aren't completely open if we adding static pages.
        // Without a token, we can't truly protect via middleware yet.
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
