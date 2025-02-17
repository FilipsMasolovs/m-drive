import styles from './PdfModal.module.css'

export function PdfModal({ url, setIsModalOpen }: { url: string; setIsModalOpen: (state: boolean) => void }) {
  return (
    <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <object data={url} type="application/pdf" className={styles.modalPdf}>
          <p>
            Your browser does not support PDFs. <a href={url}>Download the PDF</a>.
          </p>
        </object>
        <button className={styles.modalClose} onClick={() => setIsModalOpen(false)}>
          X
        </button>
      </div>
    </div>
  )
}
