"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLoginTest() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userDetails, setUserDetails] = useState<any>(null)

  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      // Try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setResult({ success: false, message: error.message })
        return
      }

      // Successfully signed in, now check if user has admin role
      const { data: userData, error: userError } = await supabase
        .from("creatoramp_users")
        .select("role")
        .eq("email", email)
        .single()

      if (userError) {
        setResult({
          success: false,
          message: `Authentication successful but couldn't verify admin role: ${userError.message}`,
          user: data.user,
        })
        return
      }

      setUserDetails(userData)

      if (userData.role === "ADMIN") {
        setResult({
          success: true,
          message: "Successfully authenticated as admin!",
          user: data.user,
          userData,
        })
      } else {
        setResult({
          success: false,
          message: `User authenticated but does not have admin role. Current role: ${userData.role}`,
          user: data.user,
          userData,
        })
      }
    } catch (err) {
      setResult({ success: false, message: `Unexpected error: ${err}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login Test</CardTitle>
        </CardHeader>
        <CardContent>
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

          {result && (
            <div className={`mt-4 p-4 rounded ${result.success ? "bg-green-100" : "bg-red-100"}`}>
              <p className="font-medium">{result.success ? "Success!" : "Error:"}</p>
              <p>{result.message}</p>
              {result.user && (
                <div className="mt-2">
                  <p className="font-medium">User Info:</p>
                  <pre className="text-xs mt-1 bg-gray-50 p-2 rounded overflow-auto">
                    {JSON.stringify(result.user, null, 2)}
                  </pre>
                </div>
              )}
              {userDetails && (
                <div className="mt-2">
                  <p className="font-medium">User Details:</p>
                  <pre className="text-xs mt-1 bg-gray-50 p-2 rounded overflow-auto">
                    {JSON.stringify(userDetails, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
