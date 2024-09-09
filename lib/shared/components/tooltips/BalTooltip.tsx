import React, { useEffect, useRef, ReactElement } from 'react'
import { Tooltip, TooltipProps, useDisclosure } from '@chakra-ui/react'

interface BalTooltipProps extends TooltipProps {
  children: ReactElement
}

const BalTooltip: React.FC<BalTooltipProps> = ({ children, ...tooltipProps }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const triggerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const triggerElement = triggerRef.current
    if (triggerElement) {
      triggerElement.addEventListener('touchstart', onOpen)
      return () => {
        triggerElement.removeEventListener('touchstart', onOpen)
      }
    }
  }, [onOpen])

  const touchSupportChild = React.cloneElement(React.Children.only(children), {
    ref: triggerRef,
    onMouseEnter: onOpen,
    onMouseLeave: onClose,
    onClick: onOpen,
  })

  return (
    <Tooltip isOpen={isOpen} {...tooltipProps}>
      {touchSupportChild}
    </Tooltip>
  )
}

export default BalTooltip
