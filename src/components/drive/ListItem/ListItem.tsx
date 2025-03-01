import Link from 'next/link'

import { forceDownload } from '~/lib/utils/files/forceDownload'
import { formatSize } from '~/lib/utils/files/formatSize'
import { getItemIcon } from '~/lib/utils/files/getItemIcon'

import { DeleteIcon, DownloadIcon, RenameIcon } from '~/components/common/Icons/Icons'
import { getPreviewType } from '~/lib/utils/files/getPreviewType'
import { type FileItem, type FolderItem } from '~/types/drive'
import styles from './ListItem.module.css'

export interface ListItemProps {
	item: FileItem | FolderItem
	handleItemClick: React.MouseEventHandler<HTMLDivElement>
	onRename: React.MouseEventHandler<HTMLButtonElement>
	onDelete: React.MouseEventHandler<HTMLButtonElement>
}

function isFolder(item: FileItem | FolderItem): item is FolderItem {
	return item.type === 'folder'
}

export default function ListItem({ item, handleItemClick, onRename, onDelete }: ListItemProps) {
	const commonContent = (
		<>
			<div className={styles.infoContainer}>
				{getItemIcon(item.type)}
				<div className={styles.itemDetails}>
					<span className={styles.itemName}>{item.name}</span>
					<span className={styles.itemTypeSize}>{isFolder(item) ? 'folder' : `${getPreviewType(item)} • ${formatSize(item.size)} `}</span>
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
						<DownloadIcon />
					</button>
				)}
				<button className={styles.renameButton} onClick={onRename} aria-label="Rename item">
					<RenameIcon />
				</button>
				<button className={styles.deleteButton} onClick={onDelete} aria-label="Delete file">
					<DeleteIcon />
				</button>
			</div>
		</>
	)

	if (isFolder(item)) {
		return (
			<Link href={`/m/${item.id}`} className={styles.listContainer}>
				{commonContent}
			</Link>
		)
	} else {
		return (
			<div className={styles.listContainer} onClick={handleItemClick}>
				{commonContent}
			</div>
		)
	}
}
