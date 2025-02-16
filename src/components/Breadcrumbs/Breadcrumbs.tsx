import { ChevronRight } from 'lucide-react'

import { type FolderItem } from '~/types/types'

import styles from './Breadcrumbs.module.css'

interface BreadcrumbsProps {
  breadcrumbs: FolderItem[]
  handleBreadcrumbClick: (index: number) => void
}

export default function Breadcrumbs({ breadcrumbs, handleBreadcrumbClick }: BreadcrumbsProps) {
  return (
    <div className={styles.breadcrumbsContainer}>
      <button onClick={() => handleBreadcrumbClick(0)}>M-Drive</button>
      {breadcrumbs.map((item, index) => (
        <div key={item.id} className={styles.breadcrumbContainer}>
          <ChevronRight />
          <button onClick={() => handleBreadcrumbClick(index + 1)}>{item.name}</button>
        </div>
      ))}
    </div>
  )
}
