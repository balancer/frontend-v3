import { Alert, AlertTitle, HStack, Box, AlertStatus } from '@chakra-ui/react'
import { AlertTriangle } from 'react-feather'
import { useThemeColorMode } from '../../services/chakra/useThemeColorMode'
import { ReactNode } from 'react'
export type AlertProps = {
  title: ReactNode | string
  status: AlertStatus
}

// TODO: this component has many similarities with the PoolAlert component
// Decide if we want to merge them or keep them separate
export function GlobalAlert({ title, status }: AlertProps) {
  const colorMode = useThemeColorMode()

  return (
    <Alert
      display="flex"
      justifyContent="space-between"
      bg={colorMode === 'dark' ? 'orange.300' : 'orange.200'}
      status={status}
      rounded="lg"
      border="none !important"
      alignItems="center"
      color="font.dark"
      role="group"
      margin="md"
    >
      <HStack w="full">
        <Box flex="0 0 auto">
          <AlertTriangle width="24px" height="24px" />
        </Box>
        <AlertTitle
          w="full"
          gap={1}
          display="flex"
          alignItems="center"
          ml="md"
          sx={{ a: { textDecoration: 'underline' } }}
          fontWeight={500}
          color="font.dark"
        >
          {title}
        </AlertTitle>
      </HStack>
    </Alert>
  )
}
