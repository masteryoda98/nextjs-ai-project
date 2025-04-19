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

    // First, update the user profile with the provided information
    const { error: userUpdateError } = await supabase
      .from("creatoramp_users")
      .update({
        name: full_name,
        email,
        phone: phone_number,
        tiktok_handle,
        follower_count: Number.parseInt(follower_count),
        content_niche,
        portfolio_url: portfolio_link || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (userUpdateError) {
      console.error("Error updating user profile:", userUpdateError)
      return NextResponse.json({ message: "Failed to update user profile" }, { status: 500 })
    }

    // Then, create an application record
    const { data: application, error: applicationError } = await supabase
      .from("applications")
      .insert({
        user_id: userId,
        status: "PENDING",
        reason,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (applicationError) {
      console.error("Error creating application:", applicationError)
      return NextResponse.json({ message: "Failed to create application" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      application,
    })
  } catch (error) {
    console.error("Error processing application:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
