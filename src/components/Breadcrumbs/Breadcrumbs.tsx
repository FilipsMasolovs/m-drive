import { ChevronRight } from 'lucide-react'

import { type FolderItem } from '~/types/types'

import styles from './Breadcrumbs.module.css'
import Link from 'next/link'

interface BreadcrumbsProps {
  breadcrumbs: FolderItem[]
  rootFolderId: number
}

export default function Breadcrumbs({ breadcrumbs, rootFolderId }: BreadcrumbsProps) {
  return (
    <div className={styles.breadcrumbsContainer}>
      <Link href={`/m/${rootFolderId}`}>M-DRIVE</Link>
      {breadcrumbs.map((item) => (
        <div key={item.id} className={styles.breadcrumbContainer}>
          <ChevronRight />
          <Link href={`/m/${item.id}`}>{item.name}</Link>
        </div>
      ))}
    </div>
  )
}
