"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function DiagnosticPage() {
  const [diagnosticData, setDiagnosticData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostic = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/diagnostic")

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setDiagnosticData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostic()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "checking":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
        return <Badge className="bg-green-500">Pass</Badge>
      case "fail":
        return <Badge className="bg-red-500">Fail</Badge>
      case "checking":
        return <Badge className="bg-blue-500">Checking</Badge>
      default:
        return <Badge className="bg-yellow-500">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Deployment Diagnostic</h1>

      {loading && !diagnosticData ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-lg">Running diagnostics...</p>
        </div>
      ) : error ? (
        <Card className="mb-6 border-red-300">
          <CardHeader className="bg-red-50 dark:bg-red-900/20">
            <CardTitle className="text-red-700 dark:text-red-300">Diagnostic Error</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={runDiagnostic}>Try Again</Button>
          </CardFooter>
        </Card>
      ) : diagnosticData ? (
        <div className="space-y-6">
          <Card className="mb-6 border-2 border-primary/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Overall Status</CardTitle>
                {getStatusBadge(diagnosticData.overallStatus)}
              </div>
              <CardDescription>Timestamp: {new Date(diagnosticData.timestamp).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  Environment: <span className="font-medium">{diagnosticData.environment}</span>
                </p>
                <p>
                  Node Version: <span className="font-medium">{diagnosticData.nodeVersion}</span>
                </p>
                {diagnosticData.overallStatus === "fail" && (
                  <p className="text-red-500 font-medium mt-4">
                    Found {diagnosticData.failedChecksCount} issues that may prevent deployment
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2">
                <Button onClick={runDiagnostic}>Run Again</Button>
                <Button variant="outline" onClick={() => window.open("/api/paypal-config-check", "_blank")}>
                  Check PayPal Config
                </Button>
                <Button variant="outline" onClick={() => window.open("/api/build-check", "_blank")}>
                  Check Build Issues
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Environment Variables Check */}
          <Card
            className={`border ${diagnosticData.diagnosticResults.environmentVariables?.status === "fail" ? "border-red-300" : ""}`}
          >
            <CardHeader
              className={`${diagnosticData.diagnosticResults.environmentVariables?.status === "fail" ? "bg-red-50 dark:bg-red-900/20" : ""}`}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(diagnosticData.diagnosticResults.environmentVariables?.status)}
                  Environment Variables
                </CardTitle>
                {getStatusBadge(diagnosticData.diagnosticResults.environmentVariables?.status)}
              </div>
            </CardHeader>
            <CardContent>
              {diagnosticData.diagnosticResults.environmentVariables?.status === "fail" && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                  <p className="font-medium text-red-700 dark:text-red-300">Missing Required Environment Variables:</p>
                  <ul className="list-disc list-inside mt-2">
                    {diagnosticData.diagnosticResults.environmentVariables?.missingVars.map((envVar: string) => (
                      <li key={envVar} className="text-red-600 dark:text-red-400">
                        {envVar}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(diagnosticData.diagnosticResults.environmentVariables?.details || {}).map(
                  ([key, value]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between p-2 rounded-md border">
                      <span className="font-medium">{key}</span>
                      <Badge variant={value.exists ? "outline" : "destructive"}>
                        {value.exists ? "Present" : "Missing"}
                      </Badge>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Database Connection Check */}
          <Card
            className={`border ${diagnosticData.diagnosticResults.databaseConnection?.status === "fail" ? "border-red-300" : ""}`}
          >
            <CardHeader
              className={`${diagnosticData.diagnosticResults.databaseConnection?.status === "fail" ? "bg-red-50 dark:bg-red-900/20" : ""}`}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(diagnosticData.diagnosticResults.databaseConnection?.status)}
                  Database Connection
                </CardTitle>
                {getStatusBadge(diagnosticData.diagnosticResults.databaseConnection?.status)}
              </div>
            </CardHeader>
            <CardContent>
              {diagnosticData.diagnosticResults.databaseConnection?.status === "pass" ? (
                <p className="text-green-600 dark:text-green-400">
                  {diagnosticData.diagnosticResults.databaseConnection.message}
                </p>
              ) : (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                  <p className="font-medium text-red-700 dark:text-red-300">Database Connection Error:</p>
                  <p className="mt-1 text-red-600 dark:text-red-400">
                    {diagnosticData.diagnosticResults.databaseConnection?.error}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* PayPal Configuration Check */}
          <Card
            className={`border ${diagnosticData.diagnosticResults.paypalConfiguration?.status === "fail" ? "border-red-300" : ""}`}
          >
            <CardHeader
              className={`${diagnosticData.diagnosticResults.paypalConfiguration?.status === "fail" ? "bg-red-50 dark:bg-red-900/20" : ""}`}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(diagnosticData.diagnosticResults.paypalConfiguration?.status)}
                  PayPal Configuration
                </CardTitle>
                {getStatusBadge(diagnosticData.diagnosticResults.paypalConfiguration?.status)}
              </div>
            </CardHeader>
            <CardContent>
              {diagnosticData.diagnosticResults.paypalConfiguration?.status === "pass" ? (
                <p className="text-green-600 dark:text-green-400">
                  {diagnosticData.diagnosticResults.paypalConfiguration.message}
                </p>
              ) : (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                  <p className="font-medium text-red-700 dark:text-red-300">PayPal Configuration Error:</p>
                  <p className="mt-1 text-red-600 dark:text-red-400">
                    {diagnosticData.diagnosticResults.paypalConfiguration?.error}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Package.json Check */}
          <Card
            className={`border ${diagnosticData.diagnosticResults.packageJson?.status === "fail" ? "border-red-300" : ""}`}
          >
            <CardHeader
              className={`${diagnosticData.diagnosticResults.packageJson?.status === "fail" ? "bg-red-50 dark:bg-red-900/20" : ""}`}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(diagnosticData.diagnosticResults.packageJson?.status)}
                  Package.json
                </CardTitle>
                {getStatusBadge(diagnosticData.diagnosticResults.packageJson?.status)}
              </div>
            </CardHeader>
            <CardContent>
              {diagnosticData.diagnosticResults.packageJson?.status === "pass" ? (
                <p className="text-green-600 dark:text-green-400">
                  {diagnosticData.diagnosticResults.packageJson.message}
                </p>
              ) : (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                  <p className="font-medium text-red-700 dark:text-red-300">Package.json Error:</p>
                  <p className="mt-1 text-red-600 dark:text-red-400">
                    {diagnosticData.diagnosticResults.packageJson?.error}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
