import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getEnv } from "@/lib/env"

// PayPal API base URL (sandbox or live)
const PAYPAL_API_URL =
  process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

// Generate an access token for PayPal API
async function generateAccessToken() {
  const clientId = getEnv("PAYPAL_CLIENT_ID")
  const clientSecret = getEnv("PAYPAL_CLIENT_SECRET")

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

// Verify webhook signature
async function verifyWebhookSignature(
  body: string,
  headers: {
    "paypal-auth-algo": string
    "paypal-cert-url": string
    "paypal-transmission-id": string
    "paypal-transmission-sig": string
    "paypal-transmission-time": string
  },
) {
  const accessToken = await generateAccessToken()

  const response = await fetch(`${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      auth_algo: headers["paypal-auth-algo"],
      cert_url: headers["paypal-cert-url"],
      transmission_id: headers["paypal-transmission-id"],
      transmission_sig: headers["paypal-transmission-sig"],
      transmission_time: headers["paypal-transmission-time"],
      webhook_id: getEnv("PAYPAL_WEBHOOK_ID"),
      webhook_event: JSON.parse(body),
    }),
  })

  const data = await response.json()
  return data.verification_status === "SUCCESS"
}

export async function POST(request: Request) {
  try {
    // Get the request body as text
    const bodyText = await request.text()

    // Get required headers
    const headers = {
      "paypal-auth-algo": request.headers.get("paypal-auth-algo") || "",
      "paypal-cert-url": request.headers.get("paypal-cert-url") || "",
      "paypal-transmission-id": request.headers.get("paypal-transmission-id") || "",
      "paypal-transmission-sig": request.headers.get("paypal-transmission-sig") || "",
      "paypal-transmission-time": request.headers.get("paypal-transmission-time") || "",
    }

    // Verify webhook signature in production
    if (process.env.NODE_ENV === "production") {
      const isValid = await verifyWebhookSignature(bodyText, headers)

      if (!isValid) {
        console.error("Invalid PayPal webhook signature")
        return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 401 })
      }
    }

    // Parse the webhook payload
    const event = JSON.parse(bodyText)

    // Handle different event types
    switch (event.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED": {
        // Payment was captured successfully
        const paymentId = event.resource.id
        const customId = event.resource.custom_id

        // If we have custom data (campaign info), process it
        if (customId) {
          try {
            const metadata = JSON.parse(customId)

            if (metadata.campaignData) {
              const campaignData = JSON.parse(metadata.campaignData)
              const supabase = createServerClient()

              // Create the campaign
              const { data: campaign, error } = await supabase
                .from("campaigns")
                .insert({
                  artist_id: campaignData.artistId,
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
              } else {
                // Create a payment record
                await supabase.from("payments").insert({
                  user_id: campaignData.artistId,
                  amount: campaignData.budget,
                  status: "COMPLETED",
                  description: `Funding for campaign: ${campaignData.name}`,
                  transaction_id: paymentId,
                  completed_at: new Date().toISOString(),
                })
              }
            }
          } catch (error) {
            console.error("Error processing campaign data:", error)
          }
        }

        break
      }

      case "PAYMENT.CAPTURE.DENIED":
      case "PAYMENT.CAPTURE.REFUNDED": {
        // Payment was denied or refunded
        // Update payment status in database
        const paymentId = event.resource.id

        const supabase = createServerClient()
        await supabase
          .from("payments")
          .update({
            status: event.event_type === "PAYMENT.CAPTURE.DENIED" ? "FAILED" : "REFUNDED",
          })
          .eq("transaction_id", paymentId)

        break
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PayPal webhook error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
