import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only apply to /api routes
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  try {
    // Continue to the API route
    return NextResponse.next()
  } catch (error) {
    // Ensure we always return a valid JSON response even if an error occurs
    console.error("API middleware caught error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export const config = {
  matcher: "/api/:path*",
}
