import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const supabase = createRouteHandlerClient({ cookies })

    // Get the campaign details
    const { data: campaign, error: campaignError } = await supabase.from("campaigns").select("*").eq("id", id).single()

    if (campaignError) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json({ campaign })
  } catch (error) {
    console.error("Error fetching campaign:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const formData = await request.formData()
    const supabase = createRouteHandlerClient({ cookies })

    // Get user info
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create application
    const { data, error } = await supabase
      .from("applications")
      .insert({
        campaign_id: id,
        user_id: user.id,
        status: "PENDING",
        // Add other fields from formData as needed
      })
      .select()

    if (error) {
      console.error("Error creating application:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, application: data[0] })
  } catch (error) {
    console.error("Error submitting application:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
