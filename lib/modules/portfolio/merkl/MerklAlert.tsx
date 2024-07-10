import { Alert, AlertIcon, HStack, Link } from '@chakra-ui/react'

export function MerklAlert() {
  return (
    <Alert status="info" width="full">
      <AlertIcon />
      <MerklTitle />
    </Alert>
  )
}

function MerklTitle() {
  return (
    <HStack justify="space-between" w="full">
      <HStack>
        <div>It looks like you could also have Merkl rewards.</div>
      </HStack>
      <Link href="https://app.merkl.xyz/" target="_blank">
        Go to merkl.xyz
      </Link>
    </HStack>
  )
}
