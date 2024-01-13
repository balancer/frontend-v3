import { Button, Tooltip } from '@chakra-ui/react'
import { useSwap } from './useSwap'

export function SwapFlowButton() {
  const { isDisabled, isLoading } = useSwap()

  function submit() {
    console.log('swap')
  }

  return (
    <Tooltip label={isDisabled ? '' : 'cannot execute swap'}>
      <Button
        variant="secondary"
        w="full"
        size="lg"
        isDisabled={isDisabled}
        isLoading={isLoading}
        onClick={submit}
      >
        Swap
      </Button>
    </Tooltip>
  )
}
