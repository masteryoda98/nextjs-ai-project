import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const formData = await request.formData()
    const email = String(formData.get("email") || "")
    const password = String(formData.get("password") || "")
    const name = String(formData.get("name") || "")

    // Validate inputs
    if (!email || !password || !name) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Get Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Attempt signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: "CREATOR",
        },
        emailRedirectTo: `${requestUrl.origin}/verify-email`,
      },
    })

    if (error) {
      console.error("Signup error:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 },
      )
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Verification email sent",
      user: data.user ? { id: data.user.id } : null,
    })
  } catch (error) {
    console.error("Unexpected error during signup:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
