import { forceDownload } from '~/lib/utils/forceDownload';

import styles from './PdfModal.module.css'

export function PdfModal({ url, name, setIsModalOpen }: { url: string; name: string, setIsModalOpen: (state: boolean) => void }) {
  return (
    <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <object data={url} type="application/pdf" className={styles.modalContent}>
          <p>
            Your browser does not support PDFs. <a href={url}>Download the PDF</a>.
          </p>
        </object>
        <button onClick={async () => {await forceDownload(url, name)}} className={styles.downloadButton}>
          Download
        </button>
        <button className={styles.modalClose} onClick={() => setIsModalOpen(false)}>
          X
        </button>
      </div>
    </div>
  )
}
