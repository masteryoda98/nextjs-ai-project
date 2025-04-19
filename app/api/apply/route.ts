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

    // Check if the applications table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from("applications")
      .select("id")
      .limit(1)
      .maybeSingle()

    // If the table doesn't exist, create it
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("Applications table doesn't exist, creating it...")

      // Create the applications table
      const { error: createTableError } = await supabase.rpc("create_applications_table")

      if (createTableError) {
        console.error("Error creating applications table:", createTableError)
        return NextResponse.json(
          {
            message: "Error creating applications table",
            details: createTableError.message,
          },
          { status: 500 },
        )
      }
    }

    // Create the application record
    const { data: application, error: applicationError } = await supabase
      .from("applications")
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

      // If the error is due to missing columns, try to update the table schema
      if (applicationError.message.includes("column") && applicationError.message.includes("does not exist")) {
        console.log("Attempting to update applications table schema...")

        // Update the applications table schema
        const { error: updateSchemaError } = await supabase.rpc("update_applications_schema")

        if (updateSchemaError) {
          console.error("Error updating applications schema:", updateSchemaError)
          return NextResponse.json(
            {
              message: "Error updating applications schema",
              details: updateSchemaError.message,
            },
            { status: 500 },
          )
        }

        // Try inserting again after updating the schema
        const { data: retryApplication, error: retryError } = await supabase
          .from("applications")
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

        if (retryError) {
          console.error("Error creating application after schema update:", retryError)
          return NextResponse.json(
            {
              message: "Failed to create application after schema update",
              details: retryError.message,
            },
            { status: 500 },
          )
        }

        return NextResponse.json({
          success: true,
          message: "Application submitted successfully after schema update",
          application: retryApplication,
        })
      }

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
