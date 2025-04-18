// This script checks for potentially problematic imports in your codebase
// Run with: npx ts-node scripts/check-imports.ts

import * as fs from "fs"
import * as path from "path"

// Get installed dependencies from package.json
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
const dependencies = Object.keys({
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
})

// Add Next.js built-in modules
const builtInModules = ["react", "react-dom", "next", "next/navigation", "next/image", "next/link"]
const allDependencies = [...dependencies, ...builtInModules]

// Track found imports
const foundImports = new Set<string>()
const potentialIssues: { file: string; import: string }[] = []

function scanDirectory(dir: string): void {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory() && !filePath.includes("node_modules") && !filePath.includes(".next")) {
      scanDirectory(filePath)
    } else if (
      stats.isFile() &&
      (filePath.endsWith(".ts") || filePath.endsWith(".tsx") || filePath.endsWith(".js") || filePath.endsWith(".jsx"))
    ) {
      checkImports(filePath)
    }
  }
}

function checkImports(filePath: string): void {
  const content = fs.readFileSync(filePath, "utf8")
  const importRegex = /import\s+(?:(?:{[^}]*}|\*\s+as\s+[^,]*|[^,{]*),?\s*)*from\s+['"]([^'"]+)['"]/g
  const requireRegex = /(?:const|let|var)\s+(?:{[^}]*}|[^=]*)\s*=\s*require$$['"]([^'"]+)['"]$$/g

  let match
  while ((match = importRegex.exec(content)) !== null) {
    checkModuleReference(match[1], filePath)
  }

  while ((match = requireRegex.exec(content)) !== null) {
    checkModuleReference(match[1], filePath)
  }
}

function checkModuleReference(importPath: string, filePath: string): void {
  // Skip relative imports and Next.js special imports
  if (importPath.startsWith(".") || importPath.startsWith("/") || importPath.startsWith("@/")) {
    return
  }

  // Extract the package name (handle scoped packages)
  let packageName = importPath
  if (importPath.startsWith("@")) {
    packageName = importPath.split("/").slice(0, 2).join("/")
  } else {
    packageName = importPath.split("/")[0]
  }

  foundImports.add(packageName)

  // Check if the package is in dependencies
  if (!allDependencies.includes(packageName)) {
    potentialIssues.push({ file: filePath, import: importPath })
  }
}

console.log("Scanning for potentially missing module references...")
scanDirectory("./app")
scanDirectory("./components")
scanDirectory("./lib")
scanDirectory("./utils")

if (potentialIssues.length > 0) {
  console.log("\n🚨 Potential missing module references found:")

  // Group by module name for clearer output
  const issuesByModule = potentialIssues.reduce(
    (acc, issue) => {
      const moduleName = issue.import.split("/")[0]
      if (!acc[moduleName]) {
        acc[moduleName] = []
      }
      acc[moduleName].push(issue)
      return acc
    },
    {} as Record<string, typeof potentialIssues>,
  )

  for (const [moduleName, issues] of Object.entries(issuesByModule)) {
    console.log(`\n📦 ${moduleName}:`)
    issues.forEach((issue) => {
      console.log(`  - ${issue.file}: imports "${issue.import}"`)
    })
  }

  console.log("\nTo fix these issues, install the missing dependencies:")
  console.log(`npm install ${Array.from(new Set(potentialIssues.map((i) => i.import.split("/")[0]))).join(" ")}`)
} else {
  console.log("✅ No potential missing module references found!")
}

// Check for unused dependencies
console.log("\nChecking for unused dependencies...")
const unusedDependencies = dependencies.filter((dep) => !foundImports.has(dep))

if (unusedDependencies.length > 0) {
  console.log("⚠️ Potentially unused dependencies:")
  unusedDependencies.forEach((dep) => {
    console.log(`  - ${dep}`)
  })
  console.log("\nNote: Some of these might be used indirectly or in scripts.")
} else {
  console.log("✅ No potentially unused dependencies found!")
}
