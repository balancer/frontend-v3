import { useState } from 'react'
import { NUM_PER_PAGE, PAGE_NUM } from '../pool.constants'

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
