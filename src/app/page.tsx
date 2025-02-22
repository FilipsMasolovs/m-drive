import { auth } from '@clerk/nextjs/server'
import { SignInButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import styles from './page.module.css'

export default async function Home() {
	const session = await auth()

	if (session.userId) {
		return redirect('/drive')
	}

	return (
		<main className={styles.pageContainer}>
			<h1 className={styles.title}>
				M-DRIVE
				<i aria-hidden="true">M-DRIVE</i>
				<i aria-hidden="true">M-DRIVE</i>
			</h1>
			<div className={styles.loginButton}>
				<SignInButton forceRedirectUrl={'/drive'} fallbackRedirectUrl={'/drive'} signUpForceRedirectUrl={'/drive'} signUpFallbackRedirectUrl={'/drive'}>
					LOGIN
				</SignInButton>
			</div>
		</main>
	)
}
