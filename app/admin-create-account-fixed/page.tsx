"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CreateAdminAccountFixed() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const supabase = createClientComponentClient()

  // First, let's check the actual table structure
  const checkTableStructure = async () => {
    setLoading(true)
    setError(null)
    setDebugInfo(null)

    try {
      // Get the table information directly from Postgres
      const { data, error } = await supabase.rpc("get_table_columns", {
        table_name: "creatoramp_users",
      })

      if (error) {
        // If the RPC doesn't exist, try a direct query
        const { data: columns, error: columnsError } = await supabase.from("creatoramp_users").select("*").limit(1)

        if (columnsError) {
          setError(`Failed to get table structure: ${columnsError.message}`)
          return
        }

        // Show the column names from the first row
        if (columns && columns.length > 0) {
          setDebugInfo({
            message: "Retrieved column names from sample row",
            columns: Object.keys(columns[0]),
          })
        } else {
          setDebugInfo({
            message: "Table exists but is empty. Creating first record.",
          })
        }
      } else {
        setDebugInfo({
          message: "Retrieved column information",
          columns: data,
        })
      }
    } catch (err) {
      setError(`Unexpected error checking table: ${err}`)
    } finally {
      setLoading(false)
    }
  }

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

      // Step 2: Try to determine the correct column names first
      const { data: sampleUser, error: sampleError } = await supabase.from("creatoramp_users").select("*").limit(1)

      let userColumns = {}

      if (!sampleError && sampleUser && sampleUser.length > 0) {
        // We have a sample user, so we know the column names
        const columnNames = Object.keys(sampleUser[0])
        setDebugInfo({
          message: "Found existing user with columns",
          columns: columnNames,
        })

        // Map our data to the correct column names
        if (columnNames.includes("email")) {
          userColumns = {
            email: email,
            name: name,
            role: "ADMIN",
          }
        } else {
          // Try to find email-like and name-like columns
          const emailColumn = columnNames.find(
            (col) => col.toLowerCase().includes("email") || col.toLowerCase().includes("mail"),
          )

          const nameColumn = columnNames.find(
            (col) => col.toLowerCase().includes("name") || col.toLowerCase().includes("user"),
          )

          const roleColumn = columnNames.find(
            (col) =>
              col.toLowerCase().includes("role") ||
              col.toLowerCase().includes("type") ||
              col.toLowerCase().includes("permission"),
          )

          if (emailColumn && nameColumn) {
            userColumns = {
              [emailColumn]: email,
              [nameColumn]: name,
            }

            if (roleColumn) {
              userColumns = {
                ...userColumns,
                [roleColumn]: "ADMIN",
              }
            }
          } else {
            setError("Could not determine the correct column names for email and name")
            return
          }
        }
      } else {
        // No existing users, use default column names
        userColumns = {
          email: email,
          name: name,
          role: "ADMIN",
        }
      }

      // Step 3: Add the user to the creatoramp_users table with ADMIN role
      const { error: insertError } = await supabase.from("creatoramp_users").insert([userColumns])

      if (insertError) {
        setError(`Database error: ${insertError.message}`)
        setDebugInfo({
          message: "Insert failed with columns",
          attemptedColumns: userColumns,
          error: insertError,
        })
        return
      }

      setSuccess("Admin account created successfully! You can now log in.")

      // Clear the form
      setName("")
      setEmail("")
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
          <CardDescription className="text-center text-gray-400">Create a new administrator account</CardDescription>
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

          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={checkTableStructure}
              disabled={loading}
              className="text-xs border-gray-600 hover:bg-gray-700"
            >
              Check Table Structure
            </Button>
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
                Email
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
          <p className="text-sm text-gray-400">Use this tool to create a new admin account</p>
        </CardFooter>
      </Card>
    </div>
  )
}
