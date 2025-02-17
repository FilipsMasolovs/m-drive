import { forceDownload } from '~/lib/utils/forceDownload'

import styles from './VideoModal.module.css'

export function VideoModal({ url, name, setIsModalOpen }: { url: string; name: string; setIsModalOpen: (state: boolean) => void }) {
  return (
    <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <video controls className={styles.modalContent}>
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <button
          onClick={async () => {
            await forceDownload(url, name)
          }}
          className={styles.downloadButton}
        >
          Download
        </button>
        <button className={styles.modalClose} onClick={() => setIsModalOpen(false)}>
          X
        </button>
      </div>
    </div>
  )
}
