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

    console.log("Received application data:", {
      full_name,
      email,
      phone_number,
      tiktok_handle,
      follower_count,
      content_niche,
      reason,
      portfolio_link,
      userId,
    })

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

    if (userCheckError) {
      console.error("Error checking user:", userCheckError)
      return NextResponse.json(
        {
          message: "Error checking user",
          details: userCheckError.message,
        },
        { status: 500 },
      )
    }

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Store application data directly in the database
    try {
      // First, try to create a simple applications table if it doesn't exist
      const { error: createTableError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS public.creator_applications (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone_number TEXT NOT NULL,
            tiktok_handle TEXT NOT NULL,
            follower_count INTEGER NOT NULL,
            content_niche TEXT NOT NULL,
            reason TEXT NOT NULL,
            portfolio_link TEXT,
            status TEXT NOT NULL DEFAULT 'PENDING',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );
        `,
      })

      if (createTableError) {
        console.error("Error creating applications table:", createTableError)
      }

      // Try to insert the application
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
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (applicationError) {
        console.error("Error creating application:", applicationError)

        // As a last resort, just store the data in a JSON field in the user's record
        const { error: updateUserError } = await supabase
          .from("creatoramp_users")
          .update({
            application_data: {
              full_name,
              email,
              phone_number,
              tiktok_handle,
              follower_count: Number.parseInt(follower_count),
              content_niche,
              reason,
              portfolio_link: portfolio_link || null,
              status: "PENDING",
              created_at: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        if (updateUserError) {
          console.error("Error updating user with application data:", updateUserError)
          return NextResponse.json(
            {
              message: "Failed to store application data",
              details: updateUserError.message,
            },
            { status: 500 },
          )
        }

        return NextResponse.json({
          success: true,
          message: "Application data stored in user profile",
        })
      }

      return NextResponse.json({
        success: true,
        message: "Application submitted successfully",
        application,
      })
    } catch (error) {
      console.error("Error in application creation:", error)
      return NextResponse.json(
        {
          message: "Failed to create application",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      )
    }
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
