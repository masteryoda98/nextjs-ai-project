"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CreateAdminAccountFKFix() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [tiktokHandle, setTiktokHandle] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [tableInfo, setTableInfo] = useState<any>(null)

  const supabase = createClientComponentClient()

  // Get table information on component mount
  useEffect(() => {
    const getTableInfo = async () => {
      try {
        // Get foreign key information
        const { data, error } = await supabase.rpc("get_foreign_keys", {
          table_name: "creatoramp_users",
        })

        if (error) {
          console.error("Error getting foreign keys:", error)
          // Try to get a sample row instead
          const { data: sampleData, error: sampleError } = await supabase.from("creatoramp_users").select("*").limit(1)

          if (!sampleError && sampleData && sampleData.length > 0) {
            setTableInfo({
              sample_row: sampleData[0],
              message: "Retrieved sample row data",
            })
          }
        } else {
          setTableInfo({
            foreign_keys: data,
            message: "Retrieved foreign key information",
          })
        }
      } catch (err) {
        console.error("Error in getTableInfo:", err)
      }
    }

    getTableInfo()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    setDebugInfo(null)

    try {
      // Step 1: Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        setError(`Auth error: ${authError.message}`)
        return
      }

      if (!authData.user) {
        setError("Failed to create user account")
        return
      }

      // Step 2: Use the auth user's ID as the ID for the creatoramp_users table
      // This is likely what the foreign key constraint is expecting
      const { error: insertError } = await supabase.from("creatoramp_users").insert([
        {
          id: authData.user.id, // Use the auth user's ID
          name: name,
          role: "ADMIN",
          phone: phone || null,
          tiktok_handle: tiktokHandle || null,
          is_active: true,
        },
      ])

      if (insertError) {
        setError(`Database error: ${insertError.message}`)
        setDebugInfo({
          message: "Insert failed",
          error: insertError,
          attempted_insert: {
            id: authData.user.id,
            name: name,
            role: "ADMIN",
            phone: phone || null,
            tiktok_handle: tiktokHandle || null,
            is_active: true,
          },
        })
        return
      }

      setSuccess(
        "Admin account created successfully! You can now log in. Note: Your email is stored in the authentication system but not in the users table.",
      )

      // Clear the form
      setName("")
      setEmail("")
      setTiktokHandle("")
      setPhone("")
      setPassword("")
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Account creation error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Admin Account</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Create a new administrator account (Fixed for foreign key constraint)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-900 border-red-800 text-red-200">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-900 border-green-800 text-green-200">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {debugInfo && (
            <div className="mb-4 p-3 bg-blue-900 border border-blue-800 rounded-md text-blue-200 text-sm">
              <p className="font-medium">Debug Information:</p>
              <pre className="mt-2 overflow-auto text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}

          {tableInfo && (
            <div className="mb-4 p-3 bg-blue-900 border border-blue-800 rounded-md text-blue-200 text-sm">
              <p className="font-medium">Table Information:</p>
              <pre className="mt-2 overflow-auto text-xs">{JSON.stringify(tableInfo, null, 2)}</pre>
            </div>
          )}

          <div className="mb-4 p-3 bg-blue-900 border border-blue-800 rounded-md text-blue-200 text-sm">
            <p className="font-medium">Important Note:</p>
            <p className="mt-1">
              This form addresses the foreign key constraint by using the auth user's ID as the ID for the
              creatoramp_users table. Your database doesn't have an email column in the creatoramp_users table. The
              email will be stored in the authentication system, but not in the users table.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Admin User"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email (Auth System Only)
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tiktokHandle" className="text-sm font-medium text-gray-300">
                TikTok Handle (Optional)
              </label>
              <Input
                id="tiktokHandle"
                type="text"
                placeholder="@username"
                value={tiktokHandle}
                onChange={(e) => setTiktokHandle(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-300">
                Phone (Optional)
              </label>
              <Input
                id="phone"
                type="text"
                placeholder="+1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
              {loading ? "Creating Account..." : "Create Admin Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">This form addresses the foreign key constraint issue</p>
        </CardFooter>
      </Card>
    </div>
  )
}
