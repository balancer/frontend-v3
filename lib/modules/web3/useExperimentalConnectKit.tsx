import { useReadLocalStorage } from 'usehooks-ts'
import { LS_KEYS } from '../local-storage/local-storage.constants'

export function useExperimentalConnectKit() {
  const shouldUseConnectKit = useReadLocalStorage<boolean | undefined>(LS_KEYS.ConnectKit)

  console.log({ shouldUseConnectKitBoolean: !!shouldUseConnectKit, shouldUseConnectKit })

  return { shouldUseConnectKit }
}
