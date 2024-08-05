/* From rainbowkit utils
  https://github.com/rainbow-me/rainbowkit/blob/379bc564c7b9daa1ba186c96a1adb39d89bef652/packages/rainbowkit/src/utils/isMobile.ts
*/
export function isAndroid() {
  return typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent)
}
export function isSmallIOS() {
  return typeof navigator !== 'undefined' && /iPhone|iPod/.test(navigator.userAgent)
}
export function isLargeIOS() {
  return (
    typeof navigator !== 'undefined' &&
    (/iPad/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))
  )
}
export function isIOS() {
  return isSmallIOS() || isLargeIOS()
}
export function isMobileDevice() {
  return isAndroid() || isIOS()
}
