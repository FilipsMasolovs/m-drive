'use client'

import { isMobileDevice } from '~/lib/utils/isMobile'

import styles from './HomeComponent.module.css'
import MobileComponent from '../MobileComponent/MobileComponent'

interface HomeComponentProps {
  buttonComponent: React.ReactNode
}

export default function HomeComponent({ buttonComponent }: HomeComponentProps) {
  const isMobile = isMobileDevice()

  return (
    <>
      {isMobile ? (
        <MobileComponent />
      ) : (
        <div className={styles.pageContainer}>
          <h1 className={styles.title}>
            M-DRIVE
            <i>M-DRIVE</i>
            <i>M-DRIVE</i>
          </h1>
          {buttonComponent}
        </div>
      )}
    </>
  )
}
