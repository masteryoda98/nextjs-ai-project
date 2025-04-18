import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = loginSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.format() }, { status: 400 })
    }

    const { email, password } = validation.data

    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Admin login auth error:", error.message)
      return NextResponse.json({ error: "Authentication failed", details: error.message }, { status: 401 })
    }

    if (!data.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if the user is an admin
    const { data: userData, error: userError } = await supabase
      .from("creatoramp_users")
      .select("role")
      .eq("id", data.user.id)
      .single()

    if (userError) {
      console.error("Admin role check error:", userError.message)
      // Sign out the user if there was an error checking their role
      await supabase.auth.signOut()

      return NextResponse.json({ error: "Error verifying admin status", details: userError.message }, { status: 500 })
    }

    if (!userData || userData.role !== "ADMIN") {
      // Sign out the user if they're not an admin
      await supabase.auth.signOut()

      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 })
    }

    // Successfully authenticated as admin
    return NextResponse.json({
      success: true,
      message: "Admin login successful",
      redirectTo: "/admin",
    })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
