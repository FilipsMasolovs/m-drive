import styles from './ImageModal.module.css'

export default function ImageModal({ url, name, setIsModalOpen }: { url: string; name: string; setIsModalOpen: (state: boolean) => void }) {
  return (
    <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img src={url} alt={name} className={styles.modalImage} />
        <button className={styles.modalClose} onClick={() => setIsModalOpen(false)}>
          X
        </button>
      </div>
    </div>
  )
}
