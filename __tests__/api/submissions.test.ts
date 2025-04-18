import { NextRequest } from "next/server"
import { POST } from "@/app/api/submissions/route"
import { createSubmission } from "@/lib/db"
import { isAuthenticated } from "@/lib/auth-utils"
import { verifyCsrfToken } from "@/lib/csrf"
import { describe, beforeEach, it, expect, jest } from "@jest/globals"

// Mock dependencies
jest.mock("@/lib/db")
jest.mock("@/lib/auth-utils")
jest.mock("@/lib/csrf")

describe("Submissions API", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/submissions", () => {
    it("should return 401 if user is not authenticated", async () => {
      // Mock authentication check
      ;(isAuthenticated as jest.Mock).mockResolvedValue(false)

      const request = new NextRequest("http://localhost/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({
        success: false,
        message: "Unauthorized",
      })
    })

    it("should return 403 if CSRF token is invalid", async () => {
      // Mock authentication check
      ;(isAuthenticated as jest.Mock).mockResolvedValue(true)
      // Mock CSRF verification
      ;(verifyCsrfToken as jest.Mock).mockReturnValue(false)

      const request = new NextRequest("http://localhost/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": "invalid-token",
        },
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data).toEqual({
        success: false,
        message: "Invalid CSRF token",
      })
    })

    it("should create a submission successfully", async () => {
      // Mock authentication check
      ;(isAuthenticated as jest.Mock).mockResolvedValue(true)
      // Mock CSRF verification
      ;(verifyCsrfToken as jest.Mock).mockReturnValue(true)
      // Mock submission creation
      ;(createSubmission as jest.Mock).mockResolvedValue({
        success: true,
        id: 123,
      })

      const request = new NextRequest("http://localhost/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": "valid-token",
        },
        body: JSON.stringify({
          campaignId: "1",
          creatorId: "user-123",
          campaignCreatorId: "1",
          contentUrl: "https://example.com/video",
          caption: "Test caption",
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        success: true,
        data: {
          message: "Submission received successfully",
          submissionId: 123,
        },
      })
      expect(createSubmission).toHaveBeenCalledWith({
        campaignId: 1,
        creatorId: "user-123",
        campaignCreatorId: 1,
        contentUrl: "https://example.com/video",
        caption: "Test caption",
      })
    })
  })

  // Add tests for GET method
})
