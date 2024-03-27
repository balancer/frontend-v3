'use client'

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  VStack,
  Text,
  Button,
  Input,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useDebounce } from '@/lib/shared/hooks/useDebounce'
import { defaultDebounceMs } from '@/lib/shared/utils/queries'

type Props = {
  isOpen: boolean
  onClose(): void
  onOpen(): void
  setAcceptHighPriceImpact: (value: boolean) => void
}

const INPUT_TEXT = 'I understand that price impact is high and I may get rekt.'

export function PriceImpactAcceptModal({
  isOpen,
  onClose,
  setAcceptHighPriceImpact,
  ...rest
}: Props & Omit<ModalProps, 'children'>) {
  const [inputText, setInputText] = useState('')

  const handleClick = () => {
    if (inputText === INPUT_TEXT) {
      setAcceptHighPriceImpact(true)
      onClose()
    }
  }

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value)
  }

  const debouncedChangeHandler = useDebounce(changeHandler, defaultDebounceMs)

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered {...rest}>
      <ModalOverlay bg="blackAlpha.900" />
      <ModalContent w="500px">
        <ModalHeader color="font.primary">Are you sure?</ModalHeader>
        <ModalCloseButton />
        <ModalBody px="4" pb="4">
          <VStack w="full" align="start" spacing="md">
            <Text>Type the following to proceed:</Text>
            <Text>{INPUT_TEXT}</Text>
            <Input placeholder={INPUT_TEXT} onChange={debouncedChangeHandler} />
            <Button
              w="full"
              variant="primary"
              isDisabled={inputText !== INPUT_TEXT}
              onClick={handleClick}
            >
              Swap despite risk of getting rekt
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
