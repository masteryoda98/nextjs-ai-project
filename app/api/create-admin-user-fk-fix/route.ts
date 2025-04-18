import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const password = formData.get("password") as string
    const tiktokHandle = formData.get("tiktok_handle") as string | null
    const phone = formData.get("phone") as string | null

    if (!email || !name || !password) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Step 1: Create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      return NextResponse.json(
        {
          error: "Authentication error",
          details: authError.message,
        },
        { status: 500 },
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        {
          error: "Failed to create user account",
        },
        { status: 500 },
      )
    }

    // Step 2: Add the user to the creatoramp_users table with ADMIN role
    // Use the auth user's ID as the ID for the creatoramp_users table
    const { error: insertError } = await supabase.from("creatoramp_users").insert([
      {
        id: authData.user.id, // Use the auth user's ID
        name: name,
        role: "ADMIN",
        phone: phone || null,
        tiktok_handle: tiktokHandle || null,
        is_active: true,
      },
    ])

    if (insertError) {
      // If insert fails, try to clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id)

      return NextResponse.json(
        {
          error: "Database error",
          details: insertError.message,
          attempted_insert: {
            id: authData.user.id,
            name,
            role: "ADMIN",
            phone,
            tiktok_handle: tiktokHandle,
            is_active: true,
          },
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
      user_id: authData.user.id,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: String(error),
      },
      { status: 500 },
    )
  }
}
