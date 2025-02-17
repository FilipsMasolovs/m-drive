import React from 'react'

import { forceDownload } from '~/lib/utils/forceDownload'

import styles from './ItemModal.module.css'

interface ItemModalProps {
  type: 'image' | 'pdf' | 'video'
  url: string
  name: string
  setIsModalOpen: (open: boolean) => void
}

export default function ItemModal({ type, url, name, setIsModalOpen }: ItemModalProps) {
  const renderContent = () => {
    if (type === 'image') {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={url} alt={name} className={styles.modalContent} />
    } else if (type === 'pdf') {
      return (
        <object data={url} type="application/pdf" className={styles.modalContent} width="100%" height="100%" >
          <p>
            Your browser does not support PDFs. <a href={url}>Download the PDF</a>.
          </p>
        </object>
      )
    } else if (type === 'video') {
      return (
        <video controls className={styles.modalContent} width="100%" height="100%">
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )
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
