'use client'
import { default as NextLink } from 'next/link'
import PageError from '@/lib/shared/components/errors/PageError'
import { Button, Link } from '@chakra-ui/react'

export default function Error({ error }: { error: Error }) {
  return (
    <PageError
      title={'Something went wrong!'}
      error={error}
      captureException
      customButton={
        <Link as={NextLink} href={'/pools'} prefetch={true}>
          <Button variant="outline">Reload Page</Button>
        </Link>
      }
    />
  )
}
