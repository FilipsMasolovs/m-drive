import React from 'react'

interface ActionButtonProps {
	onClick: () => void
	icon: React.ReactNode
	label: string
	isMobile: boolean
}

export default React.memo(function ActionButton({ onClick, icon, label, isMobile }: ActionButtonProps) {
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		e.preventDefault()
		onClick()
	}

	return (
		<button onClick={handleClick} aria-label={label}>
			{isMobile ? icon : label}
		</button>
	)
})
