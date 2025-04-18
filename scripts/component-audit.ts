// This script checks for potential Server/Client Component issues
// Run with: npx ts-node scripts/component-audit.ts

import * as fs from "fs"
import * as glob from "glob"

// Server-only imports that should not be used in Client Components
const SERVER_ONLY_IMPORTS = [
  "next/headers",
  "next/server",
  "cookies",
  "headers",
  "createServerClient",
  "createServerComponentClient",
  "createServerActionClient",
]

// Client-only features that should not be used in Server Components
const CLIENT_ONLY_FEATURES = [
  "useState",
  "useEffect",
  "useContext",
  "useReducer",
  "useCallback",
  "useMemo",
  "useRef",
  "useImperativeHandle",
  "useLayoutEffect",
  "useDebugValue",
  "useId",
  "createContext",
]

// Function to check if a file is a Client Component
function isClientComponent(content: string): boolean {
  return content.includes('"use client"') || content.includes("'use client'")
}

// Function to check if a file is in the pages directory
function isInPagesDirectory(filePath: string): boolean {
  return filePath.includes("/pages/")
}

// Function to check for server-only imports in Client Components
function checkForServerImportsInClient(filePath: string, content: string): string[] {
  const issues: string[] = []

  if (isClientComponent(content) || isInPagesDirectory(filePath)) {
    SERVER_ONLY_IMPORTS.forEach((importName) => {
      if (content.includes(importName)) {
        issues.push(`Server-only import '${importName}' used in Client Component: ${filePath}`)
      }
    })
  }

  return issues
}

// Function to check for client-only features in Server Components
function checkForClientFeaturesInServer(filePath: string, content: string): string[] {
  const issues: string[] = []

  if (!isClientComponent(content) && !isInPagesDirectory(filePath) && filePath.includes("/app/")) {
    CLIENT_ONLY_FEATURES.forEach((feature) => {
      if (content.includes(feature)) {
        issues.push(`Client-only feature '${feature}' potentially used in Server Component: ${filePath}`)
      }
    })
  }

  return issues
}

// Main function to audit components
async function auditComponents() {
  const files = glob.sync("**/*.{tsx,ts,js,jsx}", {
    ignore: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/scripts/**"],
  })

  let allIssues: string[] = []

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8")

    const serverInClientIssues = checkForServerImportsInClient(file, content)
    const clientInServerIssues = checkForClientFeaturesInServer(file, content)

    allIssues = [...allIssues, ...serverInClientIssues, ...clientInServerIssues]
  }

  if (allIssues.length > 0) {
    console.log("🚨 Component Issues Found:")
    allIssues.forEach((issue) => console.log(`- ${issue}`))
    console.log(`
Total issues: ${allIssues.length}`)
  } else {
    console.log("✅ No component issues found!")
  }
}

// Run the audit
auditComponents()
