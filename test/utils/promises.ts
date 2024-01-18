import { sleep } from '@/lib/shared/utils/time'
import { act } from 'react-dom/test-utils'

// awaits ms milliseconds in the context of a hook test
export async function actSleep(ms: number) {
  return await act(() => sleep(ms))
}
