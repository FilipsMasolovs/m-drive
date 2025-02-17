'use client'

import styles from './MobileComponent.module.css'

export default function MobileComponent() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>
        M-DRIVE
        <i>M-DRIVE</i>
        <i>M-DRIVE</i>
      </h1>
      <p className={styles.description}>Unfortunately, not yet on mobile...</p>
    </div>
  )
}
