import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DeploymentTestPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Deployment Test Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Health Check</CardTitle>
            <CardDescription>Test the basic API functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Click the button below to test the API health endpoint.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/api/health" target="_blank">
                Test API Health
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Connection Test</CardTitle>
            <CardDescription>Test the Supabase database connection</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Click the button below to test the database connection.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/api/db-test" target="_blank">
                Test Database
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Configuration Test</CardTitle>
            <CardDescription>Test the email configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Click the button below to test the email configuration.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/api/email-test" target="_blank">
                Test Email Config
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6">
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}
