"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupDiagnosticPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [diagnosticResults, setDiagnosticResults] = useState<Record<string, any>>({})
  const [testEmail, setTestEmail] = useState("")
  const [testPassword, setTestPassword] = useState("")
  const [signupResult, setSignupResult] = useState<any>(null)
  const [signupError, setSignupError] = useState<string | null>(null)
  const [isTestingSignup, setIsTestingSignup] = useState(false)
  const [useCustomEmail, setUseCustomEmail] = useState(false)
  const [customEmail, setCustomEmail] = useState("")
  const [customPassword, setCustomPassword] = useState("")

  // Generate random test credentials with realistic domain
  useEffect(() => {
    const randomString = Math.random().toString(36).substring(2, 10)
    // Using gmail.com which is more likely to pass validation
    setTestEmail(`test.user.${randomString}@gmail.com`)
    setTestPassword(`Password${randomString}!`)
    setCustomEmail(`test.user.${randomString}@gmail.com`)
    setCustomPassword(`Password${randomString}!`)
  }, [])

  // Run diagnostics on component mount
  useEffect(() => {
    async function runDiagnostics() {
      setIsLoading(true)
      const results: Record<string, any> = {}

      try {
        // Check environment
        results.environment = process.env.NODE_ENV
        results.isProduction = process.env.NODE_ENV === "production"

        // Check Supabase public URL
        results.supabasePublicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set"

        // Check if Supabase anon key is set (don't log the actual key)
        results.supabaseAnonKeySet = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        // Check browser capabilities
        results.localStorage = typeof window !== "undefined" && !!window.localStorage
        results.sessionStorage = typeof window !== "undefined" && !!window.sessionStorage
        results.cookies = typeof document !== "undefined" && !!document.cookie

        // Check network connectivity
        try {
          const response = await fetch("/api/health")
          results.apiConnectivity = {
            status: response.status,
            ok: response.ok,
          }
        } catch (error: any) {
          results.apiConnectivity = {
            error: error.message,
          }
        }

        // Check Supabase connectivity
        try {
          const supabase = createClientComponentClient()
          const { data, error } = await supabase.auth.getSession()
          results.supabaseConnectivity = {
            success: !error,
            error: error ? error.message : null,
            hasSession: !!data.session,
          }
        } catch (error: any) {
          results.supabaseConnectivity = {
            error: error.message,
          }
        }
      } catch (error: any) {
        results.error = error.message
      } finally {
        setDiagnosticResults(results)
        setIsLoading(false)
      }
    }

    runDiagnostics()
  }, [])

  // Test signup functionality
  const testSignup = async () => {
    setIsTestingSignup(true)
    setSignupResult(null)
    setSignupError(null)

    try {
      const emailToUse = useCustomEmail ? customEmail : testEmail
      const passwordToUse = useCustomEmail ? customPassword : testPassword

      console.log(`Testing signup with email: ${emailToUse}`)
      const supabase = createClientComponentClient()

      // First check if the user already exists
      const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: passwordToUse,
      })

      if (existingUser?.user) {
        console.log("User already exists, using existing account for test")
        setSignupResult({
          user: existingUser.user,
          message: "Used existing account (this email was already registered)",
        })
        setIsTestingSignup(false)
        return
      }

      // Try to create a new user
      const { data, error } = await supabase.auth.signUp({
        email: emailToUse,
        password: passwordToUse,
        options: {
          data: {
            name: "Test User",
            role: "CREATOR",
          },
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      })

      if (error) {
        console.error("Test signup error:", error)
        setSignupError(error.message)

        // Provide helpful suggestions based on common errors
        if (error.message.includes("invalid")) {
          setSignupError(`${error.message}. Try using a real email domain like gmail.com or outlook.com.`)
        }
      } else {
        console.log("Test signup successful:", data)
        setSignupResult(data)
      }
    } catch (error: any) {
      console.error("Unexpected error during test signup:", error)
      setSignupError(error.message)
    } finally {
      setIsTestingSignup(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Signup Diagnostic Tool</h1>
      <p className="mb-6 text-muted-foreground">
        This tool helps diagnose issues with the signup process in different environments.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Environment Diagnostics</CardTitle>
            <CardDescription>Information about the current environment and configuration</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[400px] text-sm">
                {JSON.stringify(diagnosticResults, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Signup</CardTitle>
            <CardDescription>Test the signup functionality with temporary credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useCustomEmail"
                  checked={useCustomEmail}
                  onChange={(e) => setUseCustomEmail(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="useCustomEmail">Use custom credentials</Label>
              </div>

              {useCustomEmail ? (
                <>
                  <div>
                    <Label htmlFor="customEmail" className="block text-sm font-medium mb-1">
                      Custom Email
                    </Label>
                    <Input
                      id="customEmail"
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full"
                      placeholder="user@gmail.com"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use a real email domain like gmail.com or outlook.com
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="customPassword" className="block text-sm font-medium mb-1">
                      Custom Password
                    </Label>
                    <Input
                      id="customPassword"
                      type="text"
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      className="w-full"
                      placeholder="Password must be at least 8 characters"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="testEmail" className="block text-sm font-medium mb-1">
                      Test Email
                    </Label>
                    <Input id="testEmail" type="email" value={testEmail} className="w-full" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="testPassword" className="block text-sm font-medium mb-1">
                      Test Password
                    </Label>
                    <Input id="testPassword" type="text" value={testPassword} className="w-full" readOnly />
                  </div>
                </>
              )}

              <Button onClick={testSignup} disabled={isTestingSignup} className="w-full">
                {isTestingSignup ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing Signup...
                  </>
                ) : (
                  "Test Signup Process"
                )}
              </Button>

              {signupError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
                  <p className="font-medium">Error:</p>
                  <p>{signupError}</p>
                </div>
              )}

              {signupResult && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md">
                  <p className="font-medium">Success!</p>
                  {signupResult.message ? (
                    <p>{signupResult.message}</p>
                  ) : (
                    <p>User created successfully. Check email for verification link.</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            This will create a temporary test user that you can delete later.
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Common Issues & Solutions</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Invalid Email Error</h3>
            <p>
              Supabase rejects emails with domains like example.com. Use real domains like gmail.com or outlook.com.
            </p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Missing Environment Variables</h3>
            <p>Ensure all required environment variables are set in your production environment.</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">CORS Issues</h3>
            <p>Check Supabase project settings to ensure your production domain is allowed in CORS settings.</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium">Authentication Settings</h3>
            <p>Verify that email signup is enabled in your Supabase Authentication settings.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
