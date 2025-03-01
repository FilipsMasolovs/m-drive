import Link from 'next/link'
import React from 'react'

import styles from './AppLogo.module.css'

export default React.memo(function AppLogo({ redirectPath }: { redirectPath: string }) {
	return (
		<Link href={redirectPath} className={styles.appLogo} aria-label="Home">
			<svg viewBox="0 0 32 32" fill="none">
				<rect width="32" height="32" rx="8" fill="#1f2937" />
				<path d="M7 16L16 7L25 16L16 25L7 16Z" fill="#2C4F7C" stroke="#2C4F7C" strokeWidth="2" strokeLinejoin="round" />
				<path d="M16 7V25" stroke="#0A1622" strokeWidth="2" strokeLinecap="round" />
			</svg>
		</Link>
	)
})
