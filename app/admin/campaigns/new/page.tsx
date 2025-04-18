"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function NewCampaignPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("You must be logged in to create a campaign")
        return
      }

      // Insert the new campaign
      const { data, error } = await supabase
        .from("campaigns")
        .insert([
          {
            name,
            description,
            is_active: isActive,
            user_id: user.id,
          },
        ])
        .select()

      if (error) {
        throw error
      }

      setSuccess(true)

      // Reset form
      setName("")
      setDescription("")
      setIsActive(true)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/campaigns")
        router.refresh()
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to create campaign")
      console.error("Error creating campaign:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Campaign</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>Create a new campaign to receive submissions from creators</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Campaign created successfully! Redirecting...</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Summer TikTok Challenge"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the campaign, requirements, and what creators should submit"
                rows={5}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="is-active" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="is-active">Active Campaign</Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Campaign"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
