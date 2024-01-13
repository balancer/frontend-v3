import { Button, Tooltip } from '@chakra-ui/react'
import { useSwap } from './useSwap'

export function SwapFlowButton() {
  const { isDisabled, disabledReason, isLoading } = useSwap()

  function submit() {
    console.log('swap')
  }

  return (
    <Tooltip label={isDisabled ? '' : disabledReason}>
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
