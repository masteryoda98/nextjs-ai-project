// Environment variable validation
const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
  "PAYPAL_CLIENT_ID",
  "PAYPAL_CLIENT_SECRET",
  "NEXT_PUBLIC_APP_URL",
  "EMAIL_SERVER_HOST",
  "EMAIL_SERVER_PORT",
  "EMAIL_SERVER_USER",
  "EMAIL_SERVER_PASSWORD",
  "EMAIL_FROM",
]

// Check if required environment variables are present
export function validateEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = []

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  }
}

// Get environment variable with type safety
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key]

  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new Error(`Environment variable ${key} is not defined`)
  }

  return value
}

// Get boolean environment variable
export function getBoolEnv(key: string, defaultValue?: boolean): boolean {
  const value = process.env[key]

  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new Error(`Environment variable ${key} is not defined`)
  }

  return value.toLowerCase() === "true"
}

// Get number environment variable
export function getNumEnv(key: string, defaultValue?: number): number {
  const value = process.env[key]

  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new Error(`Environment variable ${key} is not defined`)
  }

  const num = Number(value)

  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} is not a number`)
  }

  return num
}
