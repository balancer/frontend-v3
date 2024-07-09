import { HStack } from '@chakra-ui/react'
import { PoolAlert } from '../../pool/alerts/PoolAlerts'

export function MerklAlert() {
  return <PoolAlert status="info" isSoftWarning={false} title={<MerklTitle />} />
}

function MerklTitle() {
  return (
    <HStack justify="space-between" w="full">
      <HStack>
        <div>It looks like you could also have Merkl rewards.</div>
      </HStack>
      <a href="https://app.merkl.xyz/" target="_blank">
        Go to Merkl
      </a>
    </HStack>
  )
}
