import { BlockExplorerLink } from '@/lib/shared/components/BlockExplorerLink'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Card, Text, VStack } from '@chakra-ui/react'
import { useReceipt } from './useReceipt'

export function SuccessCard({ chain }: { chain: GqlChain }) {
  const { txHash } = useReceipt()

  return (
    <Card variant="level2" marginBottom="1">
      <VStack justify="flex-start">
        <Text color="font.highlight" fontSize="lg">
          Your transaction was confirmed on-chain!
        </Text>
        <BlockExplorerLink chain={chain} transactionHash={txHash} />)
      </VStack>
    </Card>
  )
}
