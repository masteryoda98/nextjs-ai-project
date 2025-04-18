import { NextResponse } from "next/server"
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

export async function POST(request: Request) {
  try {
    const { amount, description, metadata } = await request.json()

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Get access token
    const accessToken = await generateAccessToken()

    // Get app URL from environment
    const appUrl = getEnv("NEXT_PUBLIC_APP_URL", "https://creatoramp.com")

    // Create order
    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toFixed(2),
            },
            description: description || "CreatorAmp Campaign Funding",
            custom_id: metadata ? JSON.stringify(metadata) : undefined,
          },
        ],
        application_context: {
          brand_name: "CreatorAmp",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: `${appUrl}/dashboard/artist/payment-success`,
          cancel_url: `${appUrl}/dashboard/artist/payment-cancel`,
        },
      }),
    })

    const data = await response.json()

    if (data.error) {
      console.error("PayPal API error:", data)
      return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating PayPal order:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
