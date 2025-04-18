import { NextResponse } from "next/server"

// PayPal API base URL (sandbox or live)
const PAYPAL_API_URL =
  process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

export async function GET() {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET
    const publicClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

    const results = {
      status: "checking",
      environment: process.env.NODE_ENV,
      credentials: {
        clientId: clientId ? "present" : "missing",
        clientSecret: clientSecret ? "present" : "missing",
        publicClientId: publicClientId ? "present" : "missing",
      },
      authentication: "not_tested",
    }

    // If credentials are missing, return early
    if (!clientId || !clientSecret) {
      results.status = "fail"
      return NextResponse.json(results)
    }

    // Test authentication with PayPal
    try {
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

      if (data.error) {
        results.authentication = {
          status: "fail",
          error: data.error_description || "Failed to authenticate with PayPal",
        }
        results.status = "fail"
      } else {
        results.authentication = {
          status: "success",
          message: "Successfully authenticated with PayPal",
        }
        results.status = "pass"
      }
    } catch (error) {
      results.authentication = {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
      }
      results.status = "fail"
    }

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
