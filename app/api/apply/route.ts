import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      full_name,
      email,
      phone_number,
      tiktok_handle,
      follower_count,
      content_niche,
      reason,
      portfolio_link,
      userId,
    } = body

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 401 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // First, check if the user exists
    const { data: existingUser, error: userCheckError } = await supabase
      .from("creatoramp_users")
      .select("id")
      .eq("id", userId)
      .single()

    if (userCheckError || !existingUser) {
      console.error("User not found:", userCheckError)
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Create the creator_applications record directly
    const { data: application, error: applicationError } = await supabase
      .from("creator_applications")
      .insert({
        user_id: userId,
        full_name,
        email,
        phone_number,
        tiktok_handle,
        follower_count: Number.parseInt(follower_count),
        content_niche,
        reason,
        portfolio_link: portfolio_link || null,
        status: "PENDING",
      })
      .select()
      .single()

    if (applicationError) {
      console.error("Error creating application:", applicationError)
      return NextResponse.json(
        {
          message: "Failed to create application",
          details: applicationError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      application,
    })
  } catch (error) {
    console.error("Error processing application:", error)
    return NextResponse.json(
      {
        message: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
