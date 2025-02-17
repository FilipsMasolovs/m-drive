export function isMobileDevice(): boolean {
  const opera = (window as Window & { opera?: string }).opera ?? ''
  const userAgent: string = navigator.userAgent || navigator.vendor || opera
  const uaCheck: boolean = /android|iPad|iPhone|iPod|blackberry|iemobile|opera mini/i.test(userAgent)
  const mql: boolean = window.matchMedia('(max-width: 767px)').matches

  return uaCheck || mql
}
