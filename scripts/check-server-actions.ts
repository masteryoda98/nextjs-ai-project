// This is a utility script to check for server actions that aren't async
// You can run this with: npx ts-node scripts/check-server-actions.ts

import * as fs from "fs"
import * as path from "path"

function scanDirectory(dir: string): void {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      scanDirectory(filePath)
    } else if (stats.isFile() && (filePath.endsWith(".ts") || filePath.endsWith(".tsx"))) {
      checkFile(filePath)
    }
  }
}

function checkFile(filePath: string): void {
  const content = fs.readFileSync(filePath, "utf8")

  // Check if file has 'use server' directive
  if (content.includes('"use server"') || content.includes("'use server'")) {
    console.log(`Checking server actions in: ${filePath}`)

    // Simple regex to find function declarations that aren't async
    const functionRegex = /export\s+function\s+([a-zA-Z0-9_]+)\s*\(/g
    let match

    while ((match = functionRegex.exec(content)) !== null) {
      const functionName = match[1]
      const functionPos = match.index
      const beforeFunction = content.substring(Math.max(0, functionPos - 20), functionPos)

      if (!beforeFunction.includes("async")) {
        console.log(`  WARNING: Function '${functionName}' might not be async`)
      }
    }
  }
}

// Start scanning from the app directory
scanDirectory("./app")
scanDirectory("./lib")
