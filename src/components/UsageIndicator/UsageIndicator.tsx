import { formatSize } from '~/lib/utils/formatSize'

import styles from './UsageIndicator.module.css'

interface UsageIndicatorProps {
  capacityUsed: number
  maxCapacity: number
}

export default function UsageIndicator({ capacityUsed, maxCapacity }: UsageIndicatorProps) {
  const usedPercentage = Math.min((capacityUsed / maxCapacity) * 100, 100)

  return (
    <div className={styles.usageIndicatorContainer}>
      <span>0 MB</span>
      <div className={styles.usageBar}>
        <div className={styles.usageFill} style={{ width: `${usedPercentage}%` }} />
        <span
          className={styles.capacityUsed}
          style={usedPercentage < 50 ? { left: `${usedPercentage + 2}px`, color: 'black' } : { left: `${usedPercentage - 48}px`, color: 'white' }}
        >
          {formatSize(capacityUsed)}
        </span>
      </div>
      <span>{formatSize(maxCapacity)}</span>
    </div>
  )
}
