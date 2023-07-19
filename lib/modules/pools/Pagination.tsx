import { Button } from '@/components/_base/Button'
import Link from 'next/link'

interface Props {
  page: number
  perPage: number
}

export function Pagination({ page, perPage }: Props) {
  return (
    <>
      <div className="mt-4 flex items-center space-x-4">
        <div>Page num: {page}</div>
        {[1, 2, 3].map(num => (
          <Button
            variant={page === num ? 'default' : 'outline'}
            size="sm"
            key={num}
            asChild
          >
            <Link href={`/?page=${num}&perPage=${perPage}`}>{num}</Link>
          </Button>
        ))}

        <Button variant="outline" size="sm" asChild>
          <Link href={`/?page=${page + 1}&perPage=${perPage}`}>Next</Link>
        </Button>
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <div>No. per page:</div>
        {[10, 20, 30].map(num => (
          <Button
            variant={perPage === num ? 'default' : 'outline'}
            key={num}
            asChild
          >
            <Link href={`/?page=${page}&perPage=${num}`}>{num}</Link>
          </Button>
        ))}
      </div>
    </>
  )
}
