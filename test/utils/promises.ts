import { act } from 'react-dom/test-utils'

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// awaits ms milliseconds in the context of a hook test
export async function actSleep(ms: number) {
  return await act(() => sleep(ms))
}
