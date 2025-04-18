import { createSubmission } from "@/lib/db"
import { supabase } from "@/lib/supabase"
import { describe, beforeEach, it, expect, jest } from "@jest/globals"

// Mock Supabase client
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    single: jest.fn(),
  },
  createServerSupabaseClient: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    rpc: jest.fn(),
  }),
}))

describe("Database Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("createSubmission", () => {
    it("should create a submission successfully", async () => {
      // Mock successful creator check
      ;(supabase.from as jest.Mock).mockReturnThis()
      ;(supabase.select as jest.Mock).mockReturnThis()
      ;(supabase.eq as jest.Mock).mockReturnThis()
      ;(supabase.single as jest.Mock).mockResolvedValue({
        data: { id: 1, status: "APPROVED" },
        error: null,
      })

      // Mock successful submission creation
      ;(supabase.from as jest.Mock).mockReturnThis()
      ;(supabase.insert as jest.Mock).mockReturnThis()
      ;(supabase.select as jest.Mock).mockReturnThis()
      ;(supabase.single as jest.Mock).mockResolvedValue({
        data: { id: 123 },
        error: null,
      })

      const result = await createSubmission({
        campaignId: 1,
        creatorId: "user-123",
        campaignCreatorId: 1,
        contentUrl: "https://example.com/video",
        caption: "Test caption",
      })

      expect(result).toEqual({ success: true, id: 123 })
      expect(supabase.from).toHaveBeenCalledWith("campaign_creators")
      expect(supabase.from).toHaveBeenCalledWith("submissions")
    })

    it("should return error if creator is not approved", async () => {
      // Mock failed creator check
      ;(supabase.from as jest.Mock).mockReturnThis()
      ;(supabase.select as jest.Mock).mockReturnThis()
      ;(supabase.eq as jest.Mock).mockReturnThis()
      ;(supabase.single as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: "Not found" },
      })

      const result = await createSubmission({
        campaignId: 1,
        creatorId: "user-123",
        campaignCreatorId: 1,
        contentUrl: "https://example.com/video",
        caption: "Test caption",
      })

      expect(result).toEqual({
        success: false,
        error: "Creator is not approved for this campaign",
      })
    })
  })
})

// Add more tests for other functions
