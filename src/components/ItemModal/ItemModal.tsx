import React from 'react'

import { forceDownload } from '~/lib/utils/forceDownload'

import styles from './ItemModal.module.css'

interface ItemModalProps {
  type: 'image' | 'pdf' | 'video' | 'application' | 'text/plain' | 'audio'
  url: string
  name: string
  setIsModalOpen: (open: boolean) => void
}

export default function ItemModal({ type, url, name, setIsModalOpen }: ItemModalProps) {
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
      default:
        return null
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
      <div className={styles.modalWrapper} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
          X
        </button>
        {renderContent()}
        <button
          onClick={async () => {
            await forceDownload(url, name)
          }}
          className={styles.downloadButton}
        >
          Download
        </button>
      </div>
    </div>
  )
}
