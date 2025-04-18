// This utility helps ensure we're not importing server-only modules in client components

// List of modules that should only be used in server components
export const SERVER_ONLY_MODULES = [
  "fs",
  "path",
  "crypto",
  "child_process",
  "os",
  "stream",
  "zlib",
  "http",
  "https",
  "net",
  "dgram",
  "dns",
  "tls",
]

// Function to check if a module is server-only
export function isServerOnlyModule(moduleName: string): boolean {
  return SERVER_ONLY_MODULES.includes(moduleName)
}

// Safe alternatives for client components
export const CLIENT_ALTERNATIVES = {
  crypto: "crypto-js or Web Crypto API",
  fs: "Use API routes or server components for file operations",
  path: "Use string manipulation or URL API",
}
