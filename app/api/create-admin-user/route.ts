import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const password = formData.get("password") as string

    if (!email || !name || !password) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Step 1: Check table structure to determine correct column names
    const { data: sampleRow, error: sampleError } = await supabase.from("creatoramp_users").select("*").limit(1)

    let userColumns: Record<string, any> = {}

    if (!sampleError && sampleRow && sampleRow.length > 0) {
      // We have a sample user, so we know the column names
      const columnNames = Object.keys(sampleRow[0])

      // Map our data to the correct column names
      if (columnNames.includes("email")) {
        userColumns = {
          email: email,
          name: name,
          role: "ADMIN",
        }
      } else {
        // Try to find email-like and name-like columns
        const emailColumn = columnNames.find(
          (col) => col.toLowerCase().includes("email") || col.toLowerCase().includes("mail"),
        )

        const nameColumn = columnNames.find(
          (col) => col.toLowerCase().includes("name") || col.toLowerCase().includes("user"),
        )

        const roleColumn = columnNames.find(
          (col) =>
            col.toLowerCase().includes("role") ||
            col.toLowerCase().includes("type") ||
            col.toLowerCase().includes("permission"),
        )

        if (emailColumn && nameColumn) {
          userColumns = {
            [emailColumn]: email,
            [nameColumn]: name,
          }

          if (roleColumn) {
            userColumns = {
              ...userColumns,
              [roleColumn]: "ADMIN",
            }
          }
        } else {
          return NextResponse.json(
            {
              error: "Could not determine the correct column names for email and name",
              columns: columnNames,
            },
            { status: 500 },
          )
        }
      }
    } else {
      // No existing users or can't access table, use default column names
      userColumns = {
        email: email,
        name: name,
        role: "ADMIN",
      }
    }

    // Step 2: Create the auth user
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

    // Step 3: Add the user to the creatoramp_users table with ADMIN role
    const { error: insertError } = await supabase.from("creatoramp_users").insert([userColumns])

    if (insertError) {
      return NextResponse.json(
        {
          error: "Database error",
          details: insertError.message,
          attemptedColumns: userColumns,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
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
