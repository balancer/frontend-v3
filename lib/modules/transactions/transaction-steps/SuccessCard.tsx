import { BlockExplorerLink } from '@/lib/shared/components/BlockExplorerLink'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Card, HStack, Text } from '@chakra-ui/react'
import { Check } from 'react-feather'
import { useReceipt } from './useReceipt'

export function SuccessCard({ chain }: { chain: GqlChain }) {
  const { txHash } = useReceipt()

  return (
    <Card variant="modalSubSection" border="1px" borderColor="font.highlight">
      <HStack justify="space-between" w="full">
        <HStack justify="flex-start" color="font.highlight">
          <Check size={20} />
          <Text color="font.highlight">Success</Text>
        </HStack>
        <BlockExplorerLink chain={chain} transactionHash={txHash} />)
      </HStack>
    </Card>
  )
}
