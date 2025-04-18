"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Music, TrendingUp, Users, MessageSquare, ArrowLeft } from "lucide-react"
import { Logo } from "@/components/logo"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ArtistPortal() {
  const router = useRouter()
  const { toast } = useToast()
  const [artistId, setArtistId] = useState<string | null>(null)
  const [artistName, setArtistName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [feedbackText, setFeedbackText] = useState("")

  // In a real app, you'd fetch the artist ID from authentication
  useEffect(() => {
    // Simulate authentication
    setTimeout(() => {
      setArtistId("00000000-0000-0000-0000-000000000002")
      setArtistName("J. Smith")
      setLoading(false)
    }, 1000)
  }, [])

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Feedback submitted",
      description: "Thank you for your feedback. Our team will review it shortly.",
    })
    setFeedbackText("")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading artist portal...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-sm text-muted-foreground">Artist Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Artist profile" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <span className="font-medium">{artistName}</span>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Welcome, {artistName}</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                <Music className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Creators Engaged</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+8 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Content Submissions</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">+3 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estimated Views</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">35K+</div>
                <p className="text-xs text-muted-foreground">Based on creator reach</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="campaigns">
            <TabsList>
              <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
              <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
              <TabsTrigger value="feedback">Provide Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                  <CardDescription>Overview of your active campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Summer Vibes EP</span>
                          <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-600">
                            Active
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">$200 / $300</span>
                      </div>
                      <Progress value={66} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>5 creators engaged</span>
                        <span>66% of budget used</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">New Single Promotion</span>
                          <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-600">
                            Active
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">$150 / $200</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>4 creators engaged</span>
                        <span>75% of budget used</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Music Video Teaser</span>
                          <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-600">
                            Active
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">$70 / $100</span>
                      </div>
                      <Progress value={70} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>3 creators engaged</span>
                        <span>70% of budget used</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="submissions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Submissions</CardTitle>
                  <CardDescription>Latest content from creators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Creator" />
                        <AvatarFallback>SD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">@sarahdances</p>
                          <Badge className="bg-green-500">Approved</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Summer Vibes EP Promotion</p>
                        <p className="text-sm">Dance video featuring the Summer Vibes EP main track</p>
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open("https://tiktok.com/@sarahdances/video/123456", "_blank")}
                          >
                            View Content
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Creator" />
                        <AvatarFallback>AV</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">@alexvibes</p>
                          <Badge className="bg-blue-500">Needs Revision</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">New Single "Midnight" Promotion</p>
                        <p className="text-sm">Lifestyle video featuring the new single "Midnight"</p>
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open("https://tiktok.com/@alexvibes/video/234567", "_blank")}
                          >
                            View Content
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Creator" />
                        <AvatarFallback>JB</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">@jessb</p>
                          <Badge className="bg-amber-500">Pending Review</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Summer Vibes EP Promotion</p>
                        <p className="text-sm">Comedy skit featuring the Summer Vibes EP</p>
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open("https://tiktok.com/@jessb/video/345678", "_blank")}
                          >
                            View Content
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Provide Feedback</CardTitle>
                  <CardDescription>Share your thoughts with the CreatorAmp team</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="feedback" className="text-sm font-medium">
                        Your Feedback
                      </label>
                      <Textarea
                        id="feedback"
                        placeholder="Share your thoughts, suggestions, or concerns..."
                        className="min-h-[150px]"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={!feedbackText.trim()}>
                        Submit Feedback
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
