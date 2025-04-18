import DashboardLayoutNew from "@/components/dashboard-layout-new"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { CreditCard, ShoppingCartIcon as Paypal, DollarSign, Save, User, Bell } from "lucide-react"

export default function CreatorSettings() {
  return (
    <DashboardLayoutNew userType="creator">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <Tabs defaultValue="payment" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage how you receive payments from campaigns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup defaultValue="paypal" className="space-y-4">
                  <div className="flex items-center space-x-4 rounded-lg border p-4">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex flex-1 items-center gap-4 cursor-pointer">
                      <Paypal className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-muted-foreground">Get paid directly to your PayPal account</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-4 rounded-lg border p-4">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex flex-1 items-center gap-4 cursor-pointer">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Bank Transfer</p>
                        <p className="text-sm text-muted-foreground">Get paid directly to your bank account</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-4 rounded-lg border p-4">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex flex-1 items-center gap-4 cursor-pointer">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Debit Card</p>
                        <p className="text-sm text-muted-foreground">Get paid directly to your debit card</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">PayPal Details</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="paypal-email">PayPal Email</Label>
                    <Input id="paypal-email" placeholder="your-email@example.com" />
                  </div>
                </div>

                <div className="space-y-4 hidden">
                  <h3 className="font-medium">Bank Account Details</h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="account-name">Account Holder Name</Label>
                        <Input id="account-name" placeholder="John Doe" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="account-number">Account Number</Label>
                        <Input id="account-number" placeholder="XXXXXXXXXXXX" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="routing-number">Routing Number</Label>
                        <Input id="routing-number" placeholder="XXXXXXXXX" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="bank-name">Bank Name</Label>
                        <Input id="bank-name" placeholder="Bank of America" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 hidden">
                  <h3 className="font-medium">Debit Card Details</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="card-name">Name on Card</Label>
                      <Input id="card-name" placeholder="John Doe" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="XXXX XXXX XXXX XXXX" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="XXX" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Payment Method
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View your recent payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">June 15, 2023</p>
                      <p className="text-sm text-muted-foreground">PayPal - your-email@example.com</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$150.00</p>
                      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        COMPLETED
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">May 22, 2023</p>
                      <p className="text-sm text-muted-foreground">PayPal - your-email@example.com</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$120.00</p>
                      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        COMPLETED
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">April 10, 2023</p>
                      <p className="text-sm text-muted-foreground">PayPal - your-email@example.com</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$150.00</p>
                      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        COMPLETED
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your creator profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src="/placeholder.svg?height=100&width=100"
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                    <Button size="sm" className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0">
                      <User className="h-4 w-4" />
                      <span className="sr-only">Change profile picture</span>
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Alex Johnson</h3>
                    <p className="text-sm text-muted-foreground">TikTok Creator</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="display-name">Display Name</Label>
                      <Input id="display-name" defaultValue="Alex Johnson" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="username">TikTok Username</Label>
                      <Input id="username" defaultValue="@alexjohnson" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" defaultValue="Dance creator specializing in hip-hop and contemporary styles." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="content-niche">Content Niche</Label>
                      <Input id="content-niche" defaultValue="Dance" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="follower-count">Follower Count</Label>
                      <Input id="follower-count" defaultValue="25000" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Profile
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-campaigns" className="flex flex-col gap-1">
                        <span>New Campaign Opportunities</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Get notified when new campaigns match your profile
                        </span>
                      </Label>
                      <Switch id="email-campaigns" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-submissions" className="flex flex-col gap-1">
                        <span>Submission Status Updates</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Get notified when your submissions are approved or rejected
                        </span>
                      </Label>
                      <Switch id="email-submissions" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-payments" className="flex flex-col gap-1">
                        <span>Payment Notifications</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Get notified when you receive a payment
                        </span>
                      </Label>
                      <Switch id="email-payments" defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Push Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-campaigns" className="flex flex-col gap-1">
                        <span>New Campaign Opportunities</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Get notified when new campaigns match your profile
                        </span>
                      </Label>
                      <Switch id="push-campaigns" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-submissions" className="flex flex-col gap-1">
                        <span>Submission Status Updates</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Get notified when your submissions are approved or rejected
                        </span>
                      </Label>
                      <Switch id="push-submissions" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-payments" className="flex flex-col gap-1">
                        <span>Payment Notifications</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Get notified when you receive a payment
                        </span>
                      </Label>
                      <Switch id="push-payments" defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Marketing Communications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing-news" className="flex flex-col gap-1">
                        <span>Platform Updates & News</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Receive updates about new features and platform news
                        </span>
                      </Label>
                      <Switch id="marketing-news" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing-tips" className="flex flex-col gap-1">
                        <span>Creator Tips & Resources</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Receive tips and resources to help you succeed as a creator
                        </span>
                      </Label>
                      <Switch id="marketing-tips" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="gap-2">
                  <Bell className="h-4 w-4" />
                  Save Notification Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutNew>
  )
}
