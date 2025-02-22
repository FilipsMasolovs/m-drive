import { useEffect } from 'react'

export default function useClickOutside(ref: React.RefObject<HTMLElement>, callback: () => void, active: boolean) {
	useEffect(() => {
		if (!active) {
			return
		}
		const handleClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				callback()
			}
		}
		document.addEventListener('click', handleClickOutside)

		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [ref, callback, active])
}
