import React, { useEffect } from 'react'
import ActionButton from '~/components/common/ActionButton/ActionButton'
import { ArrowLeftIcon, ArrowRightIcon, DeleteIcon, DownloadIcon, RenameIcon } from '~/components/common/Icons/Icons'
import GenericModal from '~/components/modals/GenericModal/GenericModal'
import { isMobileDevice } from '~/lib/utils/device/isMobileDevice'
import { forceDownload } from '~/lib/utils/files/forceDownload'
import { formatSize } from '~/lib/utils/files/formatSize'
import styles from './ItemModal.module.css'

import { FileTypes } from '~/lib/constants/fileTypes'
import JsonPreview from '../previews/JsonPreview'
import MarkdownPreview from '../previews/MarkdownPreview'

interface ItemModalProps {
	type: string
	size: number
	url: string
	uploadThingUrl: string
	name: string
	setIsModalOpen: (open: boolean) => void
	onRename: () => void
	onDelete: () => void
	onPrev?: () => void
	onNext?: () => void
}

export default React.memo(function ItemModal({ type, size, url, uploadThingUrl, name, setIsModalOpen, onRename, onDelete, onPrev, onNext }: ItemModalProps) {
	console.log('type: ', type)
	const renderContent = () => {
		switch (type) {
			case FileTypes.IMAGE:
				return (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={url} alt={name} className={styles.modalContent} />
				)
			case FileTypes.PDF:
				return (
					<object data={url} type="application/pdf" className={styles.modalContent} width="100%" height="100%">
						<p>
							Unable to display PDF. <a href={url}>Download</a> instead.
						</p>
					</object>
				)
			case FileTypes.VIDEO:
				return (
					<video controls className={styles.modalContent} width="100%" height="100%">
						<source src={url} type="video/mp4" />
						Your browser does not support video playback.
					</video>
				)
			case FileTypes.AUDIO:
				return (
					<audio controls className={styles.modalContent} style={{ height: '152px' }}>
						<source src={url} type="audio/mpeg" />
						Your browser does not support audio playback.
					</audio>
				)
			case FileTypes.JSON:
				return (
					<div className={styles.modalContent}>
						<JsonPreview url={url} />
					</div>
				)
			case FileTypes.MARKDOWN:
				return (
					<div className={styles.modalContent}>
						<MarkdownPreview url={url} />
					</div>
				)
			case FileTypes.TXT:
				return (
					<div className={styles.modalContent}>
						<iframe src={url} title={name} className={styles.modalContent} sandbox="allow-same-origin" width="100%" height="100%" />
					</div>
				)
			default:
				return (
					<div className={styles.modalContent}>
						<p>Preview not available for this file type.</p>
						<p>Download to view</p>
					</div>
				)
		}
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (onPrev && e.key === 'ArrowLeft') {
				onPrev()
			}
			if (onNext && e.key === 'ArrowRight') {
				onNext()
			}
		}
		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [onPrev, onNext])

	return (
		<GenericModal onClose={() => setIsModalOpen(false)} ariaLabel={`${type} preview for ${name}`}>
			<div className={styles.itemInformation}>
				<span>{name}</span>
				<span>
					{type} • {formatSize(size)}
				</span>
			</div>
			{onPrev && (
				<button className={styles.prevButton} onClick={onPrev} aria-label="Previous file">
					<ArrowLeftIcon />
				</button>
			)}
			{renderContent()}
			{onNext && (
				<button className={styles.nextButton} onClick={onNext} aria-label="Next file">
					<ArrowRightIcon />
				</button>
			)}
			<div className={styles.itemActions}>
				<ActionButton onClick={() => void forceDownload(uploadThingUrl, name)} icon={<DownloadIcon />} label="Download" isMobile={isMobileDevice()} />
				<ActionButton onClick={onRename} icon={<RenameIcon />} label="Rename" isMobile={isMobileDevice()} />
				<ActionButton onClick={onDelete} icon={<DeleteIcon />} label="Delete" isMobile={isMobileDevice()} />
			</div>
		</GenericModal>
	)
})
