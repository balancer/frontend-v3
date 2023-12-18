import { useState } from 'react'
import { useUserAccount } from '../../../modules/web3/useUserAccount'

// Each step is disabled by default and will be activated by the TransactionFlow component
export function useActiveStep() {
  const { isConnected } = useUserAccount()

  const [isActiveStep, setIsActiveStep] = useState(false)

  const activateStep = () => setIsActiveStep(true)
  return {
    isActiveStep: isActiveStep && isConnected, // A step cannot be active if the user is not connected
    setIsActiveStep,
    activateStep,
  }
}
