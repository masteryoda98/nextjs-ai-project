import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  const buildIssues = []
  const results = {
    status: "checking",
    issues: buildIssues,
  }

  try {
    // Check for next.config.js/mjs
    const rootDir = process.cwd()
    const nextConfigJs = path.join(rootDir, "next.config.js")
    const nextConfigMjs = path.join(rootDir, "next.config.mjs")

    if (!fs.existsSync(nextConfigJs) && !fs.existsSync(nextConfigMjs)) {
      buildIssues.push("Missing next.config.js or next.config.mjs file")
    }

    // Check for package.json
    const packageJsonPath = path.join(rootDir, "package.json")
    if (!fs.existsSync(packageJsonPath)) {
      buildIssues.push("Missing package.json file")
    } else {
      // Read package.json and check for required fields
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

      if (!packageJson.dependencies) {
        buildIssues.push("Missing dependencies in package.json")
      } else {
        // Check for required dependencies
        const requiredDeps = ["next", "react", "react-dom"]
        for (const dep of requiredDeps) {
          if (!packageJson.dependencies[dep]) {
            buildIssues.push(`Missing required dependency: ${dep}`)
          }
        }
      }

      // Check for build script
      if (!packageJson.scripts || !packageJson.scripts.build) {
        buildIssues.push("Missing build script in package.json")
      }
    }

    // Check for tsconfig.json if using TypeScript
    const tsConfigPath = path.join(rootDir, "tsconfig.json")
    if (!fs.existsSync(tsConfigPath)) {
      // This is not necessarily an issue, but worth noting
      buildIssues.push("Missing tsconfig.json file (only an issue if using TypeScript)")
    }

    // Check for app directory (for App Router)
    const appDirPath = path.join(rootDir, "app")
    if (!fs.existsSync(appDirPath)) {
      buildIssues.push("Missing app directory (required for App Router)")
    }

    results.status = buildIssues.length === 0 ? "pass" : "fail"

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
        issues: buildIssues,
      },
      { status: 500 },
    )
  }
}
