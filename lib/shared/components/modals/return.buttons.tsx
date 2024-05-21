import { usePoolRedirect } from '@/lib/modules/pool/pool.hooks'
import { usePool } from '@/lib/modules/pool/usePool'
import { Button } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { CornerDownLeft } from 'react-feather'

export function ReturnToPoolButton() {
  const { pool } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)
  return <ReturnButton onClick={redirectToPoolPage}>Return to pool</ReturnButton>
}

type ActionProps = PropsWithChildren<{ onClick: () => void }>
export function ReturnButton({ onClick, children }: ActionProps) {
  return (
    <Button variant="ghost" leftIcon={<CornerDownLeft size="14" />} size="xs" onClick={onClick}>
      {children}
    </Button>
  )
}
