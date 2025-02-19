import { getItemIcon } from '~/lib/utils/getItemIcon'
import { formatSize } from '~/lib/utils/formatSize'

import { type FileItem, type FolderItem } from '~/types/types'

import styles from './ListItem.module.css'
import Link from 'next/link'

interface ListItemProps {
  item: FileItem | FolderItem
  handleItemClick: () => void
  handleDelete: () => void
  handleRename: () => void
}

export default function ListItem({ item, handleItemClick, handleDelete, handleRename }: ListItemProps) {
  const commonContent = (
    <>
      <div className={styles.infoContainer}>
        {getItemIcon(item.type)}
        <div className={styles.itemDetails}>
          <span className={styles.itemName}>{item.name}</span>
          <span className={styles.itemTypeSize}>
            {`${item.type[0]!.toUpperCase()}${item.type.slice(1)}${item.type !== 'folder' && 'size' in item ? ` • ${formatSize(item.size)}` : ''}`}
          </span>
        </div>
      </div>
      <div className={styles.actionButtons}>
        <button
          className={styles.renameButton}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            handleRename()
          }}
          aria-label="Rename item"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 5H14M14 5H19M14 5V19M9 19H14M14 19H19" stroke="white" />
            <path d="M11 9H4C2.89543 9 2 9.89543 2 11V15H11" stroke="white" />
            <path d="M17 15H20C21.1046 15 22 14.1046 22 13V9H17" stroke="white" />
          </svg>
        </button>
        <button
          className={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            handleDelete()
          }}
          aria-label="Delete file"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20.5001 6H3.5" stroke="white" strokeLinecap="round" />
            <path
              d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5"
              stroke="white"
              strokeLinecap="round"
            />
            <path d="M9.5 11L10 16" stroke="white" strokeLinecap="round" />
            <path d="M14.5 11L14 16" stroke="white" strokeLinecap="round" />
            <path
              d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"
              stroke="white"
            />
          </svg>
        </button>
      </div>
    </>
  )

  if (item.type === 'folder') {
    return (
      <Link href={`/m/${item.id}`} className={styles.listContainer}>
        {commonContent}
      </Link>
    )
  } else {
    return (
      <div className={styles.listContainer} onClick={() => handleItemClick()}>
        {commonContent}
      </div>
    )
  }
}
