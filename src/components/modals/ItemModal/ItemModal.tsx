import React from 'react'
import GenericModal from '~/components/modals/GenericModal/GenericModal'
import styles from './ItemModal.module.css'
import { forceDownload } from '~/lib/utils/files/forceDownload'
import { isMobileDevice } from '~/lib/utils/device/isMobileDevice'
import { formatSize } from '~/lib/utils/files/formatSize'
import { ActionButton } from '~/components/common/ActionButton/ActionButton'
import { DeleteIcon, DownloadIcon, RenameIcon } from '~/components/common/Icons/Icons'

import MarkdownPreview from '../previews/MarkdownPreview'
import JsonPreview from '../previews/JsonPreview'
import { FileTypes } from '~/lib/constants/fileTypes'

interface ItemModalProps {
  type: string
  size: number
  url: string
  uploadThingUrl: string
  name: string
  setIsModalOpen: (open: boolean) => void
  onRename: () => void
  onDelete: () => void
}

export default React.memo(function ItemModal({ type, size, url, uploadThingUrl, name, setIsModalOpen, onRename, onDelete }: ItemModalProps) {
  const renderContent = () => {
    switch (type) {
      case FileTypes.IMAGE:
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={url} alt={name} className={styles.modalContent} />
      case FileTypes.PDF:
        return (
          <object data={url} type="application/pdf" className={styles.modalContent}>
            <p>
              Unable to display PDF. <a href={url}>Download</a> instead.
            </p>
          </object>
        )
      case FileTypes.VIDEO:
        return (
          <video controls className={styles.modalContent}>
            <source src={url} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        )
      case FileTypes.AUDIO:
        return (
          <audio controls className={styles.modalContent}>
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
            <iframe src={url} title={name} className={styles.modalContent} sandbox="allow-same-origin" />
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

  return (
    <GenericModal onClose={() => setIsModalOpen(false)} ariaLabel={`${type} preview for ${name}`}>
      <div className={styles.itemInformation}>
        <span>{name}</span>
        <span>
          {type} • {formatSize(size)}
        </span>
      </div>
      {renderContent()}
      <div className={styles.itemActions}>
        <ActionButton onClick={() => void forceDownload(uploadThingUrl, name)} icon={<DownloadIcon />} label="Download" isMobile={isMobileDevice()} />
        <ActionButton onClick={onRename} icon={<RenameIcon />} label="Rename" isMobile={isMobileDevice()} />
        <ActionButton onClick={onDelete} icon={<DeleteIcon />} label="Delete" isMobile={isMobileDevice()} />
      </div>
    </GenericModal>
  )
})
