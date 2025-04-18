import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

// PayPal API base URL (sandbox or live)
const PAYPAL_API_URL =
  process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

// Generate an access token for PayPal API
async function generateAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be defined")
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  const data = await response.json()
  return data.access_token
}

export async function POST(request: Request) {
  try {
    const { orderId, metadata } = await request.json()

    // Validate input
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Get access token
    const accessToken = await generateAccessToken()

    // Capture order
    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()

    if (data.error) {
      console.error("PayPal API error:", data)
      return NextResponse.json({ error: "Failed to capture PayPal order" }, { status: 500 })
    }

    // If we have campaign metadata, create the campaign in the database
    if (metadata && metadata.campaignData) {
      try {
        const campaignData = JSON.parse(metadata.campaignData)
        const supabase = createServerClient()

        // Get the current user
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          return NextResponse.json({ error: "Authentication required" }, { status: 401 })
        }

        // Create the campaign
        const { data: campaign, error } = await supabase
          .from("campaigns")
          .insert({
            artist_id: session.user.id,
            name: campaignData.name,
            description: campaignData.description,
            music_link: campaignData.musicLink,
            budget: campaignData.budget,
            remaining_budget: campaignData.budget,
            content_type: campaignData.contentType,
            content_requirements: campaignData.contentRequirements,
            target_followers: campaignData.targetFollowers,
            status: "ACTIVE",
          })
          .select("id")
          .single()

        if (error) {
          console.error("Error creating campaign:", error)
          // We still return success since the payment was successful
        } else {
          // Create a payment record
          await supabase.from("payments").insert({
            user_id: session.user.id,
            amount: campaignData.budget,
            status: "COMPLETED",
            description: `Funding for campaign: ${campaignData.name}`,
            transaction_id: data.id,
            completed_at: new Date().toISOString(),
          })
        }
      } catch (error) {
        console.error("Error processing campaign data:", error)
        // We still return success since the payment was successful
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error capturing PayPal order:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
