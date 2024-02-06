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
