import { useEffect, useState } from 'react'

export default function useContainerWidth(ref: React.RefObject<HTMLElement>): number {
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }
    const updateWidth = () => {
      setWidth(node.getBoundingClientRect().width)
    }
    updateWidth()
    const resizeObserver = new ResizeObserver(() => {
      updateWidth()
    })
    resizeObserver.observe(node)
    return () => {
      resizeObserver.disconnect()
    }
  }, [ref])

  return width
}
