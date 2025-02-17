import { auth } from '@clerk/nextjs/server'
import { SignInButton } from '@clerk/nextjs'
import Link from 'next/link'

import HomeComponent from '~/components/HomeComponent/HomeComponent'

import styles from './page.module.css'

export default async function Home() {
  const session = await auth()

  let buttonComponent = null

  if (!session.userId) {
    buttonComponent = (
      <div className={styles.formContainer}>
        <div className={styles.formButton}>
          <SignInButton forceRedirectUrl={'/drive'}>GET STARTED</SignInButton>
        </div>
        <span className={styles.formDetails}>with M-DRIVE</span>
      </div>
    )
  } else {
    buttonComponent = (
      <div className={styles.formContainer}>
        <div className={styles.formButton}>
          <Link href="/drive">GET STARTED</Link>
        </div>
        <span className={styles.formDetails}>with M-DRIVE</span>
      </div>
    )
  }

  return <HomeComponent buttonComponent={buttonComponent} />
}
