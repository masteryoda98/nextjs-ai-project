import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set",
  })
}
