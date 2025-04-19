"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Logo } from "@/components/logo"

export default function ApplyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    tiktok_handle: "",
    follower_count: "",
    content_niche: "",
    reason: "",
    portfolio_link: "",
  })
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking auth:", error)
          setIsLoading(false)
          return
        }

        if (!session) {
          toast({
            title: "Login required",
            description: "Please log in to apply as a creator",
          })
          router.push("/login?redirect=/apply")
          return
        }

        setUserId(session.user.id)

        // Fetch user profile data to pre-fill the form
        const { data: userData, error: userError } = await supabase
          .from("creatoramp_users")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (userError) {
          console.error("Error fetching user data:", userError)
        } else if (userData) {
          // Pre-fill the form with user data
          setFormData({
            full_name: userData.name || "",
            email: userData.email || "",
            phone_number: userData.phone || "",
            tiktok_handle: userData.tiktok_handle || "",
            follower_count: userData.follower_count?.toString() || "",
            content_niche: userData.content_niche || "",
            reason: "",
            portfolio_link: userData.portfolio_url || "",
          })
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error in auth check:", error)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, supabase, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      toast({
        title: "Login required",
        description: "Please log in to apply as a creator",
        variant: "destructive",
      })
      router.push("/login?redirect=/apply")
      return
    }

    // Basic validation
    if (
      !formData.full_name ||
      !formData.email ||
      !formData.phone_number ||
      !formData.tiktok_handle ||
      !formData.follower_count ||
      !formData.content_niche ||
      !formData.reason
    ) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      console.log("Submitting application with values:", formData)

      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        let errorMessage = "Failed to submit application"
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
          console.error("Error details:", errorData)
        } catch (e) {
          console.error("Could not parse error response:", e)
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("Application submitted successfully:", data)

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully!",
      })

      router.push("/dashboard/creator")
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40 bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              Back to home
            </Link>
            <CardTitle className="text-2xl font-bold">Apply to Join as a Creator</CardTitle>
            <CardDescription>Fill out this form to apply to become a creator on CreatorAmp</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiktok_handle">TikTok Handle</Label>
                <Input
                  id="tiktok_handle"
                  name="tiktok_handle"
                  placeholder="@username"
                  value={formData.tiktok_handle}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="follower_count">Follower Count</Label>
                <Input
                  id="follower_count"
                  name="follower_count"
                  type="number"
                  value={formData.follower_count}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content_niche">Content Niche</Label>
                <select
                  id="content_niche"
                  name="content_niche"
                  value={formData.content_niche}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select your content niche</option>
                  <option value="Music">Music</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Education">Education</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Why do you want to join?</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  placeholder="Tell us why you want to join our platform and what you can bring to the table..."
                  className="min-h-[120px]"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio_link">Portfolio Link (Optional)</Label>
                <Input
                  id="portfolio_link"
                  name="portfolio_link"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolio_link}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">
                  Share a link to your portfolio, website, or social media profiles.
                </p>
              </div>

              <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
