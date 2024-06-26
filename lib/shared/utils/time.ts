import { act } from '@testing-library/react'
import { sub, millisecondsToSeconds } from 'date-fns'

export async function sleep(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

export function getTimestampInMinsFromNow(mins: number) {
  const nowInSecs = Date.now() / 1000
  const secondsToAdd = mins * 60
  return Math.floor(nowInSecs + secondsToAdd)
}

// Awaits in the context of a react hook test
export async function actSleep(ms: number) {
  return act(async () => {
    await sleep(ms)
  })
}

export function getTimestamp() {
  return {
    minsAgo: (minutes: number) => sub(millisecondsToSeconds(new Date().getTime()), { minutes }),
  }
}
