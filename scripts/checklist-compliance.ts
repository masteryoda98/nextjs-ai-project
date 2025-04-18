// This script checks for compliance with the Server/Client Component checklist
// Run with: npx ts-node scripts/checklist-compliance.ts

import * as fs from "fs"
import * as glob from "glob"

// Define patterns to check
const patterns = {
  serverOnlyImports: ["next/headers", "cookies", "headers", "createServerComponentClient"],
  clientOnlyFeatures: ["useState", "useEffect", "useContext", "useReducer", "useCallback", "useMemo", "useRef"],
  useClientDirective: '"use client"',
  browserAPIs: ["window.", "document.", "localStorage", "sessionStorage", "navigator."],
}

// Function to check if a file is a React component
function isReactComponent(filePath: string): boolean {
  return filePath.endsWith(".tsx") || filePath.endsWith(".jsx") || filePath.includes("/components/")
}

// Function to check if a file is marked as a Client Component
function isClientComponent(content: string): boolean {
  return content.includes('"use client"') || content.includes("'use client'")
}

// Function to check if a file is in the app directory (Server Component by default)
function isInAppDirectory(filePath: string): boolean {
  return filePath.includes("/app/") && !filePath.includes("/api/")
}

// Function to check for compliance issues
function checkCompliance(filePath: string, content: string): string[] {
  const issues: string[] = []

  // Skip non-component files
  if (!isReactComponent(filePath)) {
    return issues
  }

  const isClient = isClientComponent(content)
  const isInApp = isInAppDirectory(filePath)

  // Check Client Components
  if (isClient) {
    // Check for server-only imports in Client Components
    patterns.serverOnlyImports.forEach((importName) => {
      if (content.includes(importName)) {
        issues.push(`❌ Server-only import '${importName}' used in Client Component: ${filePath}`)
      }
    })
  }

  // Check Server Components (files in app/ without "use client")
  if (isInApp && !isClient) {
    // Check for client-only features in Server Components
    patterns.clientOnlyFeatures.forEach((feature) => {
      if (content.includes(feature)) {
        issues.push(`❌ Client-only feature '${feature}' used in Server Component: ${filePath}`)
      }
    })

    // Check for browser APIs in Server Components
    patterns.browserAPIs.forEach((api) => {
      if (content.includes(api)) {
        issues.push(`❌ Browser API '${api}' used in Server Component: ${filePath}`)
      }
    })
  }

  return issues
}

// Main function to check compliance
async function checkChecklistCompliance() {
  const files = glob.sync("**/*.{tsx,ts,jsx,js}", {
    ignore: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/scripts/**"],
  })

  let allIssues: string[] = []
  let compliantFiles = 0

  for (const file of files) {
    if (!isReactComponent(file)) continue

    const content = fs.readFileSync(file, "utf8")
    const issues = checkCompliance(file, content)

    if (issues.length === 0) {
      compliantFiles++
    } else {
      allIssues = [...allIssues, ...issues]
    }
  }

  const totalComponentFiles = files.filter(isReactComponent).length

  console.log(`
=== Server/Client Component Checklist Compliance ===
`)

  if (allIssues.length > 0) {
    console.log("🚨 Compliance Issues Found:")
    allIssues.forEach((issue) => console.log(`  ${issue}`))
  } else {
    console.log("✅ No compliance issues found!")
  }

  console.log(
    `
📊 Compliance Rate: ${compliantFiles}/${totalComponentFiles} components (${Math.round((compliantFiles / totalComponentFiles) * 100)}%)
`,
  )

  // Provide recommendations
  if (allIssues.length > 0) {
    console.log("🔍 Recommendations:")
    console.log("  1. Review the issues above and fix them according to the checklist")
    console.log("  2. Run this script again to verify your fixes")
    console.log("  3. Consider adding this check to your CI/CD pipeline")
    console.log(
      "\
Refer to docs/server-client-checklist.md for detailed guidelines.",
    )
  }
}

// Run the compliance check
checkChecklistCompliance()
