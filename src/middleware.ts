import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard/:path*"]);

export default clerkMiddleware(async (auth, req) => {
  // Log incoming requests for debugging
  console.log(`Middleware triggered for: ${req.url}`);

  if (isProtectedRoute(req)) {
    try {
      console.log("Protected route detected, checking authentication...");
      await auth.protect();
      console.log("Authentication successful.");
    } catch (error) {
      console.error("Authentication error:", error);

      // Redirect unauthenticated users to the sign-in page
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/trpc/:path*"], // Specify relevant paths only
};
