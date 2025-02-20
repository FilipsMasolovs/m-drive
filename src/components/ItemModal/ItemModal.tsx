import React, { useEffect } from 'react'
import { forceDownload } from '~/lib/utils/forceDownload'
import styles from './ItemModal.module.css'
import DocxModal from '~/components/DocxModal/DocxModal'

interface ItemModalProps {
  type: 'image' | 'pdf' | 'video' | 'application' | 'text/plain' | 'audio' | 'docx' | null
  url: string
  name: string
  setIsModalOpen: (open: boolean) => void
  onRename?: () => void
  onDelete?: () => void
}

export default function ItemModal({ type, url, name, setIsModalOpen, onRename, onDelete }: ItemModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [setIsModalOpen])

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
          <audio controls className={styles.modalContent}>
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
    <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)} role="presentation">
      <div className={styles.modalWrapper} role="dialog" aria-modal="true" aria-label={`${type} preview for ${name}`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={() => setIsModalOpen(false)} aria-label="Close modal">
          X
        </button>
        {renderContent()}
        <div className={styles.itemActions}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              void forceDownload(url, name).catch((err) => {
                console.error('Download failed', err)
              })
            }}
            className={styles.actionButton}
            aria-label="Download file"
          >
            Download
          </button>
          <button
            onClick={() => {
              if (onRename) onRename()
            }}
            className={styles.actionButton}
            aria-label="Rename file"
          >
            Rename
          </button>
          <button
            onClick={() => {
              if (onDelete) onDelete()
            }}
            className={styles.actionButton}
            aria-label="Delete file"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
