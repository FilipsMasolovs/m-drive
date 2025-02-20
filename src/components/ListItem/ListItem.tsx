import Link from 'next/link'

import { getItemIcon } from '~/lib/utils/getItemIcon'
import { formatSize } from '~/lib/utils/formatSize'
import { forceDownload } from '~/lib/utils/forceDownload'
import { type FileItem, type FolderItem } from '~/types/types'

import styles from './ListItem.module.css'

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
        {'url' in item && (
          <button
            className={styles.downloadButton}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              void forceDownload(item.url, item.name).catch((err) => {
                console.error('Download failed', err)
              })
            }}
            aria-label="Download item"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z"
                fill="white"
              />
              <path
                d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z"
                fill="white"
              />
            </svg>
          </button>
        )}
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
