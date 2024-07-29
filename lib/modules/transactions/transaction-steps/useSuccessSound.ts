import useSound from 'use-sound'

export function useSuccessSound() {
  const isCowTransaction = window.location.pathname.includes('cow')

  const soundSrc = isCowTransaction ? '/sounds/moo.mp3' : '/sounds/gong.mp3'
  const [playSuccessSound] = useSound(soundSrc)
  return { playSuccessSound }
}
