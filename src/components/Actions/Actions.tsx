import { UserButton } from '@clerk/nextjs'
import { formatSize } from '~/lib/utils/formatSize'

import styles from './Actions.module.css'

interface ActionsProps {
  capacityUsed: number
  maxCapacity: number
}

export default function Actions({ capacityUsed, maxCapacity }: ActionsProps) {
  const usedPercentage = Math.min((capacityUsed / maxCapacity) * 100, 100)

  return (
    <div className={styles.actionsContainer}>
      <div className={styles.usageContainer}>
        <span>0 MB</span>
        <div className={styles.usageBar}>
          <div className={styles.usageFill} style={{ width: `${usedPercentage}%` }} />
          <span className={styles.capacityUsed} style={usedPercentage < 50 ? { left: `${usedPercentage + 2}px` } : { left: `${usedPercentage - 48}px`, color: "white" }}>
            {formatSize(capacityUsed)}
          </span>
        </div>
        <span>{formatSize(maxCapacity)}</span>
        <span className={styles.usageDescription}>Your FREE capacity</span>
      </div>
      <UserButton />
    </div>
  )
}
