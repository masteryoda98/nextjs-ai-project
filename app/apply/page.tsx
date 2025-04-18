"use client"
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CheckCircle2, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Define form validation schema
const applicationSchema = z.object({
  full_name: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone_number: z.string().min(10, { message: "Please enter a valid phone number" }),
  tiktok_handle: z.string().min(2, { message: "TikTok handle must be at least 2 characters" }),
  follower_count: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Follower count must be a positive number",
  }),
  content_niche: z.string().min(2, { message: "Content niche must be at least 2 characters" }),
  reason: z.string().min(20, { message: "Please provide more details about why you want to join" }),
  portfolio_link: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
})

type ApplicationFormValues = z.infer<typeof applicationSchema>

export default function CreatorApplyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const supabase = createClientComponentClient()

  // Initialize form with validation
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      full_name: "",
      email: email || "",
      phone_number: "",
      tiktok_handle: "",
      follower_count: "",
      content_niche: "",
      reason: "",
      portfolio_link: "",
    },
  })

  // If user is logged in, pre-fill the form with their data
  useEffect(() => {
    async function loadUserData() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Get user profile data
          const { data: userData, error } = await supabase
            .from("creatoramp_users")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (!error && userData) {
            // Pre-fill the form with user data
            form.setValue("full_name", userData.name)
            form.setValue("email", userData.email)
            form.setValue("phone_number", userData.phone || "")
            form.setValue("tiktok_handle", userData.tiktok_handle || "")
            form.setValue("follower_count", userData.follower_count?.toString() || "")
            form.setValue("content_niche", userData.content_niche || "")
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setInitialLoading(false)
      }
    }

    loadUserData()
  }, [form, supabase])

  const onSubmit = async (values: ApplicationFormValues) => {
    setLoading(true)

    try {
      // Check if user is logged in
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const userId = session?.user?.id

      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          userId, // Include user ID if available
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        toast({
          title: "Application submitted",
          description: "We'll review your application and get back to you soon.",
        })
      } else {
        const error = await res.json()
        throw new Error(error.message || "Failed to submit application")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (submitted) {
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
          <Card className="w-full max-w-xl text-center">
            <CardHeader>
              <CheckCircle2 className="mx-auto text-green-500" size={48} />
              <CardTitle className="text-2xl mt-4">Application Submitted</CardTitle>
              <CardDescription>Thanks for applying to join CreatorAmp!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our team will review your application and get back to you within 2-3 business days.
              </p>
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tiktok_handle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TikTok Handle</FormLabel>
                      <FormControl>
                        <Input placeholder="@username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="follower_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Follower Count</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content_niche"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Niche</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dance, Comedy, Lifestyle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why Do You Want to Join?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us why you're interested in promoting music on TikTok"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="portfolio_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Portfolio / TikTok Link (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://tiktok.com/@yourusername" {...field} />
                      </FormControl>
                      <FormDescription>Provide a link to your TikTok profile or portfolio</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading} className="w-full mt-6">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
