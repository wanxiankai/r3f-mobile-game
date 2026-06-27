import { useEffect } from 'react'

/**
 * Keeps CSS viewport variables accurate in mobile browsers where URL bars
 * resize the visual viewport after load.
 */
export function useViewportEnvironment(): void {
  useEffect(() => {
    const apply = () => {
      const height = window.visualViewport?.height ?? window.innerHeight
      document.documentElement.style.setProperty('--app-height', `${height}px`)
      document.documentElement.dataset.orientation =
        window.innerWidth >= window.innerHeight ? 'landscape' : 'portrait'
    }

    apply()
    window.visualViewport?.addEventListener('resize', apply)
    window.addEventListener('resize', apply)
    window.addEventListener('orientationchange', apply)

    return () => {
      window.visualViewport?.removeEventListener('resize', apply)
      window.removeEventListener('resize', apply)
      window.removeEventListener('orientationchange', apply)
    }
  }, [])
}
