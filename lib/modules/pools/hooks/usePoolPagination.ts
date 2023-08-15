import { useState } from 'react'

export const NUM_PER_PAGE = 10
export const PAGE_NUM = 0

export function usePoolPagination() {
  const [numPerPage, setNumPerPage] = useState(NUM_PER_PAGE)
  const [pageNum, setPageNum] = useState(PAGE_NUM)

  return {
    numPerPage,
    setNumPerPage,
    pageNum,
    setPageNum,
  }
}
