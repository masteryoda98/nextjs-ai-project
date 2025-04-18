"use client"

import { useState } from "react"
import { Filter, Music, DollarSign, Clock, Heart } from "lucide-react"

import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreatorCampaignsPage() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  return (
    <DashboardLayout userType="creator">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Browse Campaigns</h1>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input placeholder="Search campaigns..." />
          </div>
          <div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="dance">Dance</SelectItem>
                <SelectItem value="lip-sync">Lip Sync</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="challenge">Challenge</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="budget-high">Budget: High to Low</SelectItem>
                <SelectItem value="budget-low">Budget: Low to High</SelectItem>
                <SelectItem value="deadline">Deadline: Soonest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="available">
          <TabsList>
            <TabsTrigger value="available">Available (15)</TabsTrigger>
            <TabsTrigger value="applied">Applied (3)</TabsTrigger>
            <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Card key={i} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Campaign {i + 1}
                          {i % 3 === 0 && <Badge className="ml-2 bg-amber-500">New</Badge>}
                        </CardTitle>
                        <CardDescription>Posted {i + 1} days ago</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(i)}
                        className={favorites.includes(i) ? "text-red-500" : ""}
                      >
                        <Heart className="h-4 w-4" fill={favorites.includes(i) ? "currentColor" : "none"} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Music className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {["Pop", "Hip Hop", "EDM", "Rock", "R&B", "Indie"][i % 6]} Music
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {["Dance", "Lip Sync", "Lifestyle", "Review", "Challenge"][i % 5]}
                          </Badge>
                          <Badge variant="outline">{["15s", "30s", "60s"][i % 3]} Video</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        Looking for creators to promote a new {["single", "album", "EP", "music video"][i % 4]} with
                        creative {["dance", "lip sync", "lifestyle", "review", "challenge"][i % 5]} content.
                      </p>
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">${(i + 2) * 10}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Due in {i + 3} days</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className="w-full">Apply Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Button variant="outline">Load More</Button>
            </div>
          </TabsContent>

          <TabsContent value="applied" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Applied Campaign {i + 1}</CardTitle>
                        <CardDescription>Applied on {new Date(2025, 2, 20 - i).toLocaleDateString()}</CardDescription>
                      </div>
                      <Badge>Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Music className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{["Pop", "Hip Hop", "EDM"][i % 3]} Music</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{["Dance", "Lip Sync", "Lifestyle"][i % 3]}</Badge>
                          <Badge variant="outline">{["15s", "30s", "60s"][i % 3]} Video</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        You've applied to create content for this campaign. Waiting for artist approval.
                      </p>
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">${(i + 3) * 10}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Applied {i + 1} days ago</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full">
                      View Application
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((id) => (
                  <Card key={id} className="flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Campaign {id + 1}</CardTitle>
                          <CardDescription>Posted {id + 1} days ago</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(id)} className="text-red-500">
                          <Heart className="h-4 w-4" fill="currentColor" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Music className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {["Pop", "Hip Hop", "EDM", "Rock", "R&B", "Indie"][id % 6]} Music
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {["Dance", "Lip Sync", "Lifestyle", "Review", "Challenge"][id % 5]}
                            </Badge>
                            <Badge variant="outline">{["15s", "30s", "60s"][id % 3]} Video</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          Looking for creators to promote a new {["single", "album", "EP", "music video"][id % 4]} with
                          creative {["dance", "lip sync", "lifestyle", "review", "challenge"][id % 5]} content.
                        </p>
                        <div className="flex justify-between items-center pt-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">${(id + 2) * 10}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Due in {id + 3} days</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button className="w-full">Apply Now</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No favorites yet</h3>
                <p className="text-muted-foreground mt-1">
                  Click the heart icon on campaigns you're interested in to save them here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
