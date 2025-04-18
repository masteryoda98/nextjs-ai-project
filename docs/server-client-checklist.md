# Server/Client Component Implementation Checklist

This document provides guidelines for maintaining proper separation between Server and Client Components in our Next.js application.

## Component Creation Checklist

### When Creating Server Components
- [ ] Do NOT add `"use client"` directive
- [ ] Do NOT use React hooks (`useState`, `useEffect`, etc.)
- [ ] Do NOT use browser APIs (`window`, `document`, etc.)
- [ ] Do use direct database access when needed
- [ ] Do use server-only APIs (`next/headers`, `cookies()`, etc.)
- [ ] Do fetch data directly without SWR or React Query

### When Creating Client Components
- [ ] Add `"use client"` directive at the top of the file
- [ ] Do NOT import or use server-only APIs (`next/headers`, etc.)
- [ ] Do NOT directly access server resources (database, file system)
- [ ] Do use React hooks as needed
- [ ] Do use browser APIs as needed
- [ ] Do use SWR or React Query for data fetching

## Data Flow Patterns

### Passing Data from Server to Client
- [ ] Fetch data in Server Component
- [ ] Pass data as props to Client Components
- [ ] Use React Context only in Client Components

### Handling Authentication
- [ ] Use server middleware for route protection
- [ ] Use `<ProtectedRoute>` component for client-side protection
- [ ] Pass session data from Server to Client Components

## File Organization

### Naming Conventions
- [ ] Use `.server.ts` suffix for server-only utilities
- [ ] Use `.client.ts` suffix for client-only utilities
- [ ] Use clear naming for components that indicates their type

### Directory Structure
- [ ] Keep server-only code in dedicated directories
- [ ] Organize components by feature rather than by type
- [ ] Use barrel files to simplify imports

## Code Quality Checks

### Before Committing
- [ ] Run `npm run audit:components` to check for issues
- [ ] Ensure no server-only imports in Client Components
- [ ] Ensure no React hooks in Server Components
- [ ] Check for proper use of `"use client"` directive

### During Code Review
- [ ] Verify proper separation of concerns
- [ ] Check for potential hydration issues
- [ ] Ensure consistent patterns are followed

## Common Patterns

### Form Handling
- [ ] Use Server Actions for form submissions when possible
- [ ] Use Client Components for form state management
- [ ] Use Zod for validation in both contexts

### Data Fetching
- [ ] Fetch data in Server Components when possible
- [ ] Use SWR or React Query in Client Components when needed
- [ ] Implement proper loading and error states

## Troubleshooting

If you encounter errors related to Server/Client Component separation:

1. Check if you're using server-only APIs in Client Components
2. Verify that all Client Components have the `"use client"` directive
3. Ensure you're not using React hooks in Server Components
4. Run the component audit script to identify issues
5. Review the Next.js documentation on [Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-and-client-components)
