"use client"

import { useState, useCallback } from "react"

interface UsePaginationProps {
  initialPage?: number
  initialPageSize?: number
}

export function usePagination({ initialPage = 1, initialPageSize = 10 }: UsePaginationProps = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [totalPages, setTotalPages] = useState(1)

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    },
    [totalPages],
  )

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])

  const firstPage = useCallback(() => {
    goToPage(1)
  }, [goToPage])

  const lastPage = useCallback(() => {
    goToPage(totalPages)
  }, [goToPage, totalPages])

  const changePageSize = useCallback((newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1) // Reset to first page when changing page size
  }, [])

  return {
    currentPage,
    pageSize,
    totalPages,
    setTotalPages,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    changePageSize,
  }
}
