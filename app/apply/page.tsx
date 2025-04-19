"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const formSchema = z.object({
  socialMediaLink: z.string().url({
    message: "Please enter a valid URL.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
})

export default function ApplyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get("id")
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      socialMediaLink: "",
      description: "",
    },
  })

  useEffect(() => {
    async function fetchCampaign() {
      if (!campaignId) {
        setError("No campaign ID provided")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/apply/${campaignId}`)

        // Check if response is OK
        if (!response.ok) {
          throw new Error(`Failed to fetch campaign: ${response.status}`)
        }

        // Check content type
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned non-JSON response")
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setCampaign(data.campaign)
      } catch (error) {
        console.error("Error fetching campaign:", error)
        setError(error instanceof Error ? error.message : "Failed to load campaign")
      } finally {
        setLoading(false)
      }
    }

    fetchCampaign()
  }, [campaignId])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!campaignId) {
      toast({
        title: "Error",
        description: "No campaign ID provided",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to apply for this campaign",
          variant: "destructive",
        })
        router.push(`/login?redirect=/apply?id=${campaignId}`)
        return
      }

      // Create form data
      const formData = new FormData()
      formData.append("socialMediaLink", values.socialMediaLink)
      formData.append("description", values.description)

      // Submit application
      const response = await fetch(`/api/apply/${campaignId}`, {
        method: "POST",
        body: formData,
      })

      // Check if response is OK
      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Server error: ${response.status}`)
        } else {
          throw new Error(`Server error: ${response.status}`)
        }
      }

      // Check content type
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully",
      })

      router.push("/dashboard/creator")
    } catch (error) {
      console.error("Error submitting application:", error)
      setError(error instanceof Error ? error.message : "Failed to submit application")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Campaign not found</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Apply for Campaign: {campaign.title}</h1>

      <div className="bg-gray-50 p-4 rounded mb-6">
        <h2 className="font-semibold mb-2">Campaign Details</h2>
        <p className="mb-2">{campaign.description}</p>
        <p className="text-sm text-gray-500">Budget: ${campaign.budget}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="socialMediaLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Social Media Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://tiktok.com/@yourusername" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Why are you a good fit for this campaign?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your audience and why you'd be a good fit..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting application...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
