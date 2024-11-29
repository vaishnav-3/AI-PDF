import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher(["/dashboard/:path*"]);

export default clerkMiddleware(async (auth, req) => {
  console.log(`Middleware triggered for: ${req.url}`);

  if (isProtectedRoute(req)) {
    try {
      console.log("Protected route detected. Checking authentication...");
      await auth.protect();
    } catch (error) {
      console.error("Authentication error:", error);

      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/trpc/:path*"],
};
