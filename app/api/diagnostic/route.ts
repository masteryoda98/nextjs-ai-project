import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    diagnosticResults: {},
  }

  // Check environment variables
  diagnostics.diagnosticResults.environmentVariables = {
    status: "checking",
    details: {},
  }

  const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "PAYPAL_CLIENT_ID",
    "PAYPAL_CLIENT_SECRET",
    "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
    "NEXT_PUBLIC_APP_URL",
  ]

  const missingEnvVars = []
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar]
    diagnostics.diagnosticResults.environmentVariables.details[envVar] = {
      exists: !!value,
      // Don't expose actual values for security
      value: value ? "[REDACTED]" : undefined,
    }

    if (!value) {
      missingEnvVars.push(envVar)
    }
  }

  diagnostics.diagnosticResults.environmentVariables.status = missingEnvVars.length === 0 ? "pass" : "fail"
  diagnostics.diagnosticResults.environmentVariables.missingVars = missingEnvVars

  // Check database connection
  diagnostics.diagnosticResults.databaseConnection = {
    status: "checking",
  }

  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("campaigns").select("count").limit(1)

    if (error) {
      diagnostics.diagnosticResults.databaseConnection = {
        status: "fail",
        error: error.message,
      }
    } else {
      diagnostics.diagnosticResults.databaseConnection = {
        status: "pass",
        message: "Successfully connected to database",
      }
    }
  } catch (error) {
    diagnostics.diagnosticResults.databaseConnection = {
      status: "fail",
      error: error instanceof Error ? error.message : String(error),
    }
  }

  // Check PayPal API configuration
  diagnostics.diagnosticResults.paypalConfiguration = {
    status: "checking",
  }

  try {
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      diagnostics.diagnosticResults.paypalConfiguration = {
        status: "fail",
        error: "Missing PayPal credentials",
      }
    } else {
      // Test PayPal API access by getting an access token
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
      const apiUrl =
        process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

      const response = await fetch(`${apiUrl}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      })

      const data = await response.json()

      if (data.error) {
        diagnostics.diagnosticResults.paypalConfiguration = {
          status: "fail",
          error: data.error_description || "Failed to authenticate with PayPal",
        }
      } else {
        diagnostics.diagnosticResults.paypalConfiguration = {
          status: "pass",
          message: "Successfully authenticated with PayPal",
        }
      }
    }
  } catch (error) {
    diagnostics.diagnosticResults.paypalConfiguration = {
      status: "fail",
      error: error instanceof Error ? error.message : String(error),
    }
  }

  // Check for package.json issues
  diagnostics.diagnosticResults.packageJson = {
    status: "checking",
  }

  try {
    // This is a simple check - in a real scenario we'd do more validation
    const packageJson = require("../../../package.json")

    const requiredDependencies = ["next", "react", "react-dom", "@supabase/supabase-js"]

    const missingDeps = requiredDependencies.filter((dep) => !packageJson.dependencies[dep])

    if (missingDeps.length > 0) {
      diagnostics.diagnosticResults.packageJson = {
        status: "fail",
        error: `Missing required dependencies: ${missingDeps.join(", ")}`,
      }
    } else {
      diagnostics.diagnosticResults.packageJson = {
        status: "pass",
        message: "All required dependencies found",
      }
    }
  } catch (error) {
    diagnostics.diagnosticResults.packageJson = {
      status: "fail",
      error: error instanceof Error ? error.message : String(error),
    }
  }

  // Overall status
  const allChecks = Object.values(diagnostics.diagnosticResults)
  const failedChecks = allChecks.filter((check) => check.status === "fail")

  diagnostics.overallStatus = failedChecks.length === 0 ? "pass" : "fail"
  diagnostics.failedChecksCount = failedChecks.length

  return NextResponse.json(diagnostics)
}
