import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Checkbox,
  HStack,
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Box,
  Text,
} from '@chakra-ui/react'
import { RisksList } from '../../../PoolDetail/PoolRisks/PoolRisks'
import { useAddLiquidity } from '../useAddLiquidity'
import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'

export function AddLiquidityFormCheckbox() {
  const { tokens, acceptPoolRisks, setAcceptPoolRisks } = useAddLiquidity()
  const { balanceFor, isBalancesLoading } = useTokenBalances()

  const hasNoPoolTokensInWallet = tokens.every(
    token => token && balanceFor(token.address)?.formatted === '0'
  )

  return (
    <Checkbox
      size="lg"
      isChecked={acceptPoolRisks}
      onChange={e => setAcceptPoolRisks(e.target.checked)}
      isDisabled={isBalancesLoading || hasNoPoolTokensInWallet}
    >
      <HStack>
        <Text fontSize="md">I accept the risks of interacting with this pool</Text>
        <Popover placement="top" trigger="hover">
          <PopoverTrigger>
            <IconButton
              size="xs"
              aria-label="pool-risks-info"
              bg="background.level2"
              _hover={{ bg: 'background.level2' }}
              icon={<InfoOutlineIcon boxSize="4" color="grayText" />}
            />
          </PopoverTrigger>
          <Box zIndex="popover" shadow="2xl">
            <PopoverContent>
              <PopoverArrow bg="background.level3" />
              <PopoverBody>
                <RisksList textVariant="primary" />
              </PopoverBody>
            </PopoverContent>
          </Box>
        </Popover>
      </HStack>
    </Checkbox>
  )
}
