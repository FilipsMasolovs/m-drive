import React from 'react'
import GenericModal from '~/components/modals/GenericModal/GenericModal'
import styles from './ItemModal.module.css'
import DocxModal from '~/components/modals/DocxModal/DocxModal'
import { forceDownload } from '~/lib/utils/files/forceDownload'
import { isMobileDevice } from '~/lib/utils/device/isMobileDevice'
import { formatSize } from '~/lib/utils/files/formatSize'
import { ActionButton } from '~/components/common/ActionButton/ActionButton'
import { DeleteIcon, DownloadIcon, RenameIcon } from '~/components/common/Icons/Icons'

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
      case 'image':
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={url} alt={name} className={styles.modalContent} />
      case 'pdf':
        return (
          <object data={url} type="application/pdf" className={styles.modalContent} width="100%" height="100%">
            <p>
              Your browser does not support PDFs. <a href={url}>Download the PDF</a>.
            </p>
          </object>
        )
      case 'video':
        return (
          <video controls className={styles.modalContent} width="100%" height="100%">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )
      case 'application':
        return (
          <div className={styles.modalContent}>
            <p>Preview is not available. Please download to view the contents.</p>
          </div>
        )
      case 'text/plain':
        return <iframe src={url} title={name} className={styles.modalContent} width="100%" height="100%" />
      case 'audio':
        return (
          <audio controls className={styles.modalContent} style={{ height: '152px' }}>
            <source src={url} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        )
      case 'docx':
        return <DocxModal url={url} name={name} setIsModalOpen={setIsModalOpen} />
      default:
        return (
          <div className={styles.modalContent}>
            <p>File preview not available. Please download to view the file.</p>
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
