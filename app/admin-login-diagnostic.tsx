"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminLoginDiagnostic() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [diagnosticResults, setDiagnosticResults] = useState<any[]>([])
  const [currentSession, setCurrentSession] = useState<any>(null)

  const supabase = createClientComponentClient()

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      setCurrentSession(data.session)

      if (data.session) {
        addDiagnosticResult("info", "Found existing session", data.session)
      } else {
        addDiagnosticResult("warning", "No existing session found", null)
      }
    }

    checkSession()
  }, [])

  const addDiagnosticResult = (type: "success" | "error" | "info" | "warning", message: string, data: any = null) => {
    setDiagnosticResults((prev) => [
      ...prev,
      {
        type,
        message,
        data,
        timestamp: new Date().toISOString(),
      },
    ])
  }

  const runFullDiagnostic = async () => {
    setLoading(true)
    setDiagnosticResults([])

    try {
      // Step 1: Check Supabase connection
      addDiagnosticResult("info", "Starting diagnostic...", null)

      try {
        const { error: pingError } = await supabase
          .from("creatoramp_users")
          .select("count", { count: "exact", head: true })

        if (pingError) {
          addDiagnosticResult("error", "Failed to connect to Supabase", pingError)
        } else {
          addDiagnosticResult("success", "Successfully connected to Supabase", null)
        }
      } catch (e) {
        addDiagnosticResult("error", "Exception when connecting to Supabase", e)
      }

      // Step 2: Check current auth state
      const { data: sessionData } = await supabase.auth.getSession()

      if (sessionData.session) {
        addDiagnosticResult("info", "User is currently logged in", {
          user: sessionData.session.user,
        })

        // Check if user has admin role
        try {
          const { data: userData, error: userError } = await supabase
            .from("creatoramp_users")
            .select("role")
            .eq("email", sessionData.session.user.email)
            .single()

          if (userError) {
            addDiagnosticResult("error", "Failed to fetch user role", userError)
          } else if (userData.role === "ADMIN") {
            addDiagnosticResult("success", "User has ADMIN role", userData)
          } else {
            addDiagnosticResult("warning", `User does not have ADMIN role. Current role: ${userData.role}`, userData)
          }
        } catch (e) {
          addDiagnosticResult("error", "Exception when checking user role", e)
        }
      } else {
        addDiagnosticResult("info", "No active session found", null)
      }
    } catch (e) {
      addDiagnosticResult("error", "Unexpected error during diagnostic", e)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      addDiagnosticResult("info", `Attempting to login with email: ${email}`, null)

      // Step 1: Try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        addDiagnosticResult("error", "Authentication failed", error)
        return
      }

      addDiagnosticResult("success", "Authentication successful", {
        user: data.user,
      })
      setCurrentSession(data.session)

      // Step 2: Check if user has admin role
      try {
        const { data: userData, error: userError } = await supabase
          .from("creatoramp_users")
          .select("role")
          .eq("email", email)
          .single()

        if (userError) {
          addDiagnosticResult("error", "Failed to fetch user role", userError)
        } else if (userData.role === "ADMIN") {
          addDiagnosticResult("success", "User has ADMIN role", userData)
        } else {
          addDiagnosticResult("warning", `User does not have ADMIN role. Current role: ${userData.role}`, userData)
        }
      } catch (e) {
        addDiagnosticResult("error", "Exception when checking user role", e)
      }
    } catch (e) {
      addDiagnosticResult("error", "Unexpected error during login", e)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      addDiagnosticResult("info", "Attempting to log out", null)
      const { error } = await supabase.auth.signOut()

      if (error) {
        addDiagnosticResult("error", "Logout failed", error)
      } else {
        addDiagnosticResult("success", "Successfully logged out", null)
        setCurrentSession(null)
      }
    } catch (e) {
      addDiagnosticResult("error", "Exception during logout", e)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Admin Login Diagnostic Tool</CardTitle>
          <CardDescription>This tool helps diagnose issues with the admin login process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Current Session Status</h3>
              {currentSession ? (
                <Alert className="bg-green-50">
                  <AlertTitle>Logged In</AlertTitle>
                  <AlertDescription>
                    Logged in as: {currentSession.user.email}
                    <Button variant="outline" size="sm" onClick={handleLogout} className="ml-4">
                      Log Out
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-amber-50">
                  <AlertTitle>Not Logged In</AlertTitle>
                  <AlertDescription>No active session detected</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Login Test</h3>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Testing Login..." : "Test Login"}
                  </Button>
                </form>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">System Diagnostic</h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Run a full diagnostic to check Supabase connection and authentication status
                  </p>
                  <Button onClick={runFullDiagnostic} className="w-full" disabled={loading} variant="outline">
                    {loading ? "Running Diagnostic..." : "Run Full Diagnostic"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Diagnostic Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto p-2">
            {diagnosticResults.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No diagnostic results yet. Run a test or diagnostic above.
              </p>
            ) : (
              diagnosticResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-md ${
                    result.type === "success"
                      ? "bg-green-50"
                      : result.type === "error"
                        ? "bg-red-50"
                        : result.type === "warning"
                          ? "bg-amber-50"
                          : "bg-blue-50"
                  }`}
                >
                  <div className="flex justify-between">
                    <h4
                      className={`font-medium ${
                        result.type === "success"
                          ? "text-green-700"
                          : result.type === "error"
                            ? "text-red-700"
                            : result.type === "warning"
                              ? "text-amber-700"
                              : "text-blue-700"
                      }`}
                    >
                      {result.type.toUpperCase()}
                    </h4>
                    <span className="text-xs text-gray-500">{new Date(result.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="mt-1">{result.message}</p>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-sm cursor-pointer">View Details</summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
